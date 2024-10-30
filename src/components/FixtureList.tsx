import React from 'react';
import { format } from 'date-fns';
import { useStore } from '../store';

interface FixtureListProps {
  leagueId: string;
  weekNumber: number;
}

export function FixtureList({ leagueId, weekNumber }: FixtureListProps) {
  const { matches, teams, locations } = useStore();

  const weekMatches = matches.filter(
    match => match.leagueId === leagueId && match.weekNumber === weekNumber
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Week {weekNumber}</h3>
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
                      </div>
                      <span className="text-sm text-gray-500">vs</span>
                      <div className="flex items-center">
                        <img src={awayTeam?.logo} alt={awayTeam?.name} className="w-8 h-8 rounded-full" />
                        <span className="ml-2 font-medium">{awayTeam?.name}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2 md:mt-0">
                      {match.date && (
                        <div>{format(new Date(match.date), 'PPp')}</div>
                      )}
                      {location && (
                        <div className="md:text-right">{location.name}</div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}