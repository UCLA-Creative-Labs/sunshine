export interface QuarterRange {
  start: Date;
  end: Date;
}

/**
 * Quarter Schedule:
 * Fall: Sep 1 – Dec 1 (Label: Fall 'YY)
 * Winter: Dec 2 – Mar 20 (Label: Winter 'YY - year it ends)
 * Spring: Mar 21 – June 20 (Label: Spring 'YY)
 * Summer: June 21 – Aug 31 (Label: Summer 'YY)
 */

export function getCurrentQuarter(): string {
  return getQuarterFromDate(new Date());
}

export function getQuarterFromDate(date: Date): string {
  const month = date.getMonth(); // 0-indexed (0 = Jan, 8 = Sep)
  const day = date.getDate();
  const year = date.getFullYear();
  const shortYear = year.toString().slice(-2);

  // Fall: Sep 1 - Dec 1
  if ((month === 8 && day >= 1) || (month > 8 && month < 11) || (month === 11 && day === 1)) {
    return `Fall '${shortYear}`;
  }

  // Winter: Dec 2 - Mar 20
  // If Dec 2 - Dec 31, label is next year. If Jan 1 - Mar 20, label is current year.
  if ((month === 11 && day >= 2) || (month >= 0 && month < 2) || (month === 2 && day <= 20)) {
    const labelYear = month === 11 ? (year + 1).toString().slice(-2) : shortYear;
    return `Winter '${labelYear}`;
  }

  // Spring: Mar 21 - June 20
  if ((month === 2 && day >= 21) || (month > 2 && month < 5) || (month === 5 && day <= 20)) {
    return `Spring '${shortYear}`;
  }

  // Summer: June 21 - Aug 31
  if ((month === 5 && day >= 21) || (month > 5 && month < 8) || (month === 8 && day === 0)) {
    // Note: month 8 day 0 is end of Aug. Better:
    return `Summer '${shortYear}`;
  }

  return `Summer '${shortYear}`; // Fallback
}

export function getAllQuarters(startDateStr: string = "2026-03-21"): string[] {
  const start = new Date(startDateStr);
  const end = new Date();
  const quarters = new Set<string>();
  
  const currentDate = new Date(start);
  while (currentDate <= end) {
    quarters.add(getQuarterFromDate(currentDate));
    // Move forward by 1 month at a time to catch all transitions
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Also ensure the absolute current one is included
  quarters.add(getCurrentQuarter());

  return Array.from(quarters);
}

export function getQuarterDateRange(quarterString: string): QuarterRange {
  const [season, yearPart] = quarterString.split(" '");
  const year = 2000 + parseInt(yearPart);

  switch (season) {
    case "Fall":
      return { start: new Date(year, 8, 1), end: new Date(year, 11, 1, 23, 59, 59) };
    case "Winter":
      // Winter '26 starts in Dec '25
      return { start: new Date(year - 1, 11, 2), end: new Date(year, 2, 20, 23, 59, 59) };
    case "Spring":
      return { start: new Date(year, 2, 21), end: new Date(year, 5, 20, 23, 59, 59) };
    case "Summer":
      return { start: new Date(year, 5, 21), end: new Date(year, 8, 31, 23, 59, 59) };
    default:
      throw new Error(`Invalid quarter: ${quarterString}`);
  }
}

export function isCurrentQuarter(quarterString: string): boolean {
  return getCurrentQuarter() === quarterString;
}
