import { MatchGoal } from "../types";
import { MatchGoalRepository } from "../repositories/types";
import { EntityNotFoundError } from "../utils/error";

export class MatchGoalService {
  constructor(private repository: MatchGoalRepository) {}

  async getAllMatchGoals(): Promise<MatchGoal[]> {
    return this.repository.getAll();
  }

  async getMatchGoalById(id: string): Promise<MatchGoal> {
    const goal = await this.repository.getById(id);
    if (!goal) throw new EntityNotFoundError("MatchGoal", id);
    return goal;
  }

  async getGoalsByMatchId(matchId: string): Promise<MatchGoal[]> {
    return this.repository.getByMatchId(matchId);
  }

  async getGoalsByLeagueId(leagueId: string): Promise<MatchGoal[]> {
    return this.repository.getByLeagueId(leagueId);
  }

  async createGoal(goal: Omit<MatchGoal, "id">): Promise<MatchGoal> {
    if (!goal.matchId || !goal.teamId) {
      throw new Error("Missing required goal fields");
    }
    return this.repository.create(goal);
  }

  async updateGoal(id: string, updates: Partial<Omit<MatchGoal, "id">>): Promise<MatchGoal> {
    const goal = await this.getMatchGoalById(id);
    return this.repository.update(id, updates);
  }

  async deleteGoal(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async addGoalsToMatch(matchId: string, teamId: string, count: number, playerId?: string): Promise<MatchGoal[]> {
    const goals: Promise<MatchGoal>[] = [];

    for (let i = 0; i < count; i++) {
      goals.push(
        this.createGoal({
          matchId,
          teamId,
          playerId,
        })
      );
    }

    return Promise.all(goals);
  }

  async removeGoalsFromMatch(matchId: string, teamId: string, count: number): Promise<void> {
    const goals = await this.getGoalsByMatchId(matchId);
    const teamGoals = goals.filter((goal) => goal.teamId === teamId);
    const goalsToRemove = teamGoals.slice(-count);

    await Promise.all(goalsToRemove.map((goal) => this.deleteGoal(goal.id)));
  }
}
