import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { Match } from "../types";
import { RepositoryFactory } from "../repositories/factory";

interface FixtureListProps {
  leagueId: string;
  weekNumber: number;
  onMatchClick: (matchId: string) => void;
}

export function FixtureList({ leagueId, weekNumber, onMatchClick }: FixtureListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const { teams } = useStore();

  useEffect(() => {
    const loadMatches = async () => {
      const matchService = RepositoryFactory.getMatchService();
      const matchData = await matchService.getByLeagueAndWeek(leagueId, weekNumber);
      setMatches(matchData);
    };

    loadMatches();
  }, [leagueId, weekNumber]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Week {weekNumber}</h3>
      <div className="space-y-4">
        {matches.map((match) => {
          const homeTeam = teams.find((t) => t.id === match.homeTeamId);
          const awayTeam = teams.find((t) => t.id === match.awayTeamId);

          return (
            <div
              key={match.id}
              onClick={() => onMatchClick(match.id)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="font-medium">{homeTeam?.name}</span>
                  {match.status === "completed" && (
                    <span className="mx-2 font-medium">{match.homeScore}</span>
                  )}
                </div>
                <span className="text-gray-500">vs</span>
                <div className="flex items-center">
                  {match.status === "completed" && (
                    <span className="mx-2 font-medium">{match.awayScore}</span>
                  )}
                  <span className="font-medium">{awayTeam?.name}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {match.date && format(new Date(match.date), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}