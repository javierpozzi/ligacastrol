import React from 'react';
import { useStore } from '../../store';
import { format } from 'date-fns';

interface MatchEditorProps {
  matchId: string;
  onClose: () => void;
}

export function MatchEditor({ matchId, onClose }: MatchEditorProps) {
  const { matches, locations, teams, updateMatch } = useStore();
  const match = matches.find(m => m.id === matchId);
  
  if (!match) return null;
  
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const locationId = formData.get('locationId') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    
    const dateTime = date && time ? new Date(`${date}T${time}`).toISOString() : null;
    
    updateMatch(matchId, {
      locationId: locationId === '' ? null : locationId,
      date: dateTime
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center space-x-4 text-lg font-medium">
        <span>{homeTeam?.name}</span>
        <span>vs</span>
        <span>{awayTeam?.name}</span>
      </div>

      <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <select
          id="locationId"
          name="locationId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          defaultValue={match.locationId ?? ''}
        >
          <option value="">Select a location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            defaultValue={match.date ? format(new Date(match.date), 'yyyy-MM-dd') : ''}
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            defaultValue={match.date ? format(new Date(match.date), 'HH:mm') : ''}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
} 