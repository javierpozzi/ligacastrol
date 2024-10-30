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
  updateTeamStats: (
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
    reverse?: boolean
  ) => void;
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
    set((state) => ({
      matches: state.matches.map((match) => (match.id === matchId ? { ...match, ...updates } : match)),
    })),

  updateTeamStats: (
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
    reverse: boolean = false
  ) =>
    set((state) => {
      const multiplier = reverse ? -1 : 1;

      return {
        teams: state.teams.map((team) => {
          if (team.id === homeTeamId) {
            const points = homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0;
            return {
              ...team,
              played: team.played + 1 * multiplier,
              won: team.won + (homeScore > awayScore ? 1 : 0) * multiplier,
              drawn: team.drawn + (homeScore === awayScore ? 1 : 0) * multiplier,
              lost: team.lost + (homeScore < awayScore ? 1 : 0) * multiplier,
              goalsFor: team.goalsFor + homeScore * multiplier,
              goalsAgainst: team.goalsAgainst + awayScore * multiplier,
              points: team.points + points * multiplier,
            };
          }
          if (team.id === awayTeamId) {
            const points = awayScore > homeScore ? 3 : homeScore === awayScore ? 1 : 0;
            return {
              ...team,
              played: team.played + 1 * multiplier,
              won: team.won + (awayScore > homeScore ? 1 : 0) * multiplier,
              drawn: team.drawn + (homeScore === awayScore ? 1 : 0) * multiplier,
              lost: team.lost + (awayScore < homeScore ? 1 : 0) * multiplier,
              goalsFor: team.goalsFor + awayScore * multiplier,
              goalsAgainst: team.goalsAgainst + homeScore * multiplier,
              points: team.points + points * multiplier,
            };
          }
          return team;
        }),
      };
    }),
}));
