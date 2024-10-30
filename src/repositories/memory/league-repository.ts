import { League } from "../../types";
import { LeagueRepository } from "../types";
import { useStore } from "../../store";
import { EntityNotFoundError } from "../../utils/error";

export class InMemoryLeagueRepository implements LeagueRepository {
  async getAll(): Promise<League[]> {
    return useStore.getState().leagues;
  }

  async getById(id: string): Promise<League | null> {
    const league = useStore.getState().leagues.find((l) => l.id === id);
    return league || null;
  }

  async create(league: Omit<League, "id">): Promise<League> {
    const { id } = useStore.getState().addLeague(league);
    const created = await this.getById(id);
    if (!created) throw new Error("Failed to create league");
    return created;
  }

  async update(id: string, updates: Partial<Omit<League, "id">>): Promise<League> {
    useStore.getState().updateLeague(id, updates);
    const updated = await this.getById(id);
    if (!updated) throw new EntityNotFoundError("League", id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    useStore.getState().deleteLeague(id);
  }
}
