import { LeagueTeam, Team } from "../../types";
import { LeagueTeamRepository } from "../types";
import { SupabaseBaseRepository } from "./base";
import { Database } from "../../config/database.types";

type LeagueTeamRow = Database["public"]["Tables"]["league_teams"]["Row"];
type TeamRow = Database["public"]["Tables"]["teams"]["Row"];

export class SupabaseLeagueTeamRepository extends SupabaseBaseRepository<LeagueTeam> implements LeagueTeamRepository {
  constructor() {
    super("league_teams");
  }

  protected transformFromDb(data: LeagueTeamRow): LeagueTeam {
    return {
      id: data.id,
      leagueId: data.league_id,
      teamId: data.team_id,
      played: data.played,
      won: data.won,
      drawn: data.drawn,
      lost: data.lost,
      goalsFor: data.goals_for,
      goalsAgainst: data.goals_against,
      points: data.points,
    };
  }

  protected transformToDb(data: Omit<LeagueTeam, "id">): Database["public"]["Tables"]["league_teams"]["Insert"] {
    return {
      league_id: data.leagueId,
      team_id: data.teamId,
      played: data.played,
      won: data.won,
      drawn: data.drawn,
      lost: data.lost,
      goals_for: data.goalsFor,
      goals_against: data.goalsAgainst,
      points: data.points,
    };
  }

  async getByLeagueId(leagueId: string): Promise<LeagueTeam[]> {
    const { data, error } = await this.client.from(this.table).select("*").eq("league_id", leagueId);

    if (error) throw error;
    return data.map(this.transformFromDb);
  }

  async getByLeagueAndTeam(leagueId: string, teamId: string): Promise<LeagueTeam | null> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("league_id", leagueId)
      .eq("team_id", teamId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return this.transformFromDb(data);
  }

  async getAllTeamsForLeague(leagueId: string): Promise<Team[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select(
        `
        team_id,
        teams (
          *
        )
      `
      )
      .eq("league_id", leagueId);

    if (error) throw error;

    return data.map((row: { teams: TeamRow[] }) => ({
      id: row.teams[0].id,
      name: row.teams[0].name,
      logo: row.teams[0].logo,
      preferences: row.teams[0].preferences,
    }));
  }
}
