import { useStore } from '../store';
import { Team } from '../types';
import { StoreState } from '../store';

export function useLeague(leagueId: string) {
  const league = useStore((state: StoreState) => 
    state.leagues.find((l) => l.id === leagueId)
  );
  
  const teams = useStore((state: StoreState) =>
    state.leagueTeams
      .filter((lt) => lt.leagueId === leagueId)
      .map((lt) => state.teams.find((t) => t.id === lt.teamId))
      .filter((t): t is Team => t !== undefined)
  );

  return { league, teams };
}
