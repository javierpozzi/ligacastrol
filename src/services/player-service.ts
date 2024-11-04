import { Player } from "../types";
import { PlayerRepository } from "../repositories/types";
import { EntityNotFoundError } from "../utils/error";

export class PlayerService {
  constructor(private repository: PlayerRepository) {}

  async getAllPlayers(): Promise<Player[]> {
    return this.repository.getAll();
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.repository.getById(id);
    if (!player) throw new EntityNotFoundError("Player", id);
    return player;
  }

  async getPlayersByTeamId(teamId: string): Promise<Player[]> {
    return this.repository.getByTeamId(teamId);
  }

  async createPlayer(player: Omit<Player, "id">): Promise<Player> {
    if (!player.name || !player.teamId) {
      throw new Error("Missing required player fields");
    }
    return this.repository.create(player);
  }

  async updatePlayer(id: string, updates: Partial<Omit<Player, "id">>): Promise<Player> {
    const player = await this.getPlayerById(id);
    return this.repository.update(id, updates);
  }

  async deletePlayer(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async togglePlayerStatus(id: string): Promise<Player> {
    const player = await this.getPlayerById(id);
    return this.repository.update(id, { disabled: !player.disabled });
  }
}
