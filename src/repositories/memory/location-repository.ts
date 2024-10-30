import { Location } from "../../types";
import { LocationRepository } from "../types";
import { useStore } from "../../store";
import { EntityNotFoundError } from "../../utils/error";

export class InMemoryLocationRepository implements LocationRepository {
  async getAll(): Promise<Location[]> {
    return useStore.getState().locations;
  }

  async getById(id: string): Promise<Location | null> {
    const location = useStore.getState().locations.find((l) => l.id === id);
    return location || null;
  }

  async create(location: Omit<Location, "id">): Promise<Location> {
    const id = crypto.randomUUID();
    const newLocation = { ...location, id };

    useStore.setState((state) => ({
      locations: [...state.locations, newLocation],
    }));

    return newLocation;
  }

  async update(id: string, updates: Partial<Omit<Location, "id">>): Promise<Location> {
    useStore.setState((state) => ({
      locations: state.locations.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));

    const updated = await this.getById(id);
    if (!updated) throw new EntityNotFoundError("Location", id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    useStore.setState((state) => ({
      locations: state.locations.filter((l) => l.id !== id),
    }));
  }
}
