import type { JournalEntry } from "@shared/types/journal-entry";

const getNonEmptyEntries = (entries: JournalEntry[]): JournalEntry[] => {
  return entries.filter((entry) => entry.content !== "");
};

const getWordCount = (content: string): number => {
  if (!content || content.trim() === "") return 0;

  return content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getDaysDifference = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = Math.abs(d2.getTime() - d1.getTime());

  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust so Monday is 0, Sunday is 6
  const diff = d.getDate() - ((day + 6) % 7);

  d.setDate(diff);
  d.setHours(0, 0, 0, 0);

  return d;
};

const filterEntriesByPeriod = (
  entries: JournalEntry[],
  periodStart: Date,
  periodEnd: Date
): JournalEntry[] => {
  return getNonEmptyEntries(entries).filter((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    return entryDate >= periodStart && entryDate <= periodEnd;
  });
};

// consecutive days written
export const getCurrentStreak = (entries: JournalEntry[]): number => {
  const nonEmpty = getNonEmptyEntries(entries);
  if (nonEmpty.length === 0) return 0;

  // Sort by date descending (most recent first)
  const sorted = [...nonEmpty].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstEntry = sorted[0];
  if (!firstEntry) return 0;

  const mostRecent = new Date(firstEntry.date);
  mostRecent.setHours(0, 0, 0, 0);

  // If most recent entry is not today or yesterday, streak is 0
  const daysSinceMostRecent = getDaysDifference(today, mostRecent);
  if (daysSinceMostRecent > 1) return 0;

  let streak = 1;
  let currentDate = mostRecent;

  for (let i = 1; i < sorted.length; i++) {
    const entry = sorted[i];
    if (!entry) continue;

    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    const diff = getDaysDifference(currentDate, entryDate);

    if (diff === 1) {
      streak++;
      currentDate = entryDate;
    } else if (diff === 0) {
      // Same day, skip
      continue;
    } else {
      // Gap in streak
      break;
    }
  }

  return streak;
};

// best run of consecutive days written
export const getLongestStreak = (entries: JournalEntry[]): number => {
  const nonEmpty = getNonEmptyEntries(entries);
  if (nonEmpty.length === 0) return 0;

  // Sort by date ascending
  const sorted = [...nonEmpty].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get unique dates only
  const uniqueDates: Date[] = [];

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    const lastDate = uniqueDates[uniqueDates.length - 1];
    if (uniqueDates.length === 0 || (lastDate && !isSameDay(lastDate, entryDate))) {
      uniqueDates.push(entryDate);
    }
  }

  if (uniqueDates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = uniqueDates[i - 1];
    const currDate = uniqueDates[i];
    if (!prevDate || !currDate) continue;

    const diff = getDaysDifference(prevDate, currDate);

    if (diff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

// total entries (lifetime)
export const getTotalEntries = (entries: JournalEntry[]): number => {
  return getNonEmptyEntries(entries).length;
};

// total entries (current year)
export const getTotalEntriesYear = (entries: JournalEntry[]): number => {
  const now = new Date();

  const yearStart = new Date(now.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);

  const yearEnd = new Date(now.getFullYear(), 11, 31);
  yearEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, yearStart, yearEnd).length;
};

// total entries (current month)
export const getTotalEntriesMonth = (entries: JournalEntry[]): number => {
  const now = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, monthStart, monthEnd).length;
};

// total entries (current week)
export const getTotalEntriesWeek = (entries: JournalEntry[]): number => {
  const now = new Date();

  const weekStart = getStartOfWeek(now);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, weekStart, weekEnd).length;
};

// total words written (lifetime)
export const getTotalWordsWritten = (entries: JournalEntry[]): number => {
  return getNonEmptyEntries(entries).reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
};

// total words written (current year)
export const getTotalWordsWrittenYear = (entries: JournalEntry[]): number => {
  const now = new Date();

  const yearStart = new Date(now.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);

  const yearEnd = new Date(now.getFullYear(), 11, 31);
  yearEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, yearStart, yearEnd).reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
};

// total words written (current month)
export const getTotalWordsWrittenMonth = (entries: JournalEntry[]): number => {
  const now = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, monthStart, monthEnd).reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
};

// total words written (current week)
export const getTotalWordsWrittenWeek = (entries: JournalEntry[]): number => {
  const now = new Date();

  const weekStart = getStartOfWeek(now);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, weekStart, weekEnd).reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
};

// total words written (current day)
export const getTotalWordsWrittenDay = (entries: JournalEntry[]): number => {
  const now = new Date();

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  return filterEntriesByPeriod(entries, dayStart, dayEnd).reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
};

// average words per entry
export const getAverageEntryLength = (entries: JournalEntry[]): number => {
  const nonEmpty = getNonEmptyEntries(entries);

  if (nonEmpty.length === 0) return 0;

  const totalWords = nonEmpty.reduce((total, entry) => total + getWordCount(entry.content), 0);

  return Math.round(totalWords / nonEmpty.length);
};

