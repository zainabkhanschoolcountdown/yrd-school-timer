export type SchoolBoard = {
  id: string;
  name: string;
  region: string; // Province or State
  country: "Canada" | "USA";
  // School year end date as month/day (last day of classes, approximate)
  endMonth: number; // 1-12
  endDay: number;
  // Optional first day of the next school year (month/day). When missing we
  // fall back to a country-typical first day (see firstDayForBoard).
  startMonth?: number; // 1-12
  startDay?: number;
};

// Canadian school boards (representative coverage across provinces).
// USA: large/major districts. End dates are approximate "last day of school".
export const SCHOOL_BOARDS: SchoolBoard[] = [
  // ===== Ontario =====
  { id: "yrdsb", name: "York Region District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "tdsb", name: "Toronto District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "tcdsb", name: "Toronto Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "pdsb", name: "Peel District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "dpcdsb", name: "Dufferin-Peel Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "hdsb", name: "Halton District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "hcdsb", name: "Halton Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ddsb", name: "Durham District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "dcdsb", name: "Durham Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ycdsb", name: "York Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ocdsb", name: "Ottawa-Carleton District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ocsb", name: "Ottawa Catholic School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "hwdsb", name: "Hamilton-Wentworth District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "wrdsb", name: "Waterloo Region District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "wcdsb", name: "Waterloo Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "tvdsb", name: "Thames Valley District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ugdsb", name: "Upper Grand District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "scdsb", name: "Simcoe County District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "smcdsb", name: "Simcoe Muskoka Catholic District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "kprdsb", name: "Kawartha Pine Ridge District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ldsb", name: "Limestone District School Board", region: "Ontario", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== Quebec =====
  { id: "emsb", name: "English Montreal School Board", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "lbpsb", name: "Lester B. Pearson School Board", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "swlsb", name: "Sir Wilfrid Laurier School Board", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "wqsb", name: "Western Quebec School Board", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "etsb", name: "Eastern Townships School Board", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "csdm", name: "Centre de services scolaire de Montréal", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "csmb", name: "Centre de services scolaire Marguerite-Bourgeoys", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },
  { id: "cssdpsc", name: "Centre de services scolaire de la Capitale", region: "Quebec", country: "Canada", endMonth: 6, endDay: 23 },

  // ===== British Columbia =====
  { id: "sd39", name: "Vancouver School District (SD39)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd36", name: "Surrey School District (SD36)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd41", name: "Burnaby School District (SD41)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd43", name: "Coquitlam School District (SD43)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd38", name: "Richmond School District (SD38)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd61", name: "Greater Victoria School District (SD61)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd40", name: "New Westminster School District (SD40)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd44", name: "North Vancouver School District (SD44)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd45", name: "West Vancouver School District (SD45)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd35", name: "Langley School District (SD35)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd34", name: "Abbotsford School District (SD34)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd73", name: "Kamloops-Thompson School District (SD73)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "sd23", name: "Central Okanagan School District (SD23)", region: "British Columbia", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== Alberta =====
  { id: "cbe", name: "Calgary Board of Education", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "cssd", name: "Calgary Catholic School District", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "epsb", name: "Edmonton Public Schools", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ecsd", name: "Edmonton Catholic School District", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "rdcrs", name: "Red Deer Catholic Regional Schools", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "rdpsd", name: "Red Deer Public School Division", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "rvsd", name: "Rocky View Schools", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "fmpsd", name: "Fort McMurray Public School Division", region: "Alberta", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== Manitoba =====
  { id: "wsd1", name: "Winnipeg School Division", region: "Manitoba", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "lrsd", name: "Louis Riel School Division", region: "Manitoba", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "psd", name: "Pembina Trails School Division", region: "Manitoba", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "sjasd", name: "St. James-Assiniboia School Division", region: "Manitoba", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "rrvsd", name: "Red River Valley School Division", region: "Manitoba", country: "Canada", endMonth: 6, endDay: 27 },

  // ===== Saskatchewan =====
  { id: "spsd", name: "Saskatoon Public Schools", region: "Saskatchewan", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "gsd", name: "Greater Saskatoon Catholic Schools", region: "Saskatchewan", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "rps", name: "Regina Public Schools", region: "Saskatchewan", country: "Canada", endMonth: 6, endDay: 27 },
  { id: "rcsd", name: "Regina Catholic Schools", region: "Saskatchewan", country: "Canada", endMonth: 6, endDay: 27 },

  // ===== Nova Scotia =====
  { id: "hrce", name: "Halifax Regional Centre for Education", region: "Nova Scotia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "ccrce", name: "Cape Breton-Victoria Regional Centre for Education", region: "Nova Scotia", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "avrce", name: "Annapolis Valley Regional Centre for Education", region: "Nova Scotia", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== New Brunswick =====
  { id: "asdn", name: "Anglophone North School District", region: "New Brunswick", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "asds", name: "Anglophone South School District", region: "New Brunswick", country: "Canada", endMonth: 6, endDay: 26 },
  { id: "asdw", name: "Anglophone West School District", region: "New Brunswick", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== Newfoundland & Labrador =====
  { id: "nlesd", name: "Newfoundland and Labrador English School District", region: "Newfoundland and Labrador", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== PEI =====
  { id: "psb", name: "Public Schools Branch (PEI)", region: "Prince Edward Island", country: "Canada", endMonth: 6, endDay: 26 },

  // ===== Territories =====
  { id: "yesab", name: "Yukon Department of Education", region: "Yukon", country: "Canada", endMonth: 6, endDay: 19 },
  { id: "nwt", name: "NWT Department of Education", region: "Northwest Territories", country: "Canada", endMonth: 6, endDay: 26 },

  // ============================== USA ==============================
  // ===== New York =====
  { id: "nycdoe", name: "New York City Department of Education", region: "New York", country: "USA", endMonth: 6, endDay: 26 },
  { id: "buffalo", name: "Buffalo Public Schools", region: "New York", country: "USA", endMonth: 6, endDay: 26 },
  { id: "rochester", name: "Rochester City School District", region: "New York", country: "USA", endMonth: 6, endDay: 26 },

  // ===== California =====
  { id: "lausd", name: "Los Angeles Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 12 },
  { id: "sdusd", name: "San Diego Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 12 },
  { id: "sfusd", name: "San Francisco Unified School District", region: "California", country: "USA", endMonth: 5, endDay: 29 },
  { id: "sausd", name: "Santa Ana Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 12 },
  { id: "lbusd", name: "Long Beach Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 19 },
  { id: "fusd", name: "Fresno Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 5 },
  { id: "ousd", name: "Oakland Unified School District", region: "California", country: "USA", endMonth: 5, endDay: 29 },
  { id: "sjusd", name: "San Jose Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 5 },
  { id: "sacusd", name: "Sacramento City Unified School District", region: "California", country: "USA", endMonth: 6, endDay: 12 },

  // ===== Texas =====
  { id: "houston-isd", name: "Houston Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "dallas-isd", name: "Dallas Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "austin-isd", name: "Austin Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "fortworth-isd", name: "Fort Worth Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "sanantonio-isd", name: "San Antonio Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "elpaso-isd", name: "El Paso Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "northside-isd", name: "Northside Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "katy-isd", name: "Katy Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },
  { id: "cyfair-isd", name: "Cypress-Fairbanks Independent School District", region: "Texas", country: "USA", endMonth: 5, endDay: 28 },

  // ===== Florida =====
  { id: "miami-dcps", name: "Miami-Dade County Public Schools", region: "Florida", country: "USA", endMonth: 6, endDay: 5 },
  { id: "broward", name: "Broward County Public Schools", region: "Florida", country: "USA", endMonth: 6, endDay: 5 },
  { id: "orange-fl", name: "Orange County Public Schools (FL)", region: "Florida", country: "USA", endMonth: 5, endDay: 29 },
  { id: "hillsborough", name: "Hillsborough County Public Schools", region: "Florida", country: "USA", endMonth: 5, endDay: 29 },
  { id: "palmbeach", name: "School District of Palm Beach County", region: "Florida", country: "USA", endMonth: 6, endDay: 5 },
  { id: "duval", name: "Duval County Public Schools", region: "Florida", country: "USA", endMonth: 5, endDay: 29 },

  // ===== Illinois =====
  { id: "cps", name: "Chicago Public Schools", region: "Illinois", country: "USA", endMonth: 6, endDay: 19 },

  // ===== Pennsylvania =====
  { id: "philly", name: "School District of Philadelphia", region: "Pennsylvania", country: "USA", endMonth: 6, endDay: 12 },
  { id: "pittsburgh", name: "Pittsburgh Public Schools", region: "Pennsylvania", country: "USA", endMonth: 6, endDay: 5 },

  // ===== Ohio =====
  { id: "columbus-cs", name: "Columbus City Schools", region: "Ohio", country: "USA", endMonth: 5, endDay: 29 },
  { id: "cleveland", name: "Cleveland Metropolitan School District", region: "Ohio", country: "USA", endMonth: 6, endDay: 5 },
  { id: "cincinnati", name: "Cincinnati Public Schools", region: "Ohio", country: "USA", endMonth: 5, endDay: 29 },

  // ===== Georgia =====
  { id: "atlanta", name: "Atlanta Public Schools", region: "Georgia", country: "USA", endMonth: 5, endDay: 22 },
  { id: "gwinnett", name: "Gwinnett County Public Schools", region: "Georgia", country: "USA", endMonth: 5, endDay: 22 },
  { id: "cobb", name: "Cobb County School District", region: "Georgia", country: "USA", endMonth: 5, endDay: 22 },

  // ===== North Carolina =====
  { id: "cms", name: "Charlotte-Mecklenburg Schools", region: "North Carolina", country: "USA", endMonth: 6, endDay: 12 },
  { id: "wcpss", name: "Wake County Public School System", region: "North Carolina", country: "USA", endMonth: 6, endDay: 12 },

  // ===== Washington =====
  { id: "sps", name: "Seattle Public Schools", region: "Washington", country: "USA", endMonth: 6, endDay: 19 },
  { id: "tacoma", name: "Tacoma Public Schools", region: "Washington", country: "USA", endMonth: 6, endDay: 19 },

  // ===== Massachusetts =====
  { id: "boston", name: "Boston Public Schools", region: "Massachusetts", country: "USA", endMonth: 6, endDay: 19 },

  // ===== Michigan =====
  { id: "dpscd", name: "Detroit Public Schools Community District", region: "Michigan", country: "USA", endMonth: 6, endDay: 12 },

  // ===== Nevada =====
  { id: "ccsd-nv", name: "Clark County School District", region: "Nevada", country: "USA", endMonth: 5, endDay: 22 },

  // ===== Arizona =====
  { id: "mpsaz", name: "Mesa Public Schools", region: "Arizona", country: "USA", endMonth: 5, endDay: 22 },
  { id: "phoenix-uhsd", name: "Phoenix Union High School District", region: "Arizona", country: "USA", endMonth: 5, endDay: 22 },

  // ===== Colorado =====
  { id: "dps", name: "Denver Public Schools", region: "Colorado", country: "USA", endMonth: 5, endDay: 29 },

  // ===== Maryland =====
  { id: "mcps", name: "Montgomery County Public Schools (MD)", region: "Maryland", country: "USA", endMonth: 6, endDay: 12 },
  { id: "bcps", name: "Baltimore County Public Schools", region: "Maryland", country: "USA", endMonth: 6, endDay: 12 },

  // ===== Virginia =====
  { id: "fcps-va", name: "Fairfax County Public Schools", region: "Virginia", country: "USA", endMonth: 6, endDay: 12 },

  // ===== DC =====
  { id: "dcps-dc", name: "DC Public Schools", region: "District of Columbia", country: "USA", endMonth: 6, endDay: 19 },
];

/** Compute the YYYY-MM-DD end date for a board in the currently-active school year. */
export function endDateForBoard(board: SchoolBoard, schoolYearEnd: Date): string {
  const year = schoolYearEnd.getFullYear();
  const mm = String(board.endMonth).padStart(2, "0");
  const dd = String(board.endDay).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** First Monday of a month (0-indexed month). */
function firstMonday(year: number, month: number): Date {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  return d;
}

/**
 * First day of school for a board in a given calendar year.
 * Boards can declare startMonth/startDay; otherwise we use the typical pattern:
 *  - Canada: the Tuesday after Labour Day (first Monday of September).
 *  - USA: the fourth Monday of August.
 */
export function firstDayForBoard(board: SchoolBoard | undefined, year: number): Date {
  if (board?.startMonth && board?.startDay) {
    return new Date(year, board.startMonth - 1, board.startDay);
  }
  if (board?.country === "USA") {
    const d = firstMonday(year, 7); // August
    d.setDate(d.getDate() + 21); // fourth Monday
    return d;
  }
  const labourDay = firstMonday(year, 8); // September
  const d = new Date(labourDay);
  d.setDate(d.getDate() + 1); // Tuesday after Labour Day
  return d;
}

/** Whole calendar days between two dates (b - a), ignoring time of day. */
export function daysBetween(a: Date, b: Date): number {
  const x = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const y = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((y - x) / 86400000);
}
