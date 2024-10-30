import { LeagueTeam } from "../types";
import { LeagueTeamRepository } from "../repositories/types";
import { EntityNotFoundError } from "../utils/error";

export class LeagueTeamService {
  constructor(private repository: LeagueTeamRepository) {}

  async getAllLeagueTeams(): Promise<LeagueTeam[]> {
    return this.repository.getAll();
  }

  async getLeagueTeamById(id: string): Promise<LeagueTeam> {
    const leagueTeam = await this.repository.getById(id);
    if (!leagueTeam) throw new EntityNotFoundError("LeagueTeam", id);
    return leagueTeam;
  }

  async addTeamToLeague(leagueId: string, teamId: string): Promise<LeagueTeam> {
    return this.repository.create({
      leagueId,
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    });
  }

  async updateLeagueTeamStats(
    id: string,
    updates: Partial<Omit<LeagueTeam, "id" | "leagueId" | "teamId">>
  ): Promise<LeagueTeam> {
    return this.repository.update(id, updates);
  }

  async removeTeamFromLeague(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getTeamsByLeagueId(leagueId: string): Promise<LeagueTeam[]> {
    return this.repository.getByLeagueId(leagueId);
  }

  async getLeagueStandings(leagueId: string): Promise<LeagueTeam[]> {
    const teams = await this.getTeamsByLeagueId(leagueId);
    return teams.sort((a, b) => {
      // Sort by points
      if (b.points !== a.points) return b.points - a.points;

      // If points are equal, sort by goal difference
      const aGoalDiff = a.goalsFor - a.goalsAgainst;
      const bGoalDiff = b.goalsFor - b.goalsAgainst;
      if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff;

      // If goal difference is equal, sort by goals scored
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

      // If everything is equal, sort by team ID for consistency
      return a.teamId.localeCompare(b.teamId);
    });
  }
}
