import { MatchRepository, LeagueTeamRepository } from "../repositories/types";
import { Match, LeagueTeam } from "../types";
import { EntityNotFoundError } from "../utils/error";

export class MatchService {
  constructor(private repository: MatchRepository, private leagueTeamRepository: LeagueTeamRepository) {}

  async getAllMatches(): Promise<Match[]> {
    return this.repository.getAll();
  }

  async getByLeagueId(leagueId: string): Promise<Match[]> {
    return this.repository.getByLeagueId(leagueId);
  }

  async updateMatch(id: string, data: Partial<Omit<Match, "id">>): Promise<Match> {
    const oldMatch = await this.getMatchById(id);
    const newMatch = { ...oldMatch, ...data };

    // Check if we need to update team stats
    if (this.shouldUpdateStats(oldMatch, newMatch)) {
      await this.updateTeamStats(oldMatch, newMatch);
    }

    return this.repository.update(id, data);
  }

  async getMatchById(id: string): Promise<Match> {
    const match = await this.repository.getById(id);
    if (!match) throw new EntityNotFoundError("Match", id);
    return match;
  }

  async createMatch(match: Omit<Match, "id">): Promise<Match> {
    if (!match.leagueId || !match.homeTeamId || !match.awayTeamId || !match.weekNumber) {
      throw new Error("Missing required match fields");
    }

    if (match.homeTeamId === match.awayTeamId) {
      throw new Error("Home and away teams must be different");
    }

    return this.repository.create(match);
  }

  async deleteMatch(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async clearLeagueFixtures(leagueId: string): Promise<void> {
    const matches = await this.getByLeagueId(leagueId);
    await Promise.all(matches.map((match) => this.deleteMatch(match.id)));
  }

  private shouldUpdateStats(oldMatch: Match, newMatch: Match): boolean {
    return (
      oldMatch.status !== "completed" &&
      newMatch.status === "completed" &&
      newMatch.homeScore !== null &&
      newMatch.awayScore !== null
    );
  }

  private async updateTeamStats(oldMatch: Match, newMatch: Match): Promise<void> {
    const leagueTeams = await this.leagueTeamRepository.getByLeagueId(newMatch.leagueId);
    const homeTeam = leagueTeams.find((lt: LeagueTeam) => lt.teamId === newMatch.homeTeamId);
    const awayTeam = leagueTeams.find((lt: LeagueTeam) => lt.teamId === newMatch.awayTeamId);

    if (!homeTeam || !awayTeam) throw new Error("Teams not found in league");

    const homeScore = newMatch.homeScore!;
    const awayScore = newMatch.awayScore!;

    // Update home team stats
    await this.leagueTeamRepository.update(homeTeam.id, {
      played: homeTeam.played + 1,
      won: homeScore > awayScore ? homeTeam.won + 1 : homeTeam.won,
      drawn: homeScore === awayScore ? homeTeam.drawn + 1 : homeTeam.drawn,
      lost: homeScore < awayScore ? homeTeam.lost + 1 : homeTeam.lost,
      goalsFor: homeTeam.goalsFor + homeScore,
      goalsAgainst: homeTeam.goalsAgainst + awayScore,
      points: homeTeam.points + (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0),
    });

    // Update away team stats
    await this.leagueTeamRepository.update(awayTeam.id, {
      played: awayTeam.played + 1,
      won: awayScore > homeScore ? awayTeam.won + 1 : awayTeam.won,
      drawn: awayScore === homeScore ? awayTeam.drawn + 1 : awayTeam.drawn,
      lost: awayScore < homeScore ? awayTeam.lost + 1 : awayTeam.lost,
      goalsFor: awayTeam.goalsFor + awayScore,
      goalsAgainst: awayTeam.goalsAgainst + homeScore,
      points: awayTeam.points + (awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0),
    });
  }

  async getByLeagueAndWeek(leagueId: string, weekNumber: number): Promise<Match[]> {
    const matches = await this.getByLeagueId(leagueId);
    return matches.filter((match) => match.weekNumber === weekNumber);
  }
}
