import { Match } from "../../types";
import { MatchRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type MatchRow = Database["public"]["Tables"]["matches"]["Row"];

export class SupabaseMatchRepository extends SupabaseBaseRepository<Match> implements MatchRepository {
  constructor() {
    super("matches");
  }

  protected transformFromDb(data: MatchRow): Match {
    return {
      id: data.id,
      homeTeamId: data.home_team_id,
      awayTeamId: data.away_team_id,
      leagueId: data.league_id,
      locationId: data.location_id,
      weekNumber: data.week_number,
      date: data.date,
      homeScore: data.home_score,
      awayScore: data.away_score,
      status: data.status,
    };
  }

  protected transformToDb(data: Omit<Match, "id">): Database["public"]["Tables"]["matches"]["Insert"] {
    return {
      home_team_id: data.homeTeamId,
      away_team_id: data.awayTeamId,
      league_id: data.leagueId,
      location_id: data.locationId,
      week_number: data.weekNumber,
      date: data.date,
      home_score: data.homeScore,
      away_score: data.awayScore,
      status: data.status,
    };
  }

  async getByLeagueId(leagueId: string): Promise<Match[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("league_id", leagueId)
      .order("week_number")
      .order("date", { ascending: true });

    if (error) throw error;
    return data.map(this.transformFromDb);
  }
}
