import { League } from "../../types";
import { LeagueRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type LeagueRow = Database["public"]["Tables"]["leagues"]["Row"];

export class SupabaseLeagueRepository extends SupabaseBaseRepository<League> implements LeagueRepository {
  constructor() {
    super("leagues");
  }

  protected transformFromDb(data: LeagueRow): League {
    return {
      id: data.id,
      name: data.name,
      year: data.year,
      isActive: data.is_active,
    };
  }

  protected transformToDb(data: Omit<League, "id">): Database["public"]["Tables"]["leagues"]["Insert"] {
    return {
      name: data.name,
      year: data.year,
      is_active: data.isActive,
    };
  }

  async getAll(): Promise<League[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .order("year", { ascending: false })
      .order("name");

    if (error) throw error;
    return data.map(this.transformFromDb);
  }
}
