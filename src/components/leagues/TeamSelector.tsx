import React, { useState } from 'react';
import { useStore } from '../../store';
import { Search, X, Check } from 'lucide-react';

interface TeamSelectorProps {
  selectedTeams: string[];
  onTeamsChange: (teams: string[]) => void;
  currentLeagueId?: string;
}

export function TeamSelector({ selectedTeams, onTeamsChange, currentLeagueId }: TeamSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { teams, leagues, leagueTeams } = useStore();

  const getTeamLeague = (teamId: string) => {
    const activeLeagueTeam = leagueTeams.find(lt => 
      lt.leagueId !== currentLeagueId && 
      leagues.find(l => l.id === lt.leagueId)?.isActive && 
      lt.teamId === teamId
    );
    
    if (activeLeagueTeam) {
      return leagues.find(l => l.id === activeLeagueTeam.leagueId);
    }
    return null;
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleTeam = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      onTeamsChange(selectedTeams.filter(id => id !== teamId));
    } else {
      onTeamsChange([...selectedTeams, teamId]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teams ({selectedTeams.length} selected)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Search teams..."
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-64 overflow-y-auto">
          {selectedTeams.length > 0 && (
            <div className="bg-gray-50 p-3 border-b">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Teams</h4>
              <div className="space-y-2">
                {teams
                  .filter(team => selectedTeams.includes(team.id))
                  .map(team => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between bg-white p-2 rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium">{team.name}</span>
                      </div>
                      <button
                        onClick={() => handleToggleTeam(team.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Available Teams</h4>
            <div className="space-y-2">
              {filteredTeams
                .filter(team => !selectedTeams.includes(team.id))
                .map(team => {
                  const existingLeague = getTeamLeague(team.id);
                  return (
                    <div
                      key={team.id}
                      className="flex items-center justify-between bg-white p-2 rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <span className="text-sm font-medium">{team.name}</span>
                          {existingLeague && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {existingLeague.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleTeam(team.id)}
                        disabled={!!existingLeague}
                        className={`${
                          existingLeague
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}