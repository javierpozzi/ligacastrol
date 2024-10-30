import React from "react";
import { useStore } from "../../store";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { MatchService } from "../../services/match-service";
import { RepositoryFactory } from "../../repositories/factory";

interface MatchEditorProps {
  matchId: string;
  onClose: () => void;
}

export function MatchEditor({ matchId, onClose }: MatchEditorProps) {
  const { matches, locations, teams } = useStore();
  const match = matches.find((m) => m.id === matchId);

  const matchService = new MatchService(
    RepositoryFactory.getMatchRepository(),
    RepositoryFactory.getLeagueTeamRepository()
  );

  if (!match) return null;

  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const locationId = formData.get("locationId") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const homeScoreStr = formData.get("homeScore") as string;
    const awayScoreStr = formData.get("awayScore") as string;

    const dateTime = date && time ? new Date(`${date}T${time}`).toISOString() : null;

    // Check if either both scores are empty or both are valid numbers
    const homeScore = homeScoreStr === "" ? null : parseInt(homeScoreStr);
    const awayScore = awayScoreStr === "" ? null : parseInt(awayScoreStr);

    // Validate that if one score is provided, both must be provided
    if ((homeScore === null) !== (awayScore === null)) {
      toast.error("Both scores must be provided to complete a match");
      return;
    }

    // Validate scores are non-negative if provided
    if (homeScore !== null && awayScore !== null && (homeScore < 0 || awayScore < 0)) {
      toast.error("Scores must be non-negative numbers");
      return;
    }

    const newStatus = homeScore !== null && awayScore !== null ? "completed" : "scheduled";

    try {
      await matchService.updateMatch(matchId, {
        locationId: locationId === "" ? null : locationId,
        date: dateTime,
        homeScore,
        awayScore,
        status: newStatus,
      });

      toast.success("Match details updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update match");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center space-x-4 text-lg font-medium">
        <div className="flex flex-col items-center">
          <span>{homeTeam?.name}</span>
          <input
            type="number"
            name="homeScore"
            min="0"
            className="mt-2 w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            placeholder="Goals"
            defaultValue={match.homeScore ?? ""}
          />
        </div>
        <span>vs</span>
        <div className="flex flex-col items-center">
          <span>{awayTeam?.name}</span>
          <input
            type="number"
            name="awayScore"
            min="0"
            className="mt-2 w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            placeholder="Goals"
            defaultValue={match.awayScore ?? ""}
          />
        </div>
      </div>

      <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <select
          id="locationId"
          name="locationId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          defaultValue={match.locationId ?? ""}
        >
          <option value="">Select a location</option>
          {locations.map((location) => (
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
            defaultValue={match.date ? format(new Date(match.date), "yyyy-MM-dd") : ""}
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
            defaultValue={match.date ? format(new Date(match.date), "HH:mm") : ""}
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
