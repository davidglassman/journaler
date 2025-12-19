<template>
  <div class="size-full">
    <MainCalendar
      :entry-dates="entries"
      :current-date="currentDate"
      @date-selected="handleDateSelected" />
  </div>
</template>

<script setup lang="ts">
import MainCalendar from "@/components/calendar/MainCalendar.vue";
import { useJournalStore } from "@/store/journal-store";
import type { CalendarDate } from "@internationalized/date";
import { computed } from "vue";

// ------------------------ Variables

const journalStore = useJournalStore();

// ------------------------ Computed

const entries = computed(() => {
  return journalStore.allEntries.filter((entry) => entry.content !== "").map((entry) => entry.date);
});

const currentDate = computed(() => {
  return journalStore.current?.date ?? null;
});

// ------------------------ Functions

const handleDateSelected = async (date: CalendarDate) => {
  await journalStore.getEntry(new Date(date.year, date.month - 1, date.day));
  await journalStore.getAllEntries();
};
</script>

<style scoped></style>
