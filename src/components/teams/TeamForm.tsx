import { useState } from "react";
import toast from "react-hot-toast";
import { usePlayers } from "../../hooks/usePlayers";
import { useTeams } from "../../hooks/useTeams";
import { RepositoryFactory } from "../../repositories/factory";
import { useStore } from "../../store";
import { Player } from "../../types";

interface TeamFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    logo: string;
    preferences: {
      preferredLocationIds: string[];
      preferredStartHour: number;
      preferredEndHour: number;
    };
  };
}

export function TeamForm({ onClose, initialData }: TeamFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [logo, setLogo] = useState(initialData?.logo ?? "");
  const [preferredLocationIds, setPreferredLocationIds] = useState<string[]>(
    initialData?.preferences?.preferredLocationIds ?? []
  );
  const [preferredStartHour, setPreferredStartHour] = useState(initialData?.preferences?.preferredStartHour ?? 9);
  const [preferredEndHour, setPreferredEndHour] = useState(initialData?.preferences?.preferredEndHour ?? 21);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState("");
  const { allPlayers, createPlayer, updatePlayer } = usePlayers(initialData?.id ?? "");

  const { reloadTeams } = useTeams();
  const { locations } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const teamService = RepositoryFactory.getTeamService();
      const teamData = {
        name,
        logo,
        preferences: {
          preferredLocationIds,
          preferredStartHour,
          preferredEndHour,
        },
      };

      if (initialData) {
        await teamService.updateTeam(initialData.id, teamData);
        toast.success("Team updated successfully");
      } else {
        await teamService.createTeam(teamData);
        toast.success("Team created successfully");
      }

      reloadTeams();
      onClose();
    } catch (error) {
      toast.error(initialData ? "Failed to update team" : "Failed to create team");
    }
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;

    createPlayer(newPlayerName.trim());
    setNewPlayerName("");
  };

  const handleStartEditPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerName(player.name);
  };

  const handleSavePlayerEdit = (playerId: string) => {
    const trimmedName = editingPlayerName.trim();
    if (!trimmedName) return;

    // Check for name overlap with other active players
    const nameExists = allPlayers.some(
      (p) => p.id !== playerId && !p.disabled && p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (nameExists) {
      toast.error("A player with this name already exists");
      return;
    }

    updatePlayer(playerId, { name: trimmedName });
    setEditingPlayerId(null);
    setEditingPlayerName("");
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditingPlayerName("");
  };

  const handleTogglePlayerStatus = (player: Player) => {
    updatePlayer(player.id, { disabled: !player.disabled });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Team Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          id="logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Locations</label>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {locations.map((location) => (
            <label key={location.id} className="flex items-center">
              <input
                type="checkbox"
                checked={preferredLocationIds.includes(location.id)}
                onChange={(e) => {
                  setPreferredLocationIds(
                    e.target.checked
                      ? [...preferredLocationIds, location.id]
                      : preferredLocationIds.filter((id) => id !== location.id)
                  );
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">{location.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="preferredStartHour" className="block text-sm font-medium text-gray-700">
            Preferred Start Hour
          </label>
          <select
            id="preferredStartHour"
            value={preferredStartHour}
            onChange={(e) => setPreferredStartHour(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferredEndHour" className="block text-sm font-medium text-gray-700">
            Preferred End Hour
          </label>
          <select
            id="preferredEndHour"
            value={preferredEndHour}
            onChange={(e) => setPreferredEndHour(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Team Players</h3>

        {/* Player list */}
        <div className="space-y-2">
          {allPlayers.map((player) => (
            <div
              key={player.id}
              className={`flex justify-between items-center p-2 rounded ${
                player.disabled ? "bg-gray-100" : "bg-white"
              }`}
            >
              {editingPlayerId === player.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingPlayerName}
                    onChange={(e) => setEditingPlayerName(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSavePlayerEdit(player.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Save
                  </button>
                  <button type="button" onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className={player.disabled ? "text-gray-500" : ""}>
                    {player.name}
                    {player.disabled && " (Disabled)"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditPlayer(player)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePlayerStatus(player)}
                      className={`${
                        player.disabled ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      {player.disabled ? "Enable" : "Disable"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add player form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={handleAddPlayer}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Player
          </button>
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
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
