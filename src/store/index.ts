import { create } from "zustand";
import { Team, League, Location, Match, LeagueTeam } from "../types";
import { generateFixtures } from "../utils/fixtures";

export interface StoreState {
  teams: Team[];
  leagues: League[];
  leagueTeams: LeagueTeam[];
  locations: Location[];
  matches: Match[];
  addTeam: (team: Omit<Team, "id">) => { id: string };
  updateTeam: (id: string, updates: Partial<Omit<Team, "id">>) => void;
  deleteTeam: (id: string) => void;
  addLeague: (league: Omit<League, "id">) => { id: string };
  updateLeague: (id: string, updates: Partial<Omit<League, "id">>) => void;
  deleteLeague: (id: string) => void;
  addLocation: (location: Omit<Location, "id">) => { id: string };
  updateLocation: (id: string, updates: Partial<Omit<Location, "id">>) => void;
  deleteLocation: (id: string) => void;
  generateLeagueFixtures: (leagueId: string) => void;
  clearLeagueFixtures: (leagueId: string) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  updateTeamStats: () => void;
  clearStore: () => void;
  addTeamToLeague: (leagueId: string, teamId: string) => void;
  removeTeamFromLeague: (leagueId: string, teamId: string) => void;
  getLeagueTeams: (leagueId: string) => LeagueTeam[];
  updateLeagueTeamStats: (
    leagueId: string,
    teamId: string,
    updates: Partial<Omit<LeagueTeam, "id" | "leagueId" | "teamId">>
  ) => void;
}

const emptyState = {
  teams: [] as Team[],
  leagues: [],
  leagueTeams: [],
  locations: [],
  matches: [],
};

