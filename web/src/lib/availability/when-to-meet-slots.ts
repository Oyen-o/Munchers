export const WHEN_TO_MEET_SLOTS = [
  'mon_morning',
  'mon_afternoon',
  'mon_evening',
  'tue_morning',
  'tue_afternoon',
  'tue_evening',
  'wed_morning',
  'wed_afternoon',
  'wed_evening',
  'thu_morning',
  'thu_afternoon',
  'thu_evening',
  'fri_morning',
  'fri_afternoon',
  'fri_evening',
  'sat_morning',
  'sat_afternoon',
  'sat_evening',
  'sun_morning',
  'sun_afternoon',
  'sun_evening',
] as const;

export type WhenToMeetSlot = (typeof WHEN_TO_MEET_SLOTS)[number];

export const WHEN_TO_MEET_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export const WHEN_TO_MEET_DEFAULT_DAYS = [
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export const WHEN_TO_MEET_WEEKEND_DAYS = ['Friday', 'Saturday', 'Sunday'] as const;
export type WhenToMeetDay = (typeof WHEN_TO_MEET_DAYS)[number];
export const WHEN_TO_MEET_PERIODS = ['Morning', 'Afternoon', 'Evening'] as const;

export const WHEN_TO_MEET_GRID: Record<
  WhenToMeetDay,
  readonly WhenToMeetSlot[]
> = {
  Monday: ['mon_morning', 'mon_afternoon', 'mon_evening'],
  Tuesday: ['tue_morning', 'tue_afternoon', 'tue_evening'],
  Wednesday: ['wed_morning', 'wed_afternoon', 'wed_evening'],
  Thursday: ['thu_morning', 'thu_afternoon', 'thu_evening'],
  Friday: ['fri_morning', 'fri_afternoon', 'fri_evening'],
  Saturday: ['sat_morning', 'sat_afternoon', 'sat_evening'],
  Sunday: ['sun_morning', 'sun_afternoon', 'sun_evening'],
};

export const WHEN_TO_MEET_SLOT_LABELS: Record<WhenToMeetSlot, string> = {
  mon_morning: 'Monday Morning',
  mon_afternoon: 'Monday Afternoon',
  mon_evening: 'Monday Evening',
  tue_morning: 'Tuesday Morning',
  tue_afternoon: 'Tuesday Afternoon',
  tue_evening: 'Tuesday Evening',
  wed_morning: 'Wednesday Morning',
  wed_afternoon: 'Wednesday Afternoon',
  wed_evening: 'Wednesday Evening',
  thu_morning: 'Thursday Morning',
  thu_afternoon: 'Thursday Afternoon',
  thu_evening: 'Thursday Evening',
  fri_morning: 'Friday Morning',
  fri_afternoon: 'Friday Afternoon',
  fri_evening: 'Friday Evening',
  sat_morning: 'Saturday Morning',
  sat_afternoon: 'Saturday Afternoon',
  sat_evening: 'Saturday Evening',
  sun_morning: 'Sunday Morning',
  sun_afternoon: 'Sunday Afternoon',
  sun_evening: 'Sunday Evening',
};

export function isWhenToMeetSlot(value: string): value is WhenToMeetSlot {
  return WHEN_TO_MEET_SLOTS.includes(value as WhenToMeetSlot);
}

export function isWhenToMeetDay(value: string): value is WhenToMeetDay {
  return WHEN_TO_MEET_DAYS.includes(value as WhenToMeetDay);
}

export function isWhenToMeetWeekendDay(day: WhenToMeetDay): boolean {
  return WHEN_TO_MEET_WEEKEND_DAYS.includes(
    day as (typeof WHEN_TO_MEET_WEEKEND_DAYS)[number],
  );
}

export function toEmptyWhenToMeetCounts(): Record<WhenToMeetSlot, number> {
  return WHEN_TO_MEET_SLOTS.reduce(
    (acc, slot) => {
      acc[slot] = 0;
      return acc;
    },
    {} as Record<WhenToMeetSlot, number>,
  );
}
