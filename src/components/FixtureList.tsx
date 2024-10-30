import React, { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store';
import { Edit2 } from 'lucide-react';
import { Modal } from './shared/Modal';
import { MatchEditor } from './leagues/MatchEditor';
import { WeekScheduler } from './leagues/WeekScheduler';
import { Calendar } from 'lucide-react';

interface FixtureListProps {
  leagueId: string;
  weekNumber: number;
}

export function FixtureList({ leagueId, weekNumber }: FixtureListProps) {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const { matches, teams, locations } = useStore();

  const weekMatches = matches.filter(
    match => match.leagueId === leagueId && match.weekNumber === weekNumber
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Week {weekNumber}</h3>
        <button
          onClick={() => setIsSchedulerOpen(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Week
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {weekMatches.map(match => {
            const homeTeam = teams.find(t => t.id === match.homeTeamId);
            const awayTeam = teams.find(t => t.id === match.awayTeamId);
            const location = locations.find(l => l.id === match.locationId);

            return (
              <li key={match.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0">
                      <div className="flex items-center">
                        <img src={homeTeam?.logo} alt={homeTeam?.name} className="w-8 h-8 rounded-full" />
                        <span className="ml-2 font-medium">{homeTeam?.name}</span>
                        {match.status === 'completed' && (
                          <span className="ml-2 font-bold">{match.homeScore}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">vs</span>
                      <div className="flex items-center">
                        <img src={awayTeam?.logo} alt={awayTeam?.name} className="w-8 h-8 rounded-full" />
                        <span className="ml-2 font-medium">{awayTeam?.name}</span>
                        {match.status === 'completed' && (
                          <span className="ml-2 font-bold">{match.awayScore}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500 mt-2 md:mt-0">
                        {match.date && (
                          <div>{format(new Date(match.date), 'PPp')}</div>
                        )}
                        {location && (
                          <div className="md:text-right">{location.name}</div>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingMatchId(match.id)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Modal
        isOpen={!!editingMatchId}
        onClose={() => setEditingMatchId(null)}
        title="Edit Match Details"
      >
        {editingMatchId && (
          <MatchEditor
            matchId={editingMatchId}
            onClose={() => setEditingMatchId(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        title={`Schedule Week ${weekNumber} Matches`}
      >
        <WeekScheduler
          leagueId={leagueId}
          weekNumber={weekNumber}
          onClose={() => setIsSchedulerOpen(false)}
        />
      </Modal>
    </div>
  );
}