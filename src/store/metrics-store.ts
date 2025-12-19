import { useJournalStore } from "@/store/journal-store";
import { type Metrics } from "@shared/types/metrics";
import {
  getAverageEntryLength,
  getCurrentStreak,
  getDaysSinceLastEntry,
  getFirstEntryDate,
  getLongestStreak,
  getMonthOverMonthComparison,
  getMostProductiveDayOfWeek,
  getTotalEntries,
  getTotalEntriesMonth,
  getTotalEntriesWeek,
  getTotalEntriesYear,
  getTotalWordsWritten,
  getTotalWordsWrittenDay,
  getTotalWordsWrittenMonth,
  getTotalWordsWrittenWeek,
  getTotalWordsWrittenYear,
  getWeekOverWeekComparison,
  getWritingFrequency,
  getYearOverYearComparison
} from "@shared/utils/metrics-calculator";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMetricsStore = defineStore("metrics", () => {
  // ------------------------ Variables

  const metrics = ref<Metrics | null>(null);
  const isLoading = ref(false);

  // ------------------------ Functions

  const loadMetrics = () => {
    isLoading.value = true;

    const journalStore = useJournalStore();
    const entries = journalStore.allEntries;

    metrics.value = {
      streak: {
        current: getCurrentStreak(entries),
        longest: getLongestStreak(entries)
      },
      totalEntries: {
        all: getTotalEntries(entries),
        year: getTotalEntriesYear(entries),
        month: getTotalEntriesMonth(entries),
        week: getTotalEntriesWeek(entries)
      },
      wordsWritten: {
        all: getTotalWordsWritten(entries),
        year: getTotalWordsWrittenYear(entries),
        month: getTotalWordsWrittenMonth(entries),
        week: getTotalWordsWrittenWeek(entries),
        day: getTotalWordsWrittenDay(entries)
      },
      averageEntry: getAverageEntryLength(entries),
      writingFrequency: getWritingFrequency(entries, 30),
      mostProductiveDay: getMostProductiveDayOfWeek(entries),
      comparison: {
        year: getYearOverYearComparison(entries),
        month: getMonthOverMonthComparison(entries),
        week: getWeekOverWeekComparison(entries)
      },
      firstEntry: getFirstEntryDate(entries),
      daysSinceLastEntry: getDaysSinceLastEntry(entries)
    };

    isLoading.value = false;
  };

  const refreshMetrics = () => {
    loadMetrics();
  };

  const invalidateCache = () => {
    metrics.value = null;
  };

  // ------------------------ Return

  return {
    metrics,
    isLoading,
    loadMetrics,
    refreshMetrics,
    invalidateCache
  };
});
