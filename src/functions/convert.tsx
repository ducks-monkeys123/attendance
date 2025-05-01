import { Gathering } from "../types/enums";
import { GatheringTimes } from "../types/types";
import { isWithinTimeWindow } from "./date-time";
import { useGlobal } from "./global-context";

export function convertToGatheringTimes(data: any, setDefaultGathering: any): GatheringTimes[] {
  const result: GatheringTimes[] = [];
  const currentGatherings: GatheringTimes[] = [];

  const typedData = data as Record<string, Record<string, Array<number | null>>>;

  Object.entries(typedData).forEach(([key, days]) => {
    const gatheringType = Gathering[key as keyof typeof Gathering];

    Object.entries(days).forEach(([dayStr, times]) => {
      const day = parseInt(dayStr, 10);
      times.forEach((time) => {
        if (time !== null) {
          const current = isWithinTimeWindow(day, time);
          result.push({ type: gatheringType, day, time, current });
          if (current) {
            currentGatherings.push({ type: gatheringType, day, time, current });
          }
        }
      });
    });
  });

  setDefaultGathering(currentGatherings);

  return result;
}