export const useStore = create<StoreState>((set, get) => ({
  ...emptyState,

  addTeam: (team) => {
    const id = crypto.randomUUID();
    set((state) => ({
      teams: [
        ...state.teams,
        {
          ...team,
          id,
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 9,
            preferredEndHour: 21,
            ...team.preferences,
          },
        },
      ],
    }));
    return { id };
  },

  updateTeam: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === id
          ? {
              ...team,
              ...updates,
              preferences: {
                ...team.preferences,
                ...updates.preferences,
              },
            }
          : team
      ),
    })),

  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
    })),

  addLeague: (league) => {
    const id = crypto.randomUUID();
    set((state) => ({
      leagues: [...state.leagues, { ...league, id }],
    }));
    return { id };
  },

  updateLeague: (id, updates) =>
    set((state) => ({
      leagues: state.leagues.map((league) => (league.id === id ? { ...league, ...updates } : league)),
    })),

  deleteLeague: (id) =>
    set((state) => ({
      leagues: state.leagues.filter((league) => league.id !== id),
      matches: state.matches.filter((match) => match.leagueId !== id),
      leagueTeams: state.leagueTeams.filter((lt) => lt.leagueId !== id),
    })),

  addLocation: (location) => {
    const id = crypto.randomUUID();
    set((state) => ({
      locations: [...state.locations, { ...location, id }],
    }));
    return { id };
  },

  updateLocation: (id, updates) =>
    set((state) => ({
      locations: state.locations.map((location) => (location.id === id ? { ...location, ...updates } : location)),
    })),

  deleteLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
    })),

  clearLeagueFixtures: (leagueId) =>
    set((state) => ({
      matches: state.matches.filter((match) => match.leagueId !== leagueId),
    })),

  generateLeagueFixtures: (leagueId: string) => {
    set((state) => {
      try {
        const teams = state.leagueTeams.filter((lt) => lt.leagueId === leagueId);

        if (teams.length < 2) {
          throw new Error("Need at least 2 teams to generate fixtures");
        }

        // Clear existing fixtures first
        const matchesWithoutLeague = state.matches.filter((m) => m.leagueId !== leagueId);

        const teamIds = teams.map((t) => t.teamId);
        const fixtures = generateFixtures(teamIds);
        const fixturesPerWeek = Math.floor(teamIds.length / 2);

        const newMatches = fixtures.map((fixture, index) => ({
          id: crypto.randomUUID(),
          leagueId,
          homeTeamId: fixture.home,
          awayTeamId: fixture.away,
          weekNumber: Math.floor(index / fixturesPerWeek) + 1,
          date: null,
          locationId: null,
          homeScore: null,
          awayScore: null,
          status: "scheduled" as const,
        }));

        return {
          ...state,
          matches: [...matchesWithoutLeague, ...newMatches],
        };
      } catch (error) {
        console.error("Failed to generate fixtures:", error);
        throw error;
      }
    });
  },

  updateMatch: (matchId: string, updates: Partial<Match>) =>
    set((state) => {
      const match = state.matches.find((m) => m.id === matchId);
      if (!match) return state;

      const updatedMatch = { ...match, ...updates };

      // Only update stats if the match is being marked as completed
      if (
        match.status !== "completed" &&
        updatedMatch.status === "completed" &&
        updatedMatch.homeScore !== null &&
        updatedMatch.awayScore !== null
      ) {
        // Update home team stats
        const homeTeamStats = state.leagueTeams.find(
          (lt) => lt.leagueId === match.leagueId && lt.teamId === match.homeTeamId
        );
        if (homeTeamStats) {
          const homeTeamUpdates = {
            played: homeTeamStats.played + 1,
            won: updatedMatch.homeScore > updatedMatch.awayScore ? homeTeamStats.won + 1 : homeTeamStats.won,
            drawn: updatedMatch.homeScore === updatedMatch.awayScore ? homeTeamStats.drawn + 1 : homeTeamStats.drawn,
            lost: updatedMatch.homeScore < updatedMatch.awayScore ? homeTeamStats.lost + 1 : homeTeamStats.lost,
            goalsFor: homeTeamStats.goalsFor + updatedMatch.homeScore,
            goalsAgainst: homeTeamStats.goalsAgainst + updatedMatch.awayScore,
            points:
              homeTeamStats.points +
              (updatedMatch.homeScore > updatedMatch.awayScore
                ? 3
                : updatedMatch.homeScore === updatedMatch.awayScore
                ? 1
                : 0),
          };
          state = {
            ...state,
            leagueTeams: state.leagueTeams.map((lt) =>
              lt.id === homeTeamStats.id ? { ...lt, ...homeTeamUpdates } : lt
            ),
          };
        }

        // Update away team stats
        const awayTeamStats = state.leagueTeams.find(
          (lt) => lt.leagueId === match.leagueId && lt.teamId === match.awayTeamId
        );
        if (awayTeamStats) {
          const awayTeamUpdates = {
            played: awayTeamStats.played + 1,
            won: updatedMatch.awayScore > updatedMatch.homeScore ? awayTeamStats.won + 1 : awayTeamStats.won,
            drawn: updatedMatch.awayScore === updatedMatch.homeScore ? awayTeamStats.drawn + 1 : awayTeamStats.drawn,
            lost: updatedMatch.awayScore < updatedMatch.homeScore ? awayTeamStats.lost + 1 : awayTeamStats.lost,
            goalsFor: awayTeamStats.goalsFor + updatedMatch.awayScore,
            goalsAgainst: awayTeamStats.goalsAgainst + updatedMatch.homeScore,
            points:
              awayTeamStats.points +
              (updatedMatch.awayScore > updatedMatch.homeScore
                ? 3
                : updatedMatch.awayScore === updatedMatch.homeScore
                ? 1
                : 0),
          };
          state = {
            ...state,
            leagueTeams: state.leagueTeams.map((lt) =>
              lt.id === awayTeamStats.id ? { ...lt, ...awayTeamUpdates } : lt
            ),
          };
        }
      }

      // If match is being unmarked as completed, reverse the stats
      if (
        match.status === "completed" &&
        updatedMatch.status !== "completed" &&
        match.homeScore !== null &&
        match.awayScore !== null
      ) {
        // Similar logic to above but subtracting stats instead of adding
        // ... implement reverse stats logic ...
      }

      return {
        ...state,
        matches: state.matches.map((m) => (m.id === matchId ? updatedMatch : m)),
      };
    }),

  updateTeamStats: () => set((state) => state),

  clearStore: () => set(emptyState),

  addTeamToLeague: (leagueId, teamId) => {
    const id = crypto.randomUUID();
    set((state) => ({
      leagueTeams: [
        ...state.leagueTeams,
        {
          id,
          leagueId,
          teamId,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        },
      ],
    }));
  },

  removeTeamFromLeague: (leagueId, teamId) => {
    set((state) => ({
      leagueTeams: state.leagueTeams.filter((lt) => !(lt.leagueId === leagueId && lt.teamId === teamId)),
    }));
  },

  getLeagueTeams: (leagueId) => {
    return get().leagueTeams.filter((lt) => lt.leagueId === leagueId);
  },

  updateLeagueTeamStats: (leagueId, teamId, updates) => {
    set((state) => ({
      leagueTeams: state.leagueTeams.map((lt) =>
        lt.leagueId === leagueId && lt.teamId === teamId ? { ...lt, ...updates } : lt
      ),
    }));
  },
}));
