<template>
  <div class="flex w-full flex-row items-center justify-between">
    <Button
      size="icon-sm"
      aria-label="Previous Entry"
      variant="outline"
      @click="handlePreviousPress">
      <IconChevronLeft class="size-6 cursor-pointer text-zinc-500 dark:text-zinc-400" />
    </Button>

    <div class="flex size-full flex-col items-center justify-center">
      <p class="text-center text-xs text-zinc-500 dark:text-zinc-400">Now Editing</p>

      <p
        v-if="journalStore.current?.date"
        class="text-center text-sm font-semibold text-zinc-600 dark:text-zinc-300">
        {{ formattedDate }}
      </p>
    </div>

    <Button
      size="icon-sm"
      aria-label="Next Entry"
      variant="outline"
      :disabled="isCurrentEntryToday"
      @click="handleNextPress">
      <IconChevronRight class="size-6 cursor-pointer text-zinc-500 dark:text-zinc-400" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/store/journal-store";
import { isToday } from "@shared/utils/date-utils";
import { computed } from "vue";
import IconChevronLeft from "~icons/mdi/chevron-left";
import IconChevronRight from "~icons/mdi/chevron-right";

// ------------------------ Variables

const journalStore = useJournalStore();

const formattedDate = computed(() => {
  return journalStore.current?.date.toDateString();
});

const isCurrentEntryToday = computed(() => {
  return journalStore.current?.date ? isToday(journalStore.current.date) : false;
});

const handlePreviousPress = () => {
  journalStore.getPreviousEntry();
};

const handleNextPress = () => {
  journalStore.getNextEntry();
};
</script>

<style scoped></style>
