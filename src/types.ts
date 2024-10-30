export interface Team {
  id: string;
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface League {
  id: string;
  name: string;
  teams: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

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
  status: 'scheduled' | 'completed';
}