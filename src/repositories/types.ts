import { Team, League, Match, Location, LeagueTeam } from "../types";

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<Omit<T, "id">>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface TeamRepository extends Repository<Team> {}

export interface LeagueRepository extends Repository<League> {}

export interface MatchRepository extends Repository<Match> {
  getByLeagueId(leagueId: string): Promise<Match[]>;
}

export interface LocationRepository extends Repository<Location> {}

export interface LeagueTeamRepository extends Repository<LeagueTeam> {
  getByLeagueId(leagueId: string): Promise<LeagueTeam[]>;
  getByLeagueAndTeam(leagueId: string, teamId: string): Promise<LeagueTeam | null>;
}
