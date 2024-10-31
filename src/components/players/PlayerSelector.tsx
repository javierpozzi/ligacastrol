import { useStore } from "../../store";

interface PlayerSelectorProps {
  teamId: string;
  value?: string;
  onChange: (playerId: string | undefined) => void;
  allowUnassigned?: boolean;
}

export function PlayerSelector({ teamId, value, onChange, allowUnassigned = true }: PlayerSelectorProps) {
  const { players } = useStore();
  
  const teamPlayers = players.filter(p => p.teamId === teamId && !p.disabled);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
    >
      {allowUnassigned && <option value="">Unassigned</option>}
      {teamPlayers.map((player) => (
        <option key={player.id} value={player.id}>
          {player.name}
        </option>
      ))}
    </select>
  );
}
