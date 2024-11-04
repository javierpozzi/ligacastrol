import { SupabaseLeagueRepository } from "./supabase/league-repository";
import { SupabaseLeagueTeamRepository } from "./supabase/league-team-repository";
import { SupabaseMatchGoalRepository } from "./supabase/match-goal-repository";
import { SupabaseMatchRepository } from "./supabase/match-repository";
import { SupabasePlayerRepository } from "./supabase/player-repository";
import { SupabaseTeamRepository } from "./supabase/team-repository";
import { SupabaseLocationRepository } from "./supabase/location-repository";
import {
  LeagueRepository,
  LeagueTeamRepository,
  LocationRepository,
  MatchGoalRepository,
  MatchRepository,
  PlayerRepository,
  TeamRepository,
} from "./types";

import { LeagueService } from "../services/league-service";
import { LeagueTeamService } from "../services/league-team-service";
import { LocationService } from "../services/location-service";
import { MatchService } from "../services/match-service";
import { TeamService } from "../services/team-service";
import { PlayerService } from "../services/player-service";
import { MatchGoalService } from "../services/match-goal-service";

export class RepositoryFactory {
  // Repository instances
  private static teamRepository: TeamRepository;
  private static leagueRepository: LeagueRepository;
  private static matchRepository: MatchRepository;
  private static locationRepository: LocationRepository;
  private static leagueTeamRepository: LeagueTeamRepository;
  private static playerRepository: PlayerRepository;
  private static matchGoalRepository: MatchGoalRepository;

  // Service instances
  private static teamService: TeamService;
  private static leagueService: LeagueService;
  private static matchService: MatchService;
  private static locationService: LocationService;
  private static leagueTeamService: LeagueTeamService;
  private static playerService: PlayerService;
  private static matchGoalService: MatchGoalService;

  private static handleInitError(error: unknown, name: string): never {
    console.error(`Failed to initialize ${name}:`, error);
    throw new Error(`Failed to initialize ${name}`);
  }

  // Repository getters
  static getTeamRepository(): TeamRepository {
    try {
      if (!this.teamRepository) {
        this.teamRepository = new SupabaseTeamRepository();
      }
      return this.teamRepository;
    } catch (error) {
      this.handleInitError(error, "TeamRepository");
    }
  }

  static getLeagueRepository(): LeagueRepository {
    try {
      if (!this.leagueRepository) {
        this.leagueRepository = new SupabaseLeagueRepository();
      }
      return this.leagueRepository;
    } catch (error) {
      this.handleInitError(error, "LeagueRepository");
    }
  }

  static getMatchRepository(): MatchRepository {
    try {
      if (!this.matchRepository) {
        this.matchRepository = new SupabaseMatchRepository();
      }
      return this.matchRepository;
    } catch (error) {
      this.handleInitError(error, "MatchRepository");
    }
  }

  static getLocationRepository(): LocationRepository {
    try {
      if (!this.locationRepository) {
        this.locationRepository = new SupabaseLocationRepository();
      }
      return this.locationRepository;
    } catch (error) {
      this.handleInitError(error, "LocationRepository");
    }
  }

  static getLeagueTeamRepository(): LeagueTeamRepository {
    try {
      if (!this.leagueTeamRepository) {
        this.leagueTeamRepository = new SupabaseLeagueTeamRepository();
      }
      return this.leagueTeamRepository;
    } catch (error) {
      this.handleInitError(error, "LeagueTeamRepository");
    }
  }

  static getPlayerRepository(): PlayerRepository {
    try {
      if (!this.playerRepository) {
        this.playerRepository = new SupabasePlayerRepository();
      }
      return this.playerRepository;
    } catch (error) {
      this.handleInitError(error, "PlayerRepository");
    }
  }

  static getMatchGoalRepository(): MatchGoalRepository {
    try {
      if (!this.matchGoalRepository) {
        this.matchGoalRepository = new SupabaseMatchGoalRepository();
      }
      return this.matchGoalRepository;
    } catch (error) {
      this.handleInitError(error, "MatchGoalRepository");
    }
  }

  // Service getters
  static getTeamService(): TeamService {
    try {
      if (!this.teamService) {
        this.teamService = new TeamService(this.getTeamRepository());
      }
      return this.teamService;
    } catch (error) {
      this.handleInitError(error, "TeamService");
    }
  }

  static getLeagueService(): LeagueService {
    try {
      if (!this.leagueService) {
        this.leagueService = new LeagueService(
          this.getLeagueRepository(),
          this.getMatchService(),
          this.getLeagueTeamService()
        );
      }
      return this.leagueService;
    } catch (error) {
      this.handleInitError(error, "LeagueService");
    }
  }

  static getMatchService(): MatchService {
    try {
      if (!this.matchService) {
        this.matchService = new MatchService(this.getMatchRepository(), this.getLeagueTeamRepository());
      }
      return this.matchService;
    } catch (error) {
      this.handleInitError(error, "MatchService");
    }
  }

  static getLocationService(): LocationService {
    try {
      if (!this.locationService) {
        this.locationService = new LocationService(this.getLocationRepository());
      }
      return this.locationService;
    } catch (error) {
      this.handleInitError(error, "LocationService");
    }
  }

  static getLeagueTeamService(): LeagueTeamService {
    try {
      if (!this.leagueTeamService) {
        this.leagueTeamService = new LeagueTeamService(this.getLeagueTeamRepository());
      }
      return this.leagueTeamService;
    } catch (error) {
      this.handleInitError(error, "LeagueTeamService");
    }
  }

  static getPlayerService(): PlayerService {
    try {
      if (!this.playerService) {
        this.playerService = new PlayerService(this.getPlayerRepository());
      }
      return this.playerService;
    } catch (error) {
      this.handleInitError(error, "PlayerService");
    }
  }

  static getMatchGoalService(): MatchGoalService {
    try {
      if (!this.matchGoalService) {
        this.matchGoalService = new MatchGoalService(this.getMatchGoalRepository());
      }
      return this.matchGoalService;
    } catch (error) {
      this.handleInitError(error, "MatchGoalService");
    }
  }
}
