import { useCallback, useEffect, useState } from "react";
import { LeagueTeam } from "../types";
import { RepositoryFactory } from "../repositories/factory";
import { LeagueTeamService } from "../services/league-team-service";

export function useLeagueStandings(leagueId: string) {
  const [standings, setStandings] = useState<LeagueTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const leagueTeamService = new LeagueTeamService(RepositoryFactory.getLeagueTeamRepository());

  const loadStandings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await leagueTeamService.getLeagueStandings(leagueId);
      setStandings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load standings"));
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    loadStandings();
  }, [loadStandings]);

  return { standings, loading, error, reloadStandings: loadStandings };
}
