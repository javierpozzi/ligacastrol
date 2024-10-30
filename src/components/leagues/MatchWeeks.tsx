import { Calendar, Clock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RepositoryFactory } from "../../repositories/factory";
import { Match } from "../../types";
import { FixtureList } from "../FixtureList";
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from "../shared/Modal";
import { WeekScheduler } from "./WeekScheduler";

export function MatchWeeks() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const matchService = useMemo(() => RepositoryFactory.getMatchService(), []);
  const leagueService = useMemo(() => RepositoryFactory.getLeagueService(), []);

  const loadMatches = useCallback(async () => {
    if (!leagueId) return;
    
    try {
      setLoading(true);
      const matchData = await matchService.getByLeagueId(leagueId);
      setMatches(matchData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load matches"));
    } finally {
      setLoading(false);
    }
  }, [leagueId, matchService]);

  const handleGenerateFixtures = async () => {
    if (!leagueId) return;

    try {
      await leagueService.generateFixtures(leagueId);
      await loadMatches();
      toast.success("Fixtures generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate fixtures");
    }
  };

  const handleScheduleWeek = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    setIsSchedulerOpen(true);
  };

  const handleCloseScheduler = () => {
    setIsSchedulerOpen(false);
    setSelectedWeek(null);
    loadMatches(); // Reload matches to show updated schedules
  };

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleBack = () => {
    navigate('/');
  };

  const handleMatchClick = (matchId: string) => {
    navigate(`/league/${leagueId}/match/${matchId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!leagueId) return <div>Invalid league ID</div>;

  const weekNumbers = Array.from(new Set(matches.map((m) => m.weekNumber))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-900">
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
        <div key={weekNumber} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Week {weekNumber}</h3>
            <button
              onClick={() => handleScheduleWeek(weekNumber)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <Clock className="w-4 h-4 mr-1" />
              Schedule Week
            </button>
          </div>
          <FixtureList 
            leagueId={leagueId} 
            weekNumber={weekNumber} 
            onMatchClick={handleMatchClick}
          />
        </div>
      ))}

      {isSchedulerOpen && selectedWeek !== null && leagueId && (
        <Modal 
          isOpen={isSchedulerOpen} 
          onClose={handleCloseScheduler}
          title={`Schedule Week ${selectedWeek}`}
        >
          <WeekScheduler
            leagueId={leagueId}
            weekNumber={selectedWeek}
            onClose={handleCloseScheduler}
          />
        </Modal>
      )}
    </div>
  );
}
