import { InMemoryTeamRepository } from "./memory/team-repository";
import { InMemoryLeagueRepository } from "./memory/league-repository";
import { InMemoryMatchRepository } from "./memory/match-repository";
import { InMemoryLocationRepository } from "./memory/location-repository";
import { InMemoryLeagueTeamRepository } from "./memory/league-team-repository";
import { TeamRepository, LeagueRepository, MatchRepository, LocationRepository, LeagueTeamRepository } from "./types";
import { MatchService } from "../services/match-service";
import { LeagueService } from "../services/league-service";
import { LeagueTeamService } from "../services/league-team-service";

export class RepositoryFactory {
  private static teamRepository: TeamRepository;
  private static leagueRepository: LeagueRepository;
  private static matchRepository: MatchRepository;
  private static locationRepository: LocationRepository;
  private static leagueTeamRepository: LeagueTeamRepository;

  private static matchService: MatchService;
  private static leagueService: LeagueService;
  private static leagueTeamService: LeagueTeamService;

  static getTeamRepository(): TeamRepository {
    if (!this.teamRepository) {
      this.teamRepository = new InMemoryTeamRepository();
    }
    return this.teamRepository;
  }

  static getLeagueRepository(): LeagueRepository {
    if (!this.leagueRepository) {
      this.leagueRepository = new InMemoryLeagueRepository();
    }
    return this.leagueRepository;
  }

  static getMatchRepository(): MatchRepository {
    if (!this.matchRepository) {
      this.matchRepository = new InMemoryMatchRepository();
    }
    return this.matchRepository;
  }

  static getLocationRepository(): LocationRepository {
    if (!this.locationRepository) {
      this.locationRepository = new InMemoryLocationRepository();
    }
    return this.locationRepository;
  }

  static getLeagueTeamRepository(): LeagueTeamRepository {
    if (!this.leagueTeamRepository) {
      this.leagueTeamRepository = new InMemoryLeagueTeamRepository();
    }
    return this.leagueTeamRepository;
  }

  static getMatchService(): MatchService {
    if (!this.matchService) {
      this.matchService = new MatchService(this.getMatchRepository(), this.getLeagueTeamRepository());
    }
    return this.matchService;
  }

  static getLeagueTeamService(): LeagueTeamService {
    if (!this.leagueTeamService) {
      this.leagueTeamService = new LeagueTeamService(this.getLeagueTeamRepository());
    }
    return this.leagueTeamService;
  }

  static getLeagueService(): LeagueService {
    if (!this.leagueService) {
      this.leagueService = new LeagueService(
        this.getLeagueRepository(),
        this.getMatchService(),
        this.getLeagueTeamService()
      );
    }
    return this.leagueService;
  }
}
