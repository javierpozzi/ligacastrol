import React, { useState } from 'react';
import { useStore } from '../../store';
import { PlusCircle } from 'lucide-react';
import { TeamSelector } from './TeamSelector';

interface LeagueFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    teams: string[];
  };
}

export function LeagueForm({ onClose, initialData }: LeagueFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [selectedTeams, setSelectedTeams] = useState<string[]>(initialData?.teams ?? []);
  const addLeague = useStore(state => state.addLeague);
  const updateLeague = useStore(state => state.updateLeague);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      if (initialData) {
        updateLeague(initialData.id, { name, teams: selectedTeams });
      } else {
        addLeague({ name, teams: selectedTeams });
      }
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <TeamSelector 
          selectedTeams={selectedTeams} 
          onTeamsChange={setSelectedTeams}
          currentLeagueId={initialData?.id}
        />
      </div>

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