import { useStore } from "../store";

export function usePlayers(teamId: string) {
  const players = useStore((state) => state.getPlayersByTeam(teamId, false));
  const allPlayers = useStore((state) => state.getPlayersByTeam(teamId, true));
  const addPlayer = useStore((state) => state.addPlayer);
  const disablePlayer = useStore((state) => state.removePlayer);
  const updatePlayer = useStore((state) => state.updatePlayer);

  const createPlayer = (name: string) => {
    return addPlayer({
      name,
      teamId,
      disabled: false,
    });
  };

  return {
    players,
    allPlayers,
    createPlayer,
    disablePlayer,
    updatePlayer,
  };
}
