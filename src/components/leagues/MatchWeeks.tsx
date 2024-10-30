import React from 'react';
import { useStore } from '../../store';
import { ArrowLeft, PlusCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { FixtureList } from '../FixtureList';

interface MatchWeeksProps {
  leagueId: string;
  onBack: () => void;
}

export function MatchWeeks({ leagueId, onBack }: MatchWeeksProps) {
  const { leagues, matches, generateLeagueFixtures, clearLeagueFixtures, leagueTeams } = useStore();
  const league = leagues.find(l => l.id === leagueId);
  
  if (!league) return null;

  const leagueMatches = matches.filter(m => m.leagueId === leagueId);
  const weekNumbers = Array.from(
    new Set(leagueMatches.map(m => m.weekNumber))
  ).sort((a, b) => a - b);

  const handleGenerateFixtures = () => {
    const teamCount = leagueTeams.filter(lt => lt.leagueId === leagueId).length;
    if (teamCount < 2) {
      toast.error('Need at least 2 teams to generate fixtures');
      return;
    }
    
    generateLeagueFixtures(leagueId);
    toast.success('Fixtures generated successfully');
  };

  const handleRegenerateFixtures = () => {
    const teamCount = leagueTeams.filter(lt => lt.leagueId === leagueId).length;
    if (teamCount < 2) {
      toast.error('Need at least 2 teams to generate fixtures');
      return;
    }

    clearLeagueFixtures(leagueId);
    generateLeagueFixtures(leagueId);
    toast.success('Fixtures regenerated successfully');
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

      <div className="space-y-8">
        {weekNumbers.map(weekNumber => (
          <FixtureList
            key={weekNumber}
            leagueId={leagueId}
            weekNumber={weekNumber}
          />
        ))}
      </div>
    </div>
  );
}