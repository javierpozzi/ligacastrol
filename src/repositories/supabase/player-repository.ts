import { Player } from "../../types";
import { PlayerRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type PlayerRow = Database["public"]["Tables"]["players"]["Row"];

export class SupabasePlayerRepository extends SupabaseBaseRepository<Player> implements PlayerRepository {
  constructor() {
    super("players");
  }

  protected transformFromDb(data: PlayerRow): Player {
    return {
      id: data.id,
      name: data.name,
      teamId: data.team_id,
      disabled: data.disabled,
    };
  }

  protected transformToDb(data: Omit<Player, "id">): Database["public"]["Tables"]["players"]["Insert"] {
    return {
      name: data.name,
      team_id: data.teamId,
      disabled: data.disabled,
    };
  }

  async getByTeamId(teamId: string): Promise<Player[]> {
    const { data, error } = await this.client.from(this.table).select("*").eq("team_id", teamId).order("name");

    if (error) throw error;
    return data.map(this.transformFromDb);
  }

  async getAll(): Promise<Player[]> {
    const { data, error } = await this.client.from(this.table).select("*").order("name");

    if (error) throw error;
    return data.map(this.transformFromDb);
  }
}
