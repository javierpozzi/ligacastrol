import { LeagueTeamRepository, MatchRepository } from "../repositories/types";
import { Match } from "../types";
import { EntityNotFoundError } from "../utils/error";

export class MatchService {
  constructor(private repository: MatchRepository, private leagueTeamRepository: LeagueTeamRepository) {}

  async getAllMatches(): Promise<Match[]> {
    return this.repository.getAll();
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

  async updateMatch(id: string, updates: Partial<Omit<Match, "id">>): Promise<void> {
    const match = await this.getMatchById(id);
    const updatedMatch = { ...match, ...updates };

    if (this.shouldUpdateStats(match, updatedMatch)) {
      await this.updateTeamStats(match, updatedMatch);
    }

    await this.repository.update(id, updates);
  }

  async deleteMatch(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getMatchesByLeagueId(leagueId: string): Promise<Match[]> {
    return this.repository.getByLeagueId(leagueId);
  }

  async clearLeagueFixtures(leagueId: string): Promise<void> {
    const matches = await this.getMatchesByLeagueId(leagueId);
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
    const homeTeam = leagueTeams.find((lt) => lt.teamId === newMatch.homeTeamId);
    const awayTeam = leagueTeams.find((lt) => lt.teamId === newMatch.awayTeamId);

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
}
