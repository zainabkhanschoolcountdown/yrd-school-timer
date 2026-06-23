/**
 * School Days Calculator for YRDSB (York Region District School Board)
 *
 * How it works:
 * 1. We define a school year range (Sept 1 to June 30 by default).
 * 2. We preload known YRDSB holidays and PA days for the current school year.
 * 3. To count remaining school days, we iterate from today to the last day,
 *    skipping weekends (Saturday=6, Sunday=0) and any dates in the holidays set.
 * 4. Users can add/remove custom non-school days which get merged into the set.
 */

export interface SchoolYear {
  startDate: Date;
  endDate: Date;
}

export interface HolidayEntry {
  date: string; // YYYY-MM-DD
  name: string;
  isCustom?: boolean;
}

/**
 * Returns the current school year range.
 * If we're between Sept-Dec, end year is next year.
 * If Jan-Aug, end year is current year.
 */
export function getCurrentSchoolYear(): SchoolYear {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  if (month >= 8) {
    // Sept (8) through Dec (11): school year is year -> year+1
    return {
      startDate: new Date(year, 8, 1),   // Sept 1
      endDate: getElementaryLastDay(year + 1),
    };
  }
  // Jan through Aug: school year started last year
  return {
    startDate: new Date(year - 1, 8, 1),
    endDate: getElementaryLastDay(year),
  };
}

/** Known YRDSB elementary last-day-of-classes dates. */
function getElementaryLastDay(endYear: number): Date {
  // Hardcoded official YRDSB last days. Add new years as they're announced.
  const known: Record<number, [number, number]> = {
    2026: [5, 25], // June 25, 2026 (early-release half day)
  };
  const k = known[endYear];
  if (k) return new Date(endYear, k[0], k[1]);
  // Fallback: last Friday of June
  const d = new Date(endYear, 5, 30);
  while (d.getDay() !== 5) d.setDate(d.getDate() - 1);
  return d;
}

/**
 * Preloaded YRDSB holidays and PA days.
 * These are typical dates; actual dates may vary year to year.
 */
export function getDefaultHolidays(schoolYear: SchoolYear): HolidayEntry[] {
  const endYear = schoolYear.endDate.getFullYear();

  // Official YRDSB 2025-2026 Elementary calendar.
  if (endYear === 2026) {
    return [
      { date: "2025-09-01", name: "Labour Day" },
      { date: "2025-10-13", name: "Thanksgiving Day" },
      ...generateDateRange("2025-12-22", "2026-01-02").map(d => ({ date: d, name: "Winter Break" })),
      { date: "2026-02-16", name: "Family Day" },
      ...generateDateRange("2026-03-16", "2026-03-20").map(d => ({ date: d, name: "March Break" })),
      { date: "2026-04-03", name: "Good Friday" },
      { date: "2026-04-06", name: "Easter Monday" },
      { date: "2026-05-18", name: "Victoria Day" },
    ];
  }

  // Generic fallback for other years.
  const startYear = schoolYear.startDate.getFullYear();
  return [
    { date: `${startYear}-10-14`, name: "Thanksgiving Day" },
    ...generateDateRange(`${startYear}-12-23`, `${endYear}-01-03`).map(d => ({ date: d, name: "Winter Break" })),
    { date: `${endYear}-02-17`, name: "Family Day" },
    ...generateDateRange(`${endYear}-03-10`, `${endYear}-03-14`).map(d => ({ date: d, name: "March Break" })),
    { date: `${endYear}-04-18`, name: "Good Friday" },
    { date: `${endYear}-04-21`, name: "Easter Monday" },
    { date: `${endYear}-05-19`, name: "Victoria Day" },
  ];
}

/**
 * Set of dates that are early-release / half days.
 * Counted as 0.5 instead of a full school day.
 */
export function getDefaultHalfDays(schoolYear: SchoolYear): Set<string> {
  const endYear = schoolYear.endDate.getFullYear();
  if (endYear === 2026) {
    return new Set(["2026-06-25"]); // Elementary last day, early release
  }
  return new Set();
}

/** Generate an array of date strings between start and end (inclusive). */
function generateDateRange(startStr: string, endStr: string): string[] {
  const dates: string[] = [];
  const current = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Format a Date to YYYY-MM-DD string. */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Check if a date is a weekend (Saturday=6, Sunday=0). */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Count school days remaining from today (exclusive) to endDate (inclusive).
 * A school day is any weekday not in the holidays set.
 */
export function countSchoolDaysRemaining(
  endDate: Date,
  holidayDates: Set<string>,
  halfDays: Set<string> = new Set(),
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If today is a school day, we count it
  let count = 0;
  const current = new Date(today);

  while (current <= endDate) {
    const key = formatDate(current);
    if (!isWeekend(current) && !holidayDates.has(key)) {
      count += halfDays.has(key) ? 0.5 : 1;
    }
    current.setDate(current.getDate() + 1);
  }
  // Round to nearest 0.5 to avoid floating-point dust
  return Math.round(count * 2) / 2;
}

/**
 * Count total school days in the school year.
 */
export function countTotalSchoolDays(
  startDate: Date,
  endDate: Date,
  holidayDates: Set<string>,
  halfDays: Set<string> = new Set(),
): number {
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const key = formatDate(current);
    if (!isWeekend(current) && !holidayDates.has(key)) {
      count += halfDays.has(key) ? 0.5 : 1;
    }
    current.setDate(current.getDate() + 1);
  }
  return Math.round(count * 2) / 2;
}

/**
 * Get the day type for calendar rendering.
 */
export type DayType = "school" | "weekend" | "holiday" | "past-school" | "today";

export function getDayType(
  date: Date,
  holidayDates: Set<string>,
  startDate?: Date,
  endDate?: Date,
): DayType {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) return "today";
  if ((startDate && d < startDate) || (endDate && d > endDate)) {
    return "holiday";
  }
  if (isWeekend(d)) return "weekend";
  if (holidayDates.has(formatDate(d))) return "holiday";
  if (d < today) return "past-school";
  return "school";
}