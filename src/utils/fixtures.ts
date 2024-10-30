export function generateFixtures(teams: string[]): Array<{ home: string; away: string }> {
  const fixtures: Array<{ home: string; away: string }> = [];
  const numberOfTeams = teams.length;

  // If odd number of teams, add a bye
  const teamsToSchedule = numberOfTeams % 2 === 0 ? teams : [...teams, "bye"];
  const totalRounds = teamsToSchedule.length - 1;
  const matchesPerRound = teamsToSchedule.length / 2;

  // Generate first half of season
  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = teamsToSchedule[match];
      const away = teamsToSchedule[teamsToSchedule.length - 1 - match];

      if (home !== "bye" && away !== "bye") {
        fixtures.push({ home, away });
      }
    }
    // Rotate teams for next round (first team stays fixed)
    teamsToSchedule.splice(1, 0, teamsToSchedule.pop()!);
  }

  // Generate return fixtures (second half of season)
  const firstHalfFixtures = [...fixtures];
  firstHalfFixtures.forEach((fixture) => {
    fixtures.push({ home: fixture.away, away: fixture.home });
  });

  return fixtures;
}
