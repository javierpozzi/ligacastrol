import { LeagueTeam } from "../../types";
import { LeagueTeamRepository } from "../types";
import { useStore } from "../../store";
import { EntityNotFoundError } from "../../utils/error";

export class InMemoryLeagueTeamRepository implements LeagueTeamRepository {
  async getAll(): Promise<LeagueTeam[]> {
    return useStore.getState().leagueTeams;
  }

  async getById(id: string): Promise<LeagueTeam | null> {
    const leagueTeam = useStore.getState().leagueTeams.find((lt) => lt.id === id);
    return leagueTeam || null;
  }

  async create(leagueTeam: Omit<LeagueTeam, "id">): Promise<LeagueTeam> {
    const id = crypto.randomUUID();
    const newLeagueTeam = { ...leagueTeam, id };

    useStore.setState((state) => ({
      leagueTeams: [...state.leagueTeams, newLeagueTeam],
    }));

    return newLeagueTeam;
  }

  async update(id: string, updates: Partial<Omit<LeagueTeam, "id">>): Promise<LeagueTeam> {
    useStore.setState((state) => ({
      leagueTeams: state.leagueTeams.map((lt) => (lt.id === id ? { ...lt, ...updates } : lt)),
    }));

    const updated = await this.getById(id);
    if (!updated) throw new EntityNotFoundError("LeagueTeam", id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    useStore.setState((state) => ({
      leagueTeams: state.leagueTeams.filter((lt) => lt.id !== id),
    }));
  }

  async getByLeagueId(leagueId: string): Promise<LeagueTeam[]> {
    return useStore.getState().leagueTeams.filter((lt) => lt.leagueId === leagueId);
  }

  async getByLeagueAndTeam(leagueId: string, teamId: string): Promise<LeagueTeam | null> {
    const leagueTeam = useStore.getState().leagueTeams.find((lt) => lt.leagueId === leagueId && lt.teamId === teamId);
    return leagueTeam || null;
  }
}
