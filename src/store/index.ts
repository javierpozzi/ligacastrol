import { create } from "zustand";
import { Team, League, Location, Match, LeagueTeam } from "../types";
import { generateFixtures } from "../utils/fixtures";

interface Store {
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

const initialState = {
  teams: [
    { id: "1", name: "Real Madrid", logo: "/teams/real-madrid.png" },
    { id: "2", name: "Barcelona", logo: "/teams/barcelona.png" },
    { id: "3", name: "Atletico Madrid", logo: "/teams/atletico-madrid.png" },
    { id: "4", name: "Sevilla", logo: "/teams/sevilla.png" },
  ],
  leagues: [
    { id: "1", name: "La Liga 2024", year: 2024, isActive: true },
    { id: "2", name: "La Liga 2023", year: 2023, isActive: false },
  ],
  leagueTeams: [
    // La Liga 2024 teams
    {
      id: "lt1",
      leagueId: "1",
      teamId: "1",
      played: 3,
      won: 2,
      drawn: 1,
      lost: 0,
      goalsFor: 7,
      goalsAgainst: 2,
      points: 7,
    },
    {
      id: "lt2",
      leagueId: "1",
      teamId: "2",
      played: 3,
      won: 2,
      drawn: 0,
      lost: 1,
      goalsFor: 6,
      goalsAgainst: 3,
      points: 6,
    },
    {
      id: "lt3",
      leagueId: "1",
      teamId: "3",
      played: 3,
      won: 1,
      drawn: 1,
      lost: 1,
      goalsFor: 4,
      goalsAgainst: 4,
      points: 4,
    },
    {
      id: "lt4",
      leagueId: "1",
      teamId: "4",
      played: 3,
      won: 0,
      drawn: 0,
      lost: 3,
      goalsFor: 1,
      goalsAgainst: 9,
      points: 0,
    },
    // La Liga 2023 teams (different stats)
    {
      id: "lt5",
      leagueId: "2",
      teamId: "1",
      played: 38,
      won: 27,
      drawn: 6,
      lost: 5,
      goalsFor: 80,
      goalsAgainst: 30,
      points: 87,
    },
    {
      id: "lt6",
      leagueId: "2",
      teamId: "2",
      played: 38,
      won: 25,
      drawn: 8,
      lost: 5,
      goalsFor: 75,
      goalsAgainst: 35,
      points: 83,
    },
  ],
  locations: [
    { id: "1", name: "Santiago Bernabéu", address: "Av. de Concha Espina, 1, 28036 Madrid" },
    { id: "2", name: "Camp Nou", address: "C. d'Arístides Maillol, 12, 08028 Barcelona" },
  ],
  matches: [
    {
      id: "1",
      homeTeamId: "1",
      awayTeamId: "2",
      leagueId: "1",
      locationId: "1",
      weekNumber: 1,
      date: "2024-01-14",
      homeScore: 3,
      awayScore: 1,
      status: "completed",
    },
    {
      id: "2",
      homeTeamId: "3",
      awayTeamId: "4",
      leagueId: "1",
      locationId: null,
      weekNumber: 1,
      date: "2024-01-14",
      homeScore: 2,
      awayScore: 0,
      status: "completed",
    },
    {
      id: "3",
      homeTeamId: "1",
      awayTeamId: "3",
      leagueId: "1",
      locationId: "1",
      weekNumber: 2,
      date: "2024-01-21",
      homeScore: 2,
      awayScore: 2,
      status: "completed",
    },
    {
      id: "4",
      homeTeamId: "2",
      awayTeamId: "4",
      leagueId: "1",
      locationId: "2",
      weekNumber: 2,
      date: "2024-01-21",
      homeScore: 3,
      awayScore: 0,
      status: "completed",
    },
  ],
};

export const useStore = create<Store>((set, get) => ({
  ...initialState,

  addTeam: (team) => {
    const id = crypto.randomUUID();
    set((state) => ({
      teams: [
        ...state.teams,
        {
          ...team,
          id,
        },
      ],
    }));
    return { id };
  },

  updateTeam: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((team) => (team.id === id ? { ...team, ...updates } : team)),
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

  generateLeagueFixtures: (leagueId) =>
    set((state) => {
      const league = state.leagues.find((l) => l.id === leagueId);
      if (!league) return state;

      const leagueTeams = state.leagueTeams.filter((lt) => lt.leagueId === leagueId).map((lt) => lt.teamId);

      const fixtures = generateFixtures(leagueTeams);
      const matches: Match[] = fixtures.map((fixture, index) => ({
        id: crypto.randomUUID(),
        homeTeamId: fixture.home,
        awayTeamId: fixture.away,
        leagueId,
        locationId: null,
        weekNumber: Math.floor(index / (leagueTeams.length / 2)) + 1,
        date: null,
        homeScore: null,
        awayScore: null,
        status: "scheduled",
      }));

      return {
        ...state,
        matches: [...state.matches, ...matches],
      };
    }),

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

  clearStore: () =>
    set(() => ({
      teams: [],
      leagues: [],
      locations: [],
      matches: [],
    })),

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
