import { useCallback } from "react";
import { useStore } from "../store";
import toast from "react-hot-toast";

export function usePopulateDemoData() {
  const populateDemoData = useCallback(() => {
    const { addTeam, addLeague, addLocation, addTeamToLeague, generateLeagueFixtures } = useStore.getState();

    // Clear existing data
    useStore.setState({
      teams: [],
      leagues: [],
      leagueTeams: [],
      locations: [],
      matches: [],
    });

    // Add Premier League teams
    const premierLeagueTeams = [
      { name: "Manchester United", logo: "https://resources.premierleague.com/premierleague/badges/t1.svg" },
      { name: "Liverpool", logo: "https://resources.premierleague.com/premierleague/badges/t14.svg" },
      { name: "Chelsea", logo: "https://resources.premierleague.com/premierleague/badges/t8.svg" },
      { name: "Arsenal", logo: "https://resources.premierleague.com/premierleague/badges/t3.svg" },
      { name: "Manchester City", logo: "https://resources.premierleague.com/premierleague/badges/t43.svg" },
      { name: "Tottenham", logo: "https://resources.premierleague.com/premierleague/badges/t6.svg" },
      { name: "Newcastle", logo: "https://resources.premierleague.com/premierleague/badges/t4.svg" },
      { name: "West Ham", logo: "https://resources.premierleague.com/premierleague/badges/t21.svg" },
      { name: "Leicester", logo: "https://resources.premierleague.com/premierleague/badges/t13.svg" },
      { name: "Everton", logo: "https://resources.premierleague.com/premierleague/badges/t11.svg" },
    ];

    // Add Championship teams
    const championshipTeams = [
      { name: "Leeds United", logo: "https://resources.premierleague.com/premierleague/badges/t2.svg" },
      { name: "Norwich City", logo: "https://resources.premierleague.com/premierleague/badges/t45.svg" },
      { name: "Watford", logo: "https://resources.premierleague.com/premierleague/badges/t57.svg" },
      { name: "Southampton", logo: "https://resources.premierleague.com/premierleague/badges/t20.svg" },
      { name: "Sheffield United", logo: "https://resources.premierleague.com/premierleague/badges/t49.svg" },
      { name: "Burnley", logo: "https://resources.premierleague.com/premierleague/badges/t90.svg" },
      { name: "Middlesbrough", logo: "https://resources.premierleague.com/premierleague/badges/t91.svg" },
      { name: "West Bromwich", logo: "https://resources.premierleague.com/premierleague/badges/t35.svg" },
      { name: "Stoke City", logo: "https://resources.premierleague.com/premierleague/badges/t110.svg" },
      { name: "Swansea City", logo: "https://resources.premierleague.com/premierleague/badges/t80.svg" },
    ];

    // Create teams and get their IDs
    const premierLeagueTeamIds = premierLeagueTeams.map((config) => {
      const { id } = addTeam(config);
      return id;
    });

    const championshipTeamIds = championshipTeams.map((config) => {
      const { id } = addTeam(config);
      return id;
    });

    // Add locations
    const locationConfigs = [
      { name: "Old Trafford", address: "Sir Matt Busby Way, Manchester M16 0RA" },
      { name: "Anfield", address: "Anfield Road, Liverpool L4 0TH" },
      { name: "Stamford Bridge", address: "Fulham Road, London SW6 1HS" },
      { name: "Emirates Stadium", address: "Hornsey Rd, London N7 7AJ" },
      { name: "Etihad Stadium", address: "Ashton New Road, Manchester M11 3FF" },
      { name: "Tottenham Hotspur Stadium", address: "782 High Rd, London N17 0BX" },
      { name: "St James' Park", address: "St. James' Park, Newcastle upon Tyne NE1 4ST" },
      { name: "London Stadium", address: "London E20 2ST" },
      { name: "King Power Stadium", address: "Filbert Way, Leicester LE2 7FL" },
      { name: "Goodison Park", address: "Goodison Road, Liverpool L4 4EL" },
    ];

    const locationIds = locationConfigs.map((config) => {
      const { id } = addLocation(config);
      return id;
    });

    // Calculate total weeks for a season (each team plays against every other team once)
    const totalTeams = premierLeagueTeamIds.length;
    const totalWeeks = totalTeams - 1;
    const halfSeason = Math.floor(totalWeeks / 2);

    // Add leagues with teams and generate fixtures
    const leagueConfigs = [
      { name: "Premier League", year: 2024, teamIds: premierLeagueTeamIds, playedWeeks: halfSeason, isActive: true },
      { name: "Premier League", year: 2023, teamIds: premierLeagueTeamIds, playedWeeks: totalWeeks, isActive: false },
      { name: "Championship", year: 2024, teamIds: championshipTeamIds, playedWeeks: halfSeason, isActive: true },
      { name: "Championship", year: 2023, teamIds: championshipTeamIds, playedWeeks: halfSeason, isActive: false },
    ];

    leagueConfigs.forEach(({ name, year, teamIds, playedWeeks, isActive }) => {
      // Add league
      const { id: leagueId } = addLeague({
        name,
        year,
        isActive,
      });

      // Add teams to league
      teamIds.forEach((teamId) => {
        addTeamToLeague(leagueId, teamId);
      });

      // Generate fixtures
      generateLeagueFixtures(leagueId);

      // Then get the updated matches from the store
      const leagueMatches = useStore.getState().matches.filter((m) => m.leagueId === leagueId);

      // Add played matches for specified weeks
      if (playedWeeks > 0) {
        for (let week = 1; week <= playedWeeks; week++) {
          const weekMatches = leagueMatches.filter((m) => m.weekNumber === week);
          weekMatches.forEach((match) => {
            const homeScore = Math.floor(Math.random() * 5);
            const awayScore = Math.floor(Math.random() * 5);
            const randomLocationId = locationIds[Math.floor(Math.random() * locationIds.length)];
            const matchDate = new Date(year, 7 + Math.floor(week / 4), 1 + (week % 4) * 7);
            matchDate.setHours(Math.random() > 0.5 ? 16 : 20);

            useStore.getState().updateMatch(match.id, {
              homeScore,
              awayScore,
              status: "completed",
              locationId: randomLocationId,
              date: matchDate.toISOString(),
            });
          });
        }
      }
    });

    toast.success("Demo data populated successfully");
  }, []);

  return populateDemoData;
}
