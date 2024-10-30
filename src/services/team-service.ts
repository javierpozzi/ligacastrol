import { Team } from "../types";
import { TeamRepository } from "../repositories/types";
import { EntityNotFoundError } from "../utils/error";

export class TeamService {
  constructor(private repository: TeamRepository) {}

  async getAllTeams(): Promise<Team[]> {
    return this.repository.getAll();
  }

  async getTeamById(id: string): Promise<Team> {
    const team = await this.repository.getById(id);
    if (!team) throw new EntityNotFoundError("Team", id);
    return team;
  }

  async createTeam(team: Omit<Team, "id">): Promise<Team> {
    return this.repository.create(team);
  }

  async updateTeam(id: string, updates: Partial<Omit<Team, "id">>): Promise<Team> {
    return this.repository.update(id, updates);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
