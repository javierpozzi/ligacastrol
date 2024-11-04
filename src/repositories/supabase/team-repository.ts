import { Team } from "../../types";
import { TeamRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type TeamRow = Database["public"]["Tables"]["teams"]["Row"];

export class SupabaseTeamRepository extends SupabaseBaseRepository<Team> implements TeamRepository {
  constructor() {
    super("teams");
  }

  protected transformFromDb(data: TeamRow): Team {
    return {
      id: data.id,
      name: data.name,
      logo: data.logo,
      preferences: data.preferences,
    };
  }

  protected transformToDb(data: Omit<Team, "id">): Database["public"]["Tables"]["teams"]["Insert"] {
    return {
      name: data.name,
      logo: data.logo,
      preferences: data.preferences,
    };
  }

  async getAll(): Promise<Team[]> {
    const { data, error } = await this.client.from(this.table).select("*").order("name");

    if (error) throw error;
    return data.map(this.transformFromDb);
  }
}
