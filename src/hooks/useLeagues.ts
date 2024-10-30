import { useCallback, useEffect, useMemo, useState } from "react";
import { RepositoryFactory } from "../repositories/factory";
import { League } from "../types";

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const leagueService = useMemo(() => RepositoryFactory.getLeagueService(), []);

  const loadLeagues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await leagueService.getAllLeagues();
      setLeagues(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load leagues"));
    } finally {
      setLoading(false);
    }
  }, [leagueService]);

  useEffect(() => {
    loadLeagues();
  }, [loadLeagues]);

  return { leagues, loading, error, reloadLeagues: loadLeagues };
}
