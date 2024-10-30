import React, { useState } from 'react';
import { useStore } from '../../store';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface WeekSchedulerProps {
  leagueId: string;
  weekNumber: number;
  onClose: () => void;
}

export function WeekScheduler({ leagueId, weekNumber, onClose }: WeekSchedulerProps) {
  const { matches, locations, updateMatch } = useStore();
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [matchDuration, setMatchDuration] = useState(120); // 2 hours in minutes
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  const weekMatches = matches.filter(
    match => match.leagueId === leagueId && match.weekNumber === weekNumber
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !startTime || !endTime || selectedLocationIds.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${startDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    // Calculate available time slots
    const availableSlots: { time: Date; locationId: string }[] = [];
    const durationInMs = matchDuration * 60 * 1000; // Convert minutes to milliseconds

    selectedLocationIds.forEach(locationId => {
      let currentTime = startDateTime;
      while (currentTime <= endDateTime) {
        availableSlots.push({
          time: new Date(currentTime),
          locationId
        });
        currentTime = new Date(currentTime.getTime() + durationInMs);
      }
    });

    if (availableSlots.length < weekMatches.length) {
      toast.error('Not enough time slots available for all matches');
      return;
    }

    // Shuffle available slots to randomize assignment
    const shuffledSlots = [...availableSlots].sort(() => Math.random() - 0.5);

    // Assign matches to time slots
    weekMatches.forEach((match, index) => {
      const slot = shuffledSlots[index];
      updateMatch(match.id, {
        date: slot.time.toISOString(),
        locationId: slot.locationId
      });
    });

    toast.success('Match schedule generated successfully');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Match Duration (minutes)
        </label>
        <input
          type="number"
          value={matchDuration}
          onChange={(e) => setMatchDuration(Number(e.target.value))}
          min="30"
          step="30"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Available Locations
        </label>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {locations.map(location => (
            <label key={location.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedLocationIds.includes(location.id)}
                onChange={(e) => {
                  setSelectedLocationIds(
                    e.target.checked
                      ? [...selectedLocationIds, location.id]
                      : selectedLocationIds.filter(id => id !== location.id)
                  );
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">{location.name}</span>
            </label>
          ))}
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
          Generate Schedule
        </button>
      </div>
    </form>
  );
} 