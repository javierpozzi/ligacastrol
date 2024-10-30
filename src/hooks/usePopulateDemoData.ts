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
      // First create locations
      const locationConfigs = [
        { name: "Main Stadium", address: "123 Main St" },
        { name: "Community Field", address: "456 Park Ave" },
        { name: "Training Ground", address: "789 Sports Blvd" },
        { name: "City Arena", address: "321 City Road" },
        { name: "Sports Complex", address: "654 Complex Ave" },
      ];

      const locationIds = await Promise.all(
        locationConfigs.map((location) => locationService.createLocation(location).then((l) => l.id))
      );

      // Create teams with preferences
      const premierLeagueTeams = [
        {
          name: "Arsenal",
          logo: "https://resources.premierleague.com/premierleague/badges/t3.svg",
          preferences: {
            preferredLocationIds: [locationIds[0]],
            preferredStartHour: 15,
            preferredEndHour: 18,
          },
        },
        {
          name: "Chelsea",
          logo: "https://resources.premierleague.com/premierleague/badges/t8.svg",
          preferences: {
            preferredLocationIds: [locationIds[0], locationIds[1]],
            preferredStartHour: 13,
            preferredEndHour: 16,
          },
        },
        {
          name: "Liverpool",
          logo: "https://resources.premierleague.com/premierleague/badges/t14.svg",
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 12,
            preferredEndHour: 15,
          },
        },
        {
          name: "Manchester City",
          logo: "https://resources.premierleague.com/premierleague/badges/t43.svg",
          preferences: {
            preferredLocationIds: [locationIds[1]],
            preferredStartHour: 10,
            preferredEndHour: 14,
          },
        },
        {
          name: "Manchester United",
          logo: "https://resources.premierleague.com/premierleague/badges/t1.svg",
          preferences: {
            preferredLocationIds: [locationIds[0]],
            preferredStartHour: 16,
            preferredEndHour: 18,
          },
        },
        {
          name: "Tottenham",
          logo: "https://resources.premierleague.com/premierleague/badges/t6.svg",
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 9,
            preferredEndHour: 21,
          },
        },
        {
          name: "Newcastle",
          logo: "https://resources.premierleague.com/premierleague/badges/t4.svg",
          preferences: {
            preferredLocationIds: [locationIds[3]],
            preferredStartHour: 14,
            preferredEndHour: 17,
          },
        },
        {
          name: "Aston Villa",
          logo: "https://resources.premierleague.com/premierleague/badges/t7.svg",
          preferences: {
            preferredLocationIds: [locationIds[4]],
            preferredStartHour: 11,
            preferredEndHour: 15,
          },
        },
        {
          name: "West Ham",
          logo: "https://resources.premierleague.com/premierleague/badges/t21.svg",
          preferences: {
            preferredLocationIds: [locationIds[1], locationIds[2]],
            preferredStartHour: 13,
            preferredEndHour: 16,
          },
        },
        {
          name: "Brighton",
          logo: "https://resources.premierleague.com/premierleague/badges/t36.svg",
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 9,
            preferredEndHour: 21,
          },
        },
      ];

      const championshipTeams = [
        {
          name: "Leeds United",
          logo: "https://resources.premierleague.com/premierleague/badges/t2.svg",
          preferences: {
            preferredLocationIds: [locationIds[2]],
            preferredStartHour: 14,
            preferredEndHour: 17,
          },
        },
        {
          name: "Nottingham Forest",
          logo: "https://resources.premierleague.com/premierleague/badges/t17.svg",
          preferences: {
            preferredLocationIds: [locationIds[1], locationIds[2]],
            preferredStartHour: 11,
            preferredEndHour: 15,
          },
        },
        {
          name: "Sheffield United",
          logo: "https://resources.premierleague.com/premierleague/badges/t49.svg",
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 9,
            preferredEndHour: 21,
          },
        },
        {
          name: "West Bromwich Albion",
          logo: "https://resources.premierleague.com/premierleague/badges/t35.svg",
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 9,
            preferredEndHour: 21,
          },
        },
        {
          name: "Middlesbrough",
          logo: "https://resources.premierleague.com/premierleague/badges/t25.svg",
          preferences: {
            preferredLocationIds: [locationIds[3], locationIds[4]],
            preferredStartHour: 12,
            preferredEndHour: 16,
          },
        },
        {
          name: "Stoke City",
          logo: "https://resources.premierleague.com/premierleague/badges/t110.svg",
          preferences: {
            preferredLocationIds: [locationIds[2]],
            preferredStartHour: 15,
            preferredEndHour: 18,
          },
        },
        {
          name: "Watford",
          logo: "https://resources.premierleague.com/premierleague/badges/t57.svg",
          preferences: {
            preferredLocationIds: [locationIds[1]],
            preferredStartHour: 10,
            preferredEndHour: 14,
          },
        },
        {
          name: "Sunderland",
          logo: "https://resources.premierleague.com/premierleague/badges/t56.svg",
          preferences: {
            preferredLocationIds: [],
            preferredStartHour: 9,
            preferredEndHour: 21,
          },
        },
      ];

      const premierLeagueTeamIds = await Promise.all(
        premierLeagueTeams.map((team) => teamService.createTeam(team).then((t) => t.id))
      );

      const championshipTeamIds = await Promise.all(
        championshipTeams.map((team) => teamService.createTeam(team).then((t) => t.id))
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

  return { populateDemoData };
}
