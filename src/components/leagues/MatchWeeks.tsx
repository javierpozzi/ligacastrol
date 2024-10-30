import { Calendar } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RepositoryFactory } from "../../repositories/factory";
import { Match } from "../../types";
import { FixtureList } from "../FixtureList";

interface MatchWeeksProps {
  leagueId: string;
  onBack: () => void;
}

export function MatchWeeks({ leagueId, onBack }: MatchWeeksProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const matchService = useMemo(() => RepositoryFactory.getMatchService(), []);

  const leagueService = useMemo(() => RepositoryFactory.getLeagueService(), []);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const matchData = await matchService.getMatchesByLeagueId(leagueId);
      setMatches(matchData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load matches"));
    } finally {
      setLoading(false);
    }
  }, [leagueId, matchService]);

  const handleGenerateFixtures = async () => {
    try {
      await leagueService.generateFixtures(leagueId);
      await loadMatches();
      toast.success("Fixtures generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate fixtures");
    }
  };

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const weekNumbers = Array.from(new Set(matches.map((m) => m.weekNumber))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Match Weeks</h2>
        </div>
        <div className="space-x-2">
          {matches.length === 0 && (
            <button
              onClick={handleGenerateFixtures}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Generate Fixtures
            </button>
          )}
        </div>
      </div>

      {weekNumbers.map((weekNumber) => (
        <FixtureList key={weekNumber} leagueId={leagueId} weekNumber={weekNumber} />
      ))}
    </div>
  );
}
