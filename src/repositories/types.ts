import { Team, League, Match, Location, LeagueTeam } from "../types";

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<Omit<T, "id">>): Promise<T>;
  delete(id: string): Promise<void>;
}

export type TeamRepository = Repository<Team>;
export type LeagueRepository = Repository<League>;
export type LocationRepository = Repository<Location>;

export interface MatchRepository extends Repository<Match> {
  getByLeagueId(leagueId: string): Promise<Match[]>;
}

export interface LeagueTeamRepository extends Repository<LeagueTeam> {
  getByLeagueId(leagueId: string): Promise<LeagueTeam[]>;
  getByLeagueAndTeam(leagueId: string, teamId: string): Promise<LeagueTeam | null>;
  getAllTeamsForLeague(leagueId: string): Promise<Team[]>;
}
