import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { RepositoryFactory } from "../repositories/factory";

export function usePopulateDemoData() {
  const teamService = useMemo(() => RepositoryFactory.getTeamService(), []);
  const leagueService = useMemo(() => RepositoryFactory.getLeagueService(), []);
  const locationService = useMemo(() => RepositoryFactory.getLocationService(), []);
  const matchService = useMemo(() => RepositoryFactory.getMatchService(), []);

  const populateDemoData = useCallback(async () => {
    try {
      // Clear existing data
      // Note: We should add clear methods to services

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

      const premierLeagueTeamIds = await Promise.all(
        premierLeagueTeams.map((team) => teamService.createTeam(team).then((t) => t.id))
      );

      const championshipTeamIds = await Promise.all(
        championshipTeams.map((team) => teamService.createTeam(team).then((t) => t.id))
      );

      const locationIds = await Promise.all(
        locationConfigs.map((location) => locationService.createLocation(location).then((l) => l.id))
      );

      // Add leagues and generate fixtures
      const leagueConfigs = [
        {
          name: "Premier League",
          year: 2024,
          teamIds: premierLeagueTeamIds,
          playedWeeks: Math.floor((premierLeagueTeamIds.length - 1) / 2),
          isActive: true,
        },
        {
          name: "Premier League",
          year: 2023,
          teamIds: premierLeagueTeamIds,
          playedWeeks: premierLeagueTeamIds.length - 1,
          isActive: false,
        },
        {
          name: "Championship",
          year: 2024,
          teamIds: championshipTeamIds,
          playedWeeks: Math.floor((championshipTeamIds.length - 1) / 2),
          isActive: true,
        },
        {
          name: "Championship",
          year: 2023,
          teamIds: championshipTeamIds,
          playedWeeks: championshipTeamIds.length - 1,
          isActive: false,
        },
      ];

      for (const config of leagueConfigs) {
        const league = await leagueService.createLeague({
          name: config.name,
          year: config.year,
          isActive: config.isActive,
        });

        // Add teams to league
        await Promise.all(config.teamIds.map((teamId) => leagueService.addTeamToLeague(league.id, teamId)));

        // Generate fixtures
        await leagueService.generateFixtures(league.id);

        // Add played matches for specified weeks
        if (config.playedWeeks > 0) {
          const matches = await matchService.getByLeagueId(league.id);

          for (let week = 1; week <= config.playedWeeks; week++) {
            const weekMatches = matches.filter((m) => m.weekNumber === week);
            await Promise.all(
              weekMatches.map((match) => {
                const homeScore = Math.floor(Math.random() * 5);
                const awayScore = Math.floor(Math.random() * 5);
                const randomLocationId = locationIds[Math.floor(Math.random() * locationIds.length)];
                const matchDate = new Date(config.year, 7 + Math.floor(week / 4), 1 + (week % 4) * 7);
                matchDate.setHours(Math.random() > 0.5 ? 16 : 20);

                return matchService.updateMatch(match.id, {
                  homeScore,
                  awayScore,
                  status: "completed",
                  locationId: randomLocationId,
                  date: matchDate.toISOString(),
                });
              })
            );
          }
        }
      }

      toast.success("Demo data populated successfully");
    } catch (error) {
      toast.error("Failed to populate demo data");
      console.error(error);
    }
  }, [teamService, leagueService, locationService, matchService]);

  return populateDemoData;
}