// percentage of days written (X out of last X days)
export const getWritingFrequency = (entries: JournalEntry[], days: number): number => {
  if (days <= 0) return 0;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days + 1);

  const entriesInPeriod = filterEntriesByPeriod(entries, startDate, now);

  // Get unique days with entries
  const uniqueDays = new Set<string>();

  for (const entry of entriesInPeriod) {
    const d = new Date(entry.date);

    uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  return Math.round((uniqueDays.size / days) * 100);
};

// which day write most often (returns 0-6, Sunday-Saturday, or -1 if no entries)
export const getMostProductiveDayOfWeek = (entries: JournalEntry[]): number => {
  const nonEmpty = getNonEmptyEntries(entries);
  if (nonEmpty.length === 0) return -1;

  const dayCounts: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

  for (const entry of nonEmpty) {
    const dayOfWeek = new Date(entry.date).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    dayCounts[dayOfWeek]++;
  }

  let maxCount = 0;
  let maxDay = 0;

  for (let i = 0; i < 7; i++) {
    const count = dayCounts[i as 0 | 1 | 2 | 3 | 4 | 5 | 6];
    if (count > maxCount) {
      maxCount = count;
      maxDay = i;
    }
  }

  return maxDay;
};

// which time of day write most often
// FUTURE: requires tracking timestamps
// export const getMostProductiveTimeOfDay = (_entries: JournalEntry[]): number => {
// 	return 0;
// }

// compare current year vs previous year (returns word difference: current - previous)
export const getYearOverYearComparison = (entries: JournalEntry[]): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  const currentYearStart = new Date(currentYear, 0, 1);
  currentYearStart.setHours(0, 0, 0, 0);

  const currentYearEnd = new Date(currentYear, 11, 31);
  currentYearEnd.setHours(23, 59, 59, 999);

  const previousYearStart = new Date(previousYear, 0, 1);
  previousYearStart.setHours(0, 0, 0, 0);

  const previousYearEnd = new Date(previousYear, 11, 31);
  previousYearEnd.setHours(23, 59, 59, 999);

  const currentEntries = filterEntriesByPeriod(entries, currentYearStart, currentYearEnd);
  const previousEntries = filterEntriesByPeriod(entries, previousYearStart, previousYearEnd);

  const currentWords = currentEntries.reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
  const previousWords = previousEntries.reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );

  return currentWords - previousWords;
};

// compare current month vs previous month (returns word difference: current - previous)
export const getMonthOverMonthComparison = (entries: JournalEntry[]): number => {
  const now = new Date();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  currentMonthEnd.setHours(23, 59, 59, 999);

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  previousMonthStart.setHours(0, 0, 0, 0);

  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  previousMonthEnd.setHours(23, 59, 59, 999);

  const currentEntries = filterEntriesByPeriod(entries, currentMonthStart, currentMonthEnd);
  const previousEntries = filterEntriesByPeriod(entries, previousMonthStart, previousMonthEnd);

  const currentWords = currentEntries.reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
  const previousWords = previousEntries.reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );

  return currentWords - previousWords;
};

// compare current week vs previous week (returns word difference: current - previous)
export const getWeekOverWeekComparison = (entries: JournalEntry[]): number => {
  const now = new Date();

  const currentWeekStart = getStartOfWeek(now);

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const previousWeekEnd = new Date(previousWeekStart);
  previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);
  previousWeekEnd.setHours(23, 59, 59, 999);

  const currentEntries = filterEntriesByPeriod(entries, currentWeekStart, currentWeekEnd);
  const previousEntries = filterEntriesByPeriod(entries, previousWeekStart, previousWeekEnd);

  const currentWords = currentEntries.reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );
  const previousWords = previousEntries.reduce(
    (total, entry) => total + getWordCount(entry.content),
    0
  );

  return currentWords - previousWords;
};

// how long been writing (returns earliest entry, or null if no entries)
export const getFirstEntryDate = (entries: JournalEntry[]): JournalEntry | null => {
  const nonEmpty = getNonEmptyEntries(entries);
  if (nonEmpty.length === 0) return null;

  return nonEmpty.reduce((earliest, entry) => {
    return new Date(entry.date) < new Date(earliest.date) ? entry : earliest;
  });
};

// how long since last write (returns -1 if no entries)
export const getDaysSinceLastEntry = (entries: JournalEntry[]): number => {
  const nonEmpty = getNonEmptyEntries(entries);
  if (nonEmpty.length === 0) return -1;

  const mostRecent = nonEmpty.reduce((latest, entry) => {
    return new Date(entry.date) > new Date(latest.date) ? entry : latest;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getDaysDifference(today, new Date(mostRecent.date));
};

// average length of writing session
// FUTURE: requires tracking timestamps
// export const getAverageSessionDuration = (_entries: JournalEntry[]): number => {
// 	return 0;
// }

// get list of favorite topics
// FUTURE: requires using tags or categories
// export const getFavoriteTopics = (_entries: JournalEntry[]): number => {
// 	return 0;
// }
