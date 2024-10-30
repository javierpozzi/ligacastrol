import React, { useState } from 'react';
import { useStore } from '../../store';
import { PlusCircle } from 'lucide-react';
import { TeamSelector } from './TeamSelector';

interface LeagueFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    year: number;
    isActive: boolean;
  };
}

export function LeagueForm({ onClose, initialData }: LeagueFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [year, setYear] = useState(initialData?.year ?? new Date().getFullYear());
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    initialData ? useStore(state => 
      state.leagueTeams
        .filter(lt => lt.leagueId === initialData.id)
        .map(lt => lt.teamId)
    ) : []
  );

  const addLeague = useStore(state => state.addLeague);
  const updateLeague = useStore(state => state.updateLeague);
  const addTeamToLeague = useStore(state => state.addTeamToLeague);
  const removeTeamFromLeague = useStore(state => state.removeTeamFromLeague);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      if (initialData) {
        updateLeague(initialData.id, { name, year, isActive });
        
        // Update teams
        const currentTeams = useStore.getState().leagueTeams
          .filter(lt => lt.leagueId === initialData.id)
          .map(lt => lt.teamId);
        
        // Remove teams that are no longer selected
        currentTeams.forEach(teamId => {
          if (!selectedTeams.includes(teamId)) {
            removeTeamFromLeague(initialData.id, teamId);
          }
        });

        // Add newly selected teams
        selectedTeams.forEach(teamId => {
          if (!currentTeams.includes(teamId)) {
            addTeamToLeague(initialData.id, teamId);
          }
        });
      } else {
        const { id } = addLeague({ name, year, isActive });
        selectedTeams.forEach(teamId => {
          addTeamToLeague(id, teamId);
        });
      }
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          League Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="Premier League"
          required
        />
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
          Year
        </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active League
        </label>
      </div>

      <TeamSelector 
        selectedTeams={selectedTeams} 
        onTeamsChange={setSelectedTeams}
        currentLeagueId={initialData?.id}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {initialData ? 'Update League' : 'Create League'}
        </button>
      </div>
    </form>
  );
}