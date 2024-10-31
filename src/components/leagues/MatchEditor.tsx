import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { RepositoryFactory } from "../../repositories/factory";
import { MatchService } from "../../services/match-service";
import { useStore } from "../../store";
import { PlayerSelector } from "../players/PlayerSelector";

export default function MatchEditor() {
  const { leagueId, matchId } = useParams<{ leagueId: string; matchId: string }>();
  const navigate = useNavigate();
  const {
    matches,
    locations,
    teams,
    matchGoals: allMatchGoals,
    addMatchGoal,
    updateMatchGoal,
    removeMatchGoal,
  } = useStore();

  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");

  const match = useMemo(() => {
    if (!leagueId || !matchId) return null;
    return matches.find((m) => m.id === matchId);
  }, [leagueId, matchId, matches]);

  const homeTeam = useMemo(() => (match ? teams.find((t) => t.id === match.homeTeamId) : null), [match, teams]);
  const awayTeam = useMemo(() => (match ? teams.find((t) => t.id === match.awayTeamId) : null), [match, teams]);

  const matchGoals = useMemo(() => {
    if (!match) return { homeGoals: [], awayGoals: [] };
    const goals = allMatchGoals.filter((g) => g.matchId === match.id);
    return {
      homeGoals: goals.filter((g) => g.teamId === match.homeTeamId),
      awayGoals: goals.filter((g) => g.teamId === match.awayTeamId),
    };
  }, [match, allMatchGoals]);

  useEffect(() => {
    if (match) {
      setHomeScore(match.homeScore?.toString() ?? "");
      setAwayScore(match.awayScore?.toString() ?? "");
    }
  }, [match]);

  const handleAddScorer = (teamId: string) => {
    if (!match) return;
    addMatchGoal({
      matchId: match.id,
      teamId: teamId,
    });
  };

  const handleRemoveGoal = (goalId: string) => {
    removeMatchGoal(goalId);
  };

  const handleUpdateScorer = (goalId: string, playerId: string | undefined) => {
    updateMatchGoal(goalId, { playerId });
  };

  const matchService = new MatchService(
    RepositoryFactory.getMatchRepository(),
    RepositoryFactory.getLeagueTeamRepository()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const locationId = formData.get("locationId") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;

    const dateTime = date && time ? new Date(`${date}T${time}`).toISOString() : null;

    // Use the state values instead of form data for scores
    const homeScoreNum = homeScore === "" ? null : parseInt(homeScore);
    const awayScoreNum = awayScore === "" ? null : parseInt(awayScore);

    // Validate that if one score is provided, both must be provided
    if ((homeScoreNum === null) !== (awayScoreNum === null)) {
      toast.error("Both scores must be provided to complete a match");
      return;
    }

    // Validate scores are non-negative if provided
    if (homeScoreNum !== null && awayScoreNum !== null && (homeScoreNum < 0 || awayScoreNum < 0)) {
      toast.error("Scores must be non-negative numbers");
      return;
    }

    const newStatus = homeScoreNum !== null && awayScoreNum !== null ? "completed" : "scheduled";

    try {
      await matchService.updateMatch(matchId!, {
        locationId: locationId === "" ? null : locationId,
        date: dateTime,
        homeScore: homeScoreNum,
        awayScore: awayScoreNum,
        status: newStatus,
      });

      toast.success("Match details updated successfully");
      navigate(`/league/${leagueId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update match");
    }
  };

  const handleBack = () => {
    navigate(`/league/${leagueId}`);
  };

  if (!match || !homeTeam || !awayTeam) {
    return <div>Match or teams not found</div>;
  }

  const homeScoreNum = parseInt(homeScore) || 0;
  const awayScoreNum = parseInt(awayScore) || 0;
  const homeScorersCount = matchGoals.homeGoals.length;
  const awayScorersCount = matchGoals.awayGoals.length;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={handleBack} className="mb-4">
        Back to League
      </button>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Score Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center space-x-4 text-lg font-medium mb-6">
            <div className="flex flex-col items-center space-y-2">
              <span>{homeTeam.name}</span>
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-center"
              />
            </div>
            <span className="text-2xl">vs</span>
            <div className="flex flex-col items-center space-y-2">
              <span>{awayTeam.name}</span>
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-center"
              />
            </div>
          </div>

          {/* Scorers Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Home Team Scorers */}
            {homeScoreNum > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">{homeTeam.name} Scorers</h4>
                {matchGoals.homeGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <PlayerSelector
                      teamId={match.homeTeamId}
                      value={goal.playerId}
                      onChange={(playerId) => handleUpdateScorer(goal.id, playerId)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {homeScorersCount < homeScoreNum && (
                  <button
                    type="button"
                    onClick={() => handleAddScorer(match.homeTeamId)}
                    className="text-green-600 hover:text-green-800"
                  >
                    + Add Scorer
                  </button>
                )}
              </div>
            )}

            {/* Away Team Scorers */}
            {awayScoreNum > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">{awayTeam.name} Scorers</h4>
                {matchGoals.awayGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <PlayerSelector
                      teamId={match.awayTeamId}
                      value={goal.playerId}
                      onChange={(playerId) => handleUpdateScorer(goal.id, playerId)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {awayScorersCount < awayScoreNum && (
                  <button
                    type="button"
                    onClick={() => handleAddScorer(match.awayTeamId)}
                    className="text-green-600 hover:text-green-800"
                  >
                    + Add Scorer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Match Details Section */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
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
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleBack}
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
    </div>
  );
}
