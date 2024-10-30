export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface League {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface LeagueTeam {
  id: string;
  leagueId: string;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export type MatchStatus = "scheduled" | "completed";

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  locationId: string | null;
  weekNumber: number;
  date: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}
