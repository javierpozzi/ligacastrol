export type EntityId = string;

export interface BaseEntity {
  id: EntityId;
}

export interface Team extends BaseEntity {
  name: string;
  logo: string;
}

export interface League extends BaseEntity {
  name: string;
  teams: EntityId[];
}

export interface Location extends BaseEntity {
  name: string;
  address: string;
}

export type MatchStatus = "scheduled" | "completed";

export interface Match extends BaseEntity {
  homeTeamId: EntityId;
  awayTeamId: EntityId;
  leagueId: EntityId;
  locationId: EntityId | null;
  weekNumber: number;
  date: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

export interface Standing extends BaseEntity {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
