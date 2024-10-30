import { useLeagueStandings } from "../../hooks/useLeagueStandings";
import { useTeams } from "../../hooks/useTeams";

interface LeagueTableProps {
  leagueId: string;
}

export function LeagueTable({ leagueId }: LeagueTableProps) {
  const { standings, loading: standingsLoading, error: standingsError } = useLeagueStandings(leagueId);
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();

  if (standingsLoading || teamsLoading) return <div>Loading...</div>;
  if (standingsError) return <div>Error loading standings: {standingsError.message}</div>;
  if (teamsError) return <div>Error loading teams: {teamsError.message}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Played
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Won
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Drawn
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lost
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GF
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GA
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GD
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Points
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {standings.map((standing, index) => {
            const team = teams.find(t => t.id === standing.teamId);
            if (!team) return null;

            return (
              <tr key={standing.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={team.logo} alt={team.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {team.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.played}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.won}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.drawn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.lost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.goalsFor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.goalsAgainst}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {standing.goalsFor - standing.goalsAgainst}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {standing.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}