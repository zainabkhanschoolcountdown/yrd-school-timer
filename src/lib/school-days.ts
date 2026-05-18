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
    { date: `${startYear}-${pad(nthWeekdayOfMonth(startYear, 9, 1, 2))}`, name: "Thanksgiving Day" },
    // Winter Break (Dec 22 - Jan 2 typical)
    ...generateDateRange(`${startYear}-12-22`, `${endYear}-01-02`).map(d => ({
      date: d, name: "Winter Break",
    })),
    // Family Day (3rd Monday of February)
    { date: `${endYear}-02-${pad(nthWeekdayOfMonth(endYear, 1, 1, 3))}`, name: "Family Day" },
    // March Break (Monday-Friday of the week containing the 3rd Monday of March in Ontario; YRDSB uses week after Family Day's pattern — 2nd full week)
    ...marchBreakRange(endYear).map(d => ({ date: d, name: "March Break" })),
    // Good Friday & Easter Monday (computed)
    { date: easterOffset(endYear, -2), name: "Good Friday" },
    { date: easterOffset(endYear, 1), name: "Easter Monday" },
    // Victoria Day (Monday on or before May 24)
    { date: `${endYear}-05-${pad(victoriaDay(endYear))}`, name: "Victoria Day" },
  ];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** month is 0-indexed; weekday 0=Sun..6=Sat; n = which occurrence (1-based). Returns day-of-month. */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): number {
  const first = new Date(year, month, 1);
  const offset = (7 + weekday - first.getDay()) % 7;
  return 1 + offset + (n - 1) * 7;
}

/** Victoria Day: Monday on or before May 24. */
function victoriaDay(year: number): number {
  const may24 = new Date(year, 4, 24);
  const dow = may24.getDay(); // 0=Sun..6=Sat
  const back = dow === 0 ? 6 : dow - 1; // days back to Monday
  return 24 - back;
}

/** Compute Easter Sunday (Gregorian) for given year, return Date. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function easterOffset(year: number, deltaDays: number): string {
  const d = easterSunday(year);
  d.setDate(d.getDate() + deltaDays);
  return formatDate(d);
}

/** March Break: Monday–Friday of the week starting on the 2nd Monday of March (YRDSB convention). */
function marchBreakRange(year: number): string[] {
  const monday = nthWeekdayOfMonth(year, 2, 1, 2);
  const start = `${year}-03-${pad(monday)}`;
  const end = `${year}-03-${pad(monday + 4)}`;
  return generateDateRange(start, end);
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