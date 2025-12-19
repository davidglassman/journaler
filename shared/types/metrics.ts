import type { JournalEntry } from "@shared/types/journal-entry";

export interface Streak {
  current: number;
  longest: number;
}

export interface TotalEntries {
  all: number;
  year: number;
  month: number;
  week: number;
}

export interface WordsWritten {
  all: number;
  year: number;
  month: number;
  week: number;
  day: number;
}

export interface Comparison {
  year: number;
  month: number;
  week: number;
}

export interface Metrics {
  streak: Streak;
  totalEntries: TotalEntries;
  wordsWritten: WordsWritten;
  averageEntry: number;
  writingFrequency: number;
  mostProductiveDay: number;
  comparison: Comparison;
  firstEntry: JournalEntry | null;
  daysSinceLastEntry: number;
}
