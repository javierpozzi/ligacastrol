import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store";

interface ScorerStats {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  goals: number;
}

export function LeagueTopScorers() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const { matchGoals, matches, players, teams } = useStore();

  const topScorers = useMemo(() => {
    if (!leagueId) return [];

    // Get all matches for this league
    const leagueMatches = matches.filter((m) => m.leagueId === leagueId);
    const leagueMatchIds = new Set(leagueMatches.map((m) => m.id));

    // Get all goals for these matches
    const leagueGoals = matchGoals.filter((g) => leagueMatchIds.has(g.matchId) && g.playerId);

    // Count goals per player
    const scorerStats = new Map<string, ScorerStats>();

    leagueGoals.forEach((goal) => {
      if (!goal.playerId) return;

      const player = players.find((p) => p.id === goal.playerId);
      const team = teams.find((t) => t.id === goal.teamId);

      if (!player || !team) return;

      const existingStats = scorerStats.get(goal.playerId);
      if (existingStats) {
        existingStats.goals += 1;
      } else {
        scorerStats.set(goal.playerId, {
          playerId: goal.playerId,
          playerName: player.name,
          teamId: team.id,
          teamName: team.name,
          goals: 1,
        });
      }
    });

    // Convert to array and sort by goals
    return Array.from(scorerStats.values()).sort((a, b) => b.goals - a.goals);
  }, [leagueId, matchGoals, matches, players, teams]);

  const handleBack = () => {
    navigate(`/`);
  };

  if (!leagueId) {
    return <div>Invalid league ID</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={handleBack} className="text-gray-600 hover:text-gray-900">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Top Scorers</h2>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Player
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Goals
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topScorers.map((scorer, index) => (
              <tr key={scorer.playerId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scorer.playerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scorer.teamName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scorer.goals}</td>
              </tr>
            ))}
            {topScorers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No scorers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
