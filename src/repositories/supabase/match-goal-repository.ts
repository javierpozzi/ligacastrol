import { MatchGoal } from "../../types";
import { MatchGoalRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type MatchGoalRow = Database["public"]["Tables"]["match_goals"]["Row"];

export class SupabaseMatchGoalRepository extends SupabaseBaseRepository<MatchGoal> implements MatchGoalRepository {
  constructor() {
    super("match_goals");
  }

  protected transformFromDb(data: MatchGoalRow): MatchGoal {
    return {
      id: data.id,
      matchId: data.match_id,
      playerId: data.player_id ?? undefined,
      teamId: data.team_id,
    };
  }

  protected transformToDb(data: Omit<MatchGoal, "id">): Database["public"]["Tables"]["match_goals"]["Insert"] {
    return {
      match_id: data.matchId,
      player_id: data.playerId ?? null,
      team_id: data.teamId,
    };
  }

  async getByMatchId(matchId: string): Promise<MatchGoal[]> {
    const { data, error } = await this.client.from(this.table).select("*").eq("match_id", matchId).order("created_at");

    if (error) throw error;
    return data.map(this.transformFromDb);
  }

  async getByLeagueId(leagueId: string): Promise<MatchGoal[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select(
        `
        *,
        matches!inner (
          league_id
        )
      `
      )
      .eq("matches.league_id", leagueId)
      .order("created_at");

    if (error) throw error;
    return data.map((row) => this.transformFromDb(row));
  }

  async create(data: Omit<MatchGoal, "id">): Promise<MatchGoal> {
    const { data: created, error } = await this.client
      .from(this.table)
      .insert([this.transformToDb(data)])
      .select()
      .single();

    if (error) throw error;
    if (!created) throw new Error("Failed to create match goal");

    return this.transformFromDb(created);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from(this.table).delete().eq("id", id);

    if (error) throw error;
  }
}
