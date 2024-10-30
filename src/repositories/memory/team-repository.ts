import { Team } from "../../types";
import { TeamRepository } from "../types";
import { useStore } from "../../store";
import { EntityNotFoundError } from "../../utils/error";

export class InMemoryTeamRepository implements TeamRepository {
  async getAll(): Promise<Team[]> {
    return useStore.getState().teams;
  }

  async getById(id: string): Promise<Team | null> {
    const team = useStore.getState().teams.find((t) => t.id === id);
    return team || null;
  }

  async create(team: Omit<Team, "id">): Promise<Team> {
    const { id } = useStore.getState().addTeam(team);
    const created = await this.getById(id);
    if (!created) throw new Error("Failed to create team");
    return created;
  }

  async update(id: string, updates: Partial<Omit<Team, "id">>): Promise<Team> {
    useStore.getState().updateTeam(id, updates);
    const updated = await this.getById(id);
    if (!updated) throw new EntityNotFoundError("Team", id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    useStore.getState().deleteTeam(id);
  }
}
