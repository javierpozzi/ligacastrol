import React from 'react';
import { useStore } from '../../store';

interface LeagueTableProps {
  leagueId: string;
}

export function LeagueTable({ leagueId }: LeagueTableProps) {
  const { teams, leagues } = useStore();
  const league = leagues.find(l => l.id === leagueId);
  const leagueTeams = teams.filter(team => league?.teams.includes(team.id));

  const sortedTeams = [...leagueTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aGD = a.goalsFor - a.goalsAgainst;
    const bGD = b.goalsFor - b.goalsAgainst;
    if (bGD !== aGD) return bGD - aGD;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTeams.map((team, index) => (
            <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src={team.logo} alt={team.name} />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{team.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.played}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.won}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.drawn}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.lost}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsFor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsAgainst}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {team.goalsFor - team.goalsAgainst}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}