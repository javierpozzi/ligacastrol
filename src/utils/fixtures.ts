export function generateFixtures(teams: string[]): Array<{ home: string; away: string }> {
  const fixtures: Array<{ home: string; away: string }> = [];

  // Shuffle the teams array
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);

  const numberOfTeams = shuffledTeams.length;

  // If odd number of teams, add a bye
  const teamsToSchedule = numberOfTeams % 2 === 0 ? shuffledTeams : [...shuffledTeams, "bye"];
  const totalRounds = teamsToSchedule.length - 1;
  const matchesPerRound = teamsToSchedule.length / 2;

  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = teamsToSchedule[match];
      const away = teamsToSchedule[teamsToSchedule.length - 1 - match];

      if (home !== "bye" && away !== "bye") {
        // Randomly decide home/away to make it more interesting
        if (Math.random() > 0.5) {
          fixtures.push({ home, away });
        } else {
          fixtures.push({ home: away, away: home });
        }
      }
    }

    // Rotate teams for next round (first team stays fixed)
    teamsToSchedule.splice(1, 0, teamsToSchedule.pop()!);
  }

  return fixtures;
}
