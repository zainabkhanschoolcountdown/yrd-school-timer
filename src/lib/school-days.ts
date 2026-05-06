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
      endDate: new Date(year + 1, 5, 30), // June 30
    };
  }
  // Jan through Aug: school year started last year
  return {
    startDate: new Date(year - 1, 8, 1),
    endDate: new Date(year, 5, 30),
  };
}

/**
 * Preloaded YRDSB holidays and PA days.
 * These are typical dates; actual dates may vary year to year.
 */
export function getDefaultHolidays(schoolYear: SchoolYear): HolidayEntry[] {
  const endYear = schoolYear.endDate.getFullYear();
  const startYear = schoolYear.startDate.getFullYear();

  return [
    // Thanksgiving (2nd Monday of October)
    { date: `${startYear}-10-14`, name: "Thanksgiving Day" },
    // PA Days (sample)
    { date: `${startYear}-10-11`, name: "PA Day" },
    { date: `${startYear}-11-15`, name: "PA Day" },
    // Winter Break (Dec 23 - Jan 3 typical)
    ...generateDateRange(`${startYear}-12-23`, `${endYear}-01-03`).map(d => ({
      date: d, name: "Winter Break",
    })),
    // PA Day after winter break
    { date: `${endYear}-01-17`, name: "PA Day" },
    // Family Day (3rd Monday of February)
    { date: `${endYear}-02-17`, name: "Family Day" },
    // PA Day
    { date: `${endYear}-02-14`, name: "PA Day" },
    // March Break (3rd week of March typically)
    ...generateDateRange(`${endYear}-03-10`, `${endYear}-03-14`).map(d => ({
      date: d, name: "March Break",
    })),
    // Good Friday (approximate - varies)
    { date: `${endYear}-04-18`, name: "Good Friday" },
    // Easter Monday
    { date: `${endYear}-04-21`, name: "Easter Monday" },
    // Victoria Day (Monday before May 25)
    { date: `${endYear}-05-19`, name: "Victoria Day" },
    // PA Days in June
    { date: `${endYear}-06-06`, name: "PA Day" },
    { date: `${endYear}-06-27`, name: "PA Day" },
  ];
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
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If today is a school day, we count it
  let count = 0;
  const current = new Date(today);

  while (current <= endDate) {
    if (!isWeekend(current) && !holidayDates.has(formatDate(current))) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Count total school days in the school year.
 */
export function countTotalSchoolDays(
  startDate: Date,
  endDate: Date,
  holidayDates: Set<string>,
): number {
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    if (!isWeekend(current) && !holidayDates.has(formatDate(current))) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Get the day type for calendar rendering.
 */
export type DayType = "school" | "weekend" | "holiday" | "past-school" | "today";

export function getDayType(
  date: Date,
  holidayDates: Set<string>,
): DayType {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) return "today";
  if (isWeekend(d)) return "weekend";
  if (holidayDates.has(formatDate(d))) return "holiday";
  if (d < today) return "past-school";
  return "school";
}