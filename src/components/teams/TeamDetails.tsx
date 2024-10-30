import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { ArrowLeft, Trophy } from 'lucide-react';

export function TeamDetails() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { teams, leagues, leagueTeams } = useStore();

  const team = teams.find(t => t.id === teamId);
  
  if (!team) {
    return <div>Team not found</div>;
  }

  // Get all league participations for this team
  const teamParticipations = leagueTeams
    .filter(lt => lt.teamId === teamId)
    .map(lt => {
      const league = leagues.find(l => l.id === lt.leagueId);
      return {
        league,
        stats: lt
      };
    })
    .filter(participation => participation.league !== undefined)
    .sort((a, b) => {
      // Sort by year (desc) and then by active status
      if (a.league!.year !== b.league!.year) {
        return b.league!.year - a.league!.year;
      }
      return a.league!.isActive ? -1 : 1;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/teams')} 
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Team Details</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">League Participations</h3>
        
        {teamParticipations.map(({ league, stats }) => (
          <div key={league!.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className={`w-5 h-5 ${league!.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                <h4 className="text-lg font-medium text-gray-900">
                  {league!.name} {league!.year}
                </h4>
                {league!.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-500">Matches Played</div>
                <div className="text-lg font-semibold">{stats.played}</div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-500">Points</div>
                <div className="text-lg font-semibold">{stats.points}</div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-500">Goals</div>
                <div className="text-lg font-semibold">
                  {stats.goalsFor} - {stats.goalsAgainst}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-500">W/D/L</div>
                <div className="text-lg font-semibold">
                  {stats.won}/{stats.drawn}/{stats.lost}
                </div>
              </div>
            </div>
          </div>
        ))}

        {teamParticipations.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            This team hasn't participated in any leagues yet.
          </div>
        )}
      </div>
    </div>
  );
} 