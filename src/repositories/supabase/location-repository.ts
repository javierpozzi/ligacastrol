import { Location } from "../../types";
import { LocationRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type LocationRow = Database["public"]["Tables"]["locations"]["Row"];

export class SupabaseLocationRepository extends SupabaseBaseRepository<Location> implements LocationRepository {
  constructor() {
    super("locations");
  }

  protected transformFromDb(data: LocationRow): Location {
    return {
      id: data.id,
      name: data.name,
      address: data.address,
    };
  }

  protected transformToDb(data: Omit<Location, "id">): Database["public"]["Tables"]["locations"]["Insert"] {
    return {
      name: data.name,
      address: data.address,
    };
  }

  async getAll(): Promise<Location[]> {
    const { data, error } = await this.client.from(this.table).select("*").order("name");

    if (error) throw error;
    return data.map(this.transformFromDb);
  }
}
