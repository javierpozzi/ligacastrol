import { useCallback, useEffect, useState } from "react";
import { Team } from "../types";
import { RepositoryFactory } from "../repositories/factory";
import { TeamService } from "../services/team-service";

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const teamService = new TeamService(RepositoryFactory.getTeamRepository());

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await teamService.getAllTeams();
      setTeams(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load teams"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return { teams, loading, error, reloadTeams: loadTeams };
}
