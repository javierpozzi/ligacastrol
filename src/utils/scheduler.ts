import { Match, Team, Location } from "../types";

interface TimeSlot {
  time: Date;
  locationId: string;
  score: number;
}

interface SchedulingResult {
  success: boolean;
  schedule: Map<string, TimeSlot>;
  violations: {
    matchId: string;
    teamId: string;
    type: "location" | "time";
  }[];
}

function calculateSlotScore(slot: Omit<TimeSlot, "score">, homeTeam: Team, awayTeam: Team): number {
  let score = 0;
  const hour = slot.time.getHours();

  // Location preferences
  if (homeTeam.preferences.preferredLocationIds.includes(slot.locationId)) {
    score += 2;
  }
  if (awayTeam.preferences.preferredLocationIds.includes(slot.locationId)) {
    score += 2;
  }

  // Time preferences for home team
  if (hour >= homeTeam.preferences.preferredStartHour && hour <= homeTeam.preferences.preferredEndHour) {
    score += 2;
  } else {
    // Penalty for being outside preferred hours
    score -= Math.min(
      Math.abs(hour - homeTeam.preferences.preferredStartHour),
      Math.abs(hour - homeTeam.preferences.preferredEndHour)
    );
  }

  // Time preferences for away team
  if (hour >= awayTeam.preferences.preferredStartHour && hour <= awayTeam.preferences.preferredEndHour) {
    score += 2;
  } else {
    // Penalty for being outside preferred hours
    score -= Math.min(
      Math.abs(hour - awayTeam.preferences.preferredStartHour),
      Math.abs(hour - awayTeam.preferences.preferredEndHour)
    );
  }

  return score;
}

export function scheduleMatches(
  matches: Match[],
  teams: Team[],
  locations: Location[],
  startDateTime: Date,
  endDateTime: Date,
  matchDurationMs: number
): SchedulingResult {
  const violations: SchedulingResult["violations"] = [];
  const schedule = new Map<string, TimeSlot>();
  const usedSlots = new Set<string>(); // Format: "locationId-timestamp"

  // Generate all possible time slots
  const allTimeSlots = new Map<string, TimeSlot[]>();

  matches.forEach((match) => {
    const homeTeam = teams.find((t) => t.id === match.homeTeamId)!;
    const awayTeam = teams.find((t) => t.id === match.awayTeamId)!;
    const matchSlots: TimeSlot[] = [];

    let currentTime = new Date(startDateTime);
    while (currentTime <= endDateTime) {
      locations.forEach((location) => {
        const slot = {
          time: new Date(currentTime),
          locationId: location.id,
          score: 0,
        };

        slot.score = calculateSlotScore(slot, homeTeam, awayTeam);
        matchSlots.push(slot);
      });
      currentTime = new Date(currentTime.getTime() + matchDurationMs);
    }

    allTimeSlots.set(match.id, matchSlots);
  });

  // Sort matches by difficulty (fewer high-scoring slots = harder to schedule)
  const sortedMatches = [...matches].sort((a, b) => {
    const aSlots = allTimeSlots.get(a.id)!;
    const bSlots = allTimeSlots.get(b.id)!;
    const aGoodSlots = aSlots.filter((slot) => slot.score > 0).length;
    const bGoodSlots = bSlots.filter((slot) => slot.score > 0).length;
    return aGoodSlots - bGoodSlots;
  });

  // Schedule matches
  for (const match of sortedMatches) {
    const matchSlots = allTimeSlots
      .get(match.id)!
      .filter((slot) => !usedSlots.has(`${slot.locationId}-${slot.time.getTime()}`))
      .sort((a, b) => b.score - a.score);

    if (matchSlots.length === 0) {
      // No available slots with good scores, try relaxed constraints
      const relaxedSlots = allTimeSlots
        .get(match.id)!
        .filter((slot) => !usedSlots.has(`${slot.locationId}-${slot.time.getTime()}`))
        .sort((a, b) => b.score - a.score);

      if (relaxedSlots.length === 0) {
        return {
          success: false,
          schedule: new Map(),
          violations: [],
        };
      }

      const slot = relaxedSlots[0];
      schedule.set(match.id, slot);
      usedSlots.add(`${slot.locationId}-${slot.time.getTime()}`);

      // Record violations
      const homeTeam = teams.find((t) => t.id === match.homeTeamId)!;
      const awayTeam = teams.find((t) => t.id === match.awayTeamId)!;

      if (!homeTeam.preferences.preferredLocationIds.includes(slot.locationId)) {
        violations.push({
          matchId: match.id,
          teamId: homeTeam.id,
          type: "location",
        });
      }
      if (!awayTeam.preferences.preferredLocationIds.includes(slot.locationId)) {
        violations.push({
          matchId: match.id,
          teamId: awayTeam.id,
          type: "location",
        });
      }

      const hour = slot.time.getHours();
      if (hour < homeTeam.preferences.preferredStartHour || hour > homeTeam.preferences.preferredEndHour) {
        violations.push({
          matchId: match.id,
          teamId: homeTeam.id,
          type: "time",
        });
      }
      if (hour < awayTeam.preferences.preferredStartHour || hour > awayTeam.preferences.preferredEndHour) {
        violations.push({
          matchId: match.id,
          teamId: awayTeam.id,
          type: "time",
        });
      }
    } else {
      const slot = matchSlots[0];
      schedule.set(match.id, slot);
      usedSlots.add(`${slot.locationId}-${slot.time.getTime()}`);
    }
  }

  return {
    success: true,
    schedule,
    violations,
  };
}
