import { create } from "zustand";
import { Team, League, Location, Match } from "../types";
import { generateFixtures } from "../utils/fixtures";

interface Store {
  teams: Team[];
  leagues: League[];
  locations: Location[];
  matches: Match[];
  addTeam: (team: Omit<Team, "id" | "played" | "won" | "drawn" | "lost" | "goalsFor" | "goalsAgainst" | "points">) => {
    id: string;
  };
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
}

export const useStore = create<Store>((set) => ({
  teams: [],
  leagues: [],
  locations: [],
  matches: [],

  addTeam: (team) => {
    const id = crypto.randomUUID();
    set((state) => ({
      teams: [
        ...state.teams,
        {
          ...team,
          id,
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

      const fixtures = generateFixtures(league.teams);
      const matches: Match[] = fixtures.map((fixture, index) => ({
        id: crypto.randomUUID(),
        homeTeamId: fixture.home,
        awayTeamId: fixture.away,
        leagueId,
        locationId: null,
        weekNumber: Math.floor(index / (league.teams.length / 2)) + 1,
        date: null,
        homeScore: null,
        awayScore: null,
        status: "scheduled",
      }));

      return { matches: [...state.matches.filter((m) => m.leagueId !== leagueId), ...matches] };
    }),

  updateMatch: (matchId, updates) =>
    set((state) => {
      const match = state.matches.find((m) => m.id === matchId);
      if (!match) return state;

      if (
        updates.status === "completed" &&
        typeof updates.homeScore === "number" &&
        typeof updates.awayScore === "number"
      ) {
        if (
          match.status === "completed" &&
          typeof match.homeScore === "number" &&
          typeof match.awayScore === "number"
        ) {
          state = {
            ...state,
            teams: state.teams.map((team) => {
              if (team.id === match.homeTeamId) {
                return {
                  ...team,
                  played: team.played - 1,
                  won: team.won - (match.homeScore > match.awayScore ? 1 : 0),
                  drawn: team.drawn - (match.homeScore === match.awayScore ? 1 : 0),
                  lost: team.lost - (match.homeScore < match.awayScore ? 1 : 0),
                  goalsFor: team.goalsFor - match.homeScore,
                  goalsAgainst: team.goalsAgainst - match.awayScore,
                  points:
                    team.points - (match.homeScore > match.awayScore ? 3 : match.homeScore === match.awayScore ? 1 : 0),
                };
              }
              if (team.id === match.awayTeamId) {
                return {
                  ...team,
                  played: team.played - 1,
                  won: team.won - (match.awayScore > match.homeScore ? 1 : 0),
                  drawn: team.drawn - (match.homeScore === match.awayScore ? 1 : 0),
                  lost: team.lost - (match.awayScore < match.homeScore ? 1 : 0),
                  goalsFor: team.goalsFor - match.awayScore,
                  goalsAgainst: team.goalsAgainst - match.homeScore,
                  points:
                    team.points - (match.awayScore > match.homeScore ? 3 : match.homeScore === match.awayScore ? 1 : 0),
                };
              }
              return team;
            }),
          };
        }

        state = {
          ...state,
          teams: state.teams.map((team) => {
            if (team.id === match.homeTeamId) {
              return {
                ...team,
                played: team.played + 1,
                won: team.won + (updates.homeScore > updates.awayScore ? 1 : 0),
                drawn: team.drawn + (updates.homeScore === updates.awayScore ? 1 : 0),
                lost: team.lost + (updates.homeScore < updates.awayScore ? 1 : 0),
                goalsFor: team.goalsFor + updates.homeScore,
                goalsAgainst: team.goalsAgainst + updates.awayScore,
                points:
                  team.points +
                  (updates.homeScore > updates.awayScore ? 3 : updates.homeScore === updates.awayScore ? 1 : 0),
              };
            }
            if (team.id === match.awayTeamId) {
              return {
                ...team,
                played: team.played + 1,
                won: team.won + (updates.awayScore > updates.homeScore ? 1 : 0),
                drawn: team.drawn + (updates.homeScore === updates.awayScore ? 1 : 0),
                lost: team.lost + (updates.awayScore < updates.homeScore ? 1 : 0),
                goalsFor: team.goalsFor + updates.awayScore,
                goalsAgainst: team.goalsAgainst + updates.homeScore,
                points:
                  team.points +
                  (updates.awayScore > updates.homeScore ? 3 : updates.homeScore === updates.awayScore ? 1 : 0),
              };
            }
            return team;
          }),
        };
      }

      return {
        ...state,
        matches: state.matches.map((m) => (m.id === matchId ? { ...m, ...updates } : m)),
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
}));
