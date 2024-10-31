import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store";

export function LeagueDetails() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const { leagues } = useStore();

  const league = useMemo(() => {
    if (!leagueId) return null;
    return leagues.find((l) => l.id === leagueId);
  }, [leagueId, leagues]);

  const handleBack = () => {
    navigate(`/`);
  };

  if (!leagueId || !league) {
    return <div>League not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{league.name}</h2>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/league/${leagueId}/standings`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Standings
          </button>
          <button
            onClick={() => navigate(`/league/${leagueId}/scorers`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Top Scorers
          </button>
          <button
            onClick={() => navigate(`/league/${leagueId}/matches`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Matches
          </button>
        </div>
      </div>
      {/* ... rest of the component JSX ... */}
    </div>
  );
}
