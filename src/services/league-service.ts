import { League } from "../types";
import { LeagueRepository } from "../repositories/types";
import { EntityNotFoundError } from "../utils/error";
import { generateFixtures } from "../utils/fixtures";
import { MatchService } from "./match-service";
import { LeagueTeamService } from "./league-team-service";
import { LeagueTeam } from "../types";

export class LeagueService {
  constructor(
    private repository: LeagueRepository,
    private matchService: MatchService,
    private leagueTeamService: LeagueTeamService
  ) {}

  async getAllLeagues(): Promise<League[]> {
    return this.repository.getAll();
  }

  async getLeagueById(id: string): Promise<League> {
    const league = await this.repository.getById(id);
    if (!league) throw new EntityNotFoundError("League", id);
    return league;
  }

  async createLeague(league: Omit<League, "id">): Promise<League> {
    return this.repository.create(league);
  }

  async updateLeague(id: string, updates: Partial<Omit<League, "id">>): Promise<League> {
    return this.repository.update(id, updates);
  }

  async deleteLeague(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async generateFixtures(leagueId: string): Promise<void> {
    const teams = await this.leagueTeamService.getTeamsByLeagueId(leagueId);
    const teamIds = teams.map((team) => team.teamId);
    const fixtures = generateFixtures(teamIds);

    // Group fixtures into weeks
    const fixturesPerWeek = Math.floor(teamIds.length / 2);

    // Create matches for each fixture with proper week numbers
    for (let i = 0; i < fixtures.length; i++) {
      const fixture = fixtures[i];
      await this.matchService.createMatch({
        homeTeamId: fixture.home,
        awayTeamId: fixture.away,
        leagueId,
        locationId: null,
        weekNumber: Math.floor(i / fixturesPerWeek) + 1,
        date: null,
        homeScore: null,
        awayScore: null,
        status: "scheduled",
      });
    }
  }

  async addTeamToLeague(leagueId: string, teamId: string): Promise<void> {
    await this.leagueTeamService.addTeamToLeague(leagueId, teamId);
  }

  async removeTeamFromLeague(leagueId: string, teamId: string): Promise<void> {
    const leagueTeam = await this.leagueTeamService.getByLeagueAndTeam(leagueId, teamId);
    if (leagueTeam) {
      await this.leagueTeamService.removeTeamFromLeague(leagueTeam.id);
    }
  }

  async getLeagueTeams(leagueId: string): Promise<LeagueTeam[]> {
    return this.leagueTeamService.getTeamsByLeagueId(leagueId);
  }
}
