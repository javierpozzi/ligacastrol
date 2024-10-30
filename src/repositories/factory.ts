import { InMemoryTeamRepository } from "./memory/team-repository";
import { InMemoryLeagueRepository } from "./memory/league-repository";
import { InMemoryMatchRepository } from "./memory/match-repository";
import { InMemoryLocationRepository } from "./memory/location-repository";
import { InMemoryLeagueTeamRepository } from "./memory/league-team-repository";
import { TeamRepository, LeagueRepository, MatchRepository, LocationRepository, LeagueTeamRepository } from "./types";
import { MatchService } from "../services/match-service";
import { LeagueService } from "../services/league-service";
import { LeagueTeamService } from "../services/league-team-service";
import { LocationService } from "../services/location-service";
import { TeamService } from "../services/team-service";

export class RepositoryFactory {
  private static teamRepository: TeamRepository;
  private static leagueRepository: LeagueRepository;
  private static matchRepository: MatchRepository;
  private static locationRepository: LocationRepository;
  private static leagueTeamRepository: LeagueTeamRepository;

  private static matchService: MatchService;
  private static leagueService: LeagueService;
  private static leagueTeamService: LeagueTeamService;
  private static locationService: LocationService;
  private static teamService: TeamService;

  private static handleInitError(error: unknown, repositoryName: string): never {
    console.error(`Failed to initialize ${repositoryName}:`, error);
    throw new Error(`Failed to initialize ${repositoryName}`);
  }

  static getTeamRepository(): TeamRepository {
    try {
      if (!this.teamRepository) {
        this.teamRepository = new InMemoryTeamRepository();
      }
      return this.teamRepository;
    } catch (error) {
      this.handleInitError(error, "TeamRepository");
    }
  }

  static getLeagueRepository(): LeagueRepository {
    try {
      if (!this.leagueRepository) {
        this.leagueRepository = new InMemoryLeagueRepository();
      }
      return this.leagueRepository;
    } catch (error) {
      this.handleInitError(error, "LeagueRepository");
    }
  }

  static getMatchRepository(): MatchRepository {
    try {
      if (!this.matchRepository) {
        this.matchRepository = new InMemoryMatchRepository();
      }
      return this.matchRepository;
    } catch (error) {
      this.handleInitError(error, "MatchRepository");
    }
  }

  static getLocationRepository(): LocationRepository {
    try {
      if (!this.locationRepository) {
        this.locationRepository = new InMemoryLocationRepository();
      }
      return this.locationRepository;
    } catch (error) {
      this.handleInitError(error, "LocationRepository");
    }
  }

  static getLeagueTeamRepository(): LeagueTeamRepository {
    try {
      if (!this.leagueTeamRepository) {
        this.leagueTeamRepository = new InMemoryLeagueTeamRepository();
      }
      return this.leagueTeamRepository;
    } catch (error) {
      this.handleInitError(error, "LeagueTeamRepository");
    }
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

  static getLocationService(): LocationService {
    if (!this.locationService) {
      this.locationService = new LocationService(this.getLocationRepository());
    }
    return this.locationService;
  }

  static getTeamService(): TeamService {
    if (!this.teamService) {
      const repository = new InMemoryTeamRepository();
      this.teamService = new TeamService(repository);
    }
    return this.teamService;
  }
}
