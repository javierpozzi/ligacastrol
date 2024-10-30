import { Location } from "../types";
import { LocationRepository } from "../repositories/types";
import { EntityNotFoundError } from "../utils/error";

export class LocationService {
  constructor(private repository: LocationRepository) {}

  async getAllLocations(): Promise<Location[]> {
    return this.repository.getAll();
  }

  async getLocationById(id: string): Promise<Location> {
    const location = await this.repository.getById(id);
    if (!location) throw new EntityNotFoundError("Location", id);
    return location;
  }

  async createLocation(location: Omit<Location, "id">): Promise<Location> {
    return this.repository.create(location);
  }

  async updateLocation(id: string, updates: Partial<Omit<Location, "id">>): Promise<Location> {
    return this.repository.update(id, updates);
  }

  async deleteLocation(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
