import { GatheringTimes } from "../types/types";

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // day 7 = Sunday (wraparound)

export function formatDayFromNumber(day: number): string {
  return dayNames[day] ?? `Day ${day}`;
}

export function formatTimeFrom24hour(time: number): string {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function isWithinTimeWindow(day: number, time: number): boolean {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const windowStart = currentMinutes - 60;
    const windowEnd = currentMinutes + 90;
  
    // Normalize day (e.g., 7 => 0 for Sunday)
    const gatheringDay = day % 7;
    if (gatheringDay !== currentDay) return false;
  
    const gatheringHour = Math.floor(time / 100);
    const gatheringMinute = time % 100;
    const gatheringMinutes = gatheringHour * 60 + gatheringMinute;
  
    return gatheringMinutes >= windowStart && gatheringMinutes <= windowEnd
  }