import React from 'react';
import { useStore } from '../../store';
import { ArrowLeft, PlusCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface MatchWeeksProps {
  leagueId: string;
  onBack: () => void;
}

export function MatchWeeks({ leagueId, onBack }: MatchWeeksProps) {
  const { leagues, teams, matches, generateLeagueFixtures, clearLeagueFixtures } = useStore();
  const league = leagues.find(l => l.id === leagueId);
  
  if (!league) return null;

  const leagueMatches = matches.filter(m => m.leagueId === leagueId);
  const weekNumbers = Array.from(
    new Set(leagueMatches.map(m => m.weekNumber))
  ).sort((a, b) => a - b);

  const handleGenerateFixtures = () => {
    if (league.teams.length < 2) {
      toast.error('Need at least 2 teams to generate fixtures');
      return;
    }
    
    generateLeagueFixtures(leagueId);
    toast.success('Fixtures generated successfully');
  };

  const handleRegenerateFixtures = () => {
    if (league.teams.length < 2) {
      toast.error('Need at least 2 teams to generate fixtures');
      return;
    }

    clearLeagueFixtures(leagueId);
    generateLeagueFixtures(leagueId);
    toast.success('Fixtures regenerated successfully');
  };

  const getTeamName = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{league.name} - Fixtures</h2>
        </div>
        {leagueMatches.length === 0 ? (
          <button
            onClick={handleGenerateFixtures}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Generate Fixtures
          </button>
        ) : (
          <button
            onClick={handleRegenerateFixtures}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Fixtures
          </button>
        )}
      </div>

      {leagueMatches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto h-12 w-12 text-gray-400">📅</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No fixtures</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate fixtures to create the match schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {weekNumbers.map(weekNumber => (
            <div key={weekNumber} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Week {weekNumber}
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {leagueMatches
                  .filter(match => match.weekNumber === weekNumber)
                  .map(match => (
                    <li key={match.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900">
                            {getTeamName(match.homeTeamId)}
                          </span>
                          <span className="text-sm text-gray-500">vs</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getTeamName(match.awayTeamId)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}