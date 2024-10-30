import { Match } from "../../types";
import { MatchRepository } from "../types";
import { useStore } from "../../store";
import { EntityNotFoundError } from "../../utils/error";

export class InMemoryMatchRepository implements MatchRepository {
  async getAll(): Promise<Match[]> {
    return useStore.getState().matches;
  }

  async getById(id: string): Promise<Match | null> {
    const match = useStore.getState().matches.find((m) => m.id === id);
    return match || null;
  }

  async create(match: Omit<Match, "id">): Promise<Match> {
    const id = crypto.randomUUID();
    const newMatch = { ...match, id };

    useStore.setState((state) => ({
      matches: [...state.matches, newMatch],
    }));

    return newMatch;
  }

  async update(id: string, updates: Partial<Omit<Match, "id">>): Promise<Match> {
    useStore.setState((state) => ({
      matches: state.matches.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));

    const updated = await this.getById(id);
    if (!updated) throw new EntityNotFoundError("Match", id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    useStore.setState((state) => ({
      matches: state.matches.filter((m) => m.id !== id),
    }));
  }

  async getByLeagueId(leagueId: string): Promise<Match[]> {
    return useStore.getState().matches.filter((m) => m.leagueId === leagueId);
  }
}
