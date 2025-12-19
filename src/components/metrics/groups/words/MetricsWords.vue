<template>
  <MetricsGroup name="Words">
    <div
      class="flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div class="flex w-full flex-col items-center justify-between gap-2">
        <MetricsWordsWrittenItem
          title="Today"
          :count="metrics?.wordsWritten.day ?? 0" />

        <MetricsWordsWrittenItem
          title="This Week"
          :count="metrics?.wordsWritten.week ?? 0" />

        <MetricsWordsWrittenItem
          title="This Month"
          :count="metrics?.wordsWritten.month ?? 0" />

        <MetricsWordsWrittenItem
          title="This Year"
          :count="metrics?.wordsWritten.year ?? 0" />

        <MetricsWordsWrittenItem
          title="All-Time"
          :count="metrics?.wordsWritten.all ?? 0" />

        <MetricsWordsWrittenItem
          title="Average per Entry"
          :count="metrics?.averageEntry ?? 0"
          is-average />
      </div>

      <Separator />

      <div class="flex w-full flex-col items-start justify-between">
        <h2 class="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Vs. Last Period</h2>

        <div class="flex w-full flex-row items-center justify-between gap-2">
          <MetricsLastPeriodCard
            title="Week"
            :count="metrics?.comparison.week ?? 0" />

          <MetricsLastPeriodCard
            title="Month"
            :count="metrics?.comparison.month ?? 0" />

          <MetricsLastPeriodCard
            title="Year"
            :count="metrics?.comparison.year ?? 0" />
        </div>
      </div>
    </div>
  </MetricsGroup>
</template>

<script setup lang="ts">
import MetricsLastPeriodCard from "@/components/metrics/groups/words/MetricsLastPeriodCard.vue";
import MetricsWordsWrittenItem from "@/components/metrics/groups/words/MetricsWordsWrittenItem.vue";
import MetricsGroup from "@/components/metrics/MetricsGroup.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import type { Metrics } from "@shared/types/metrics";

// ------------------------ Props

defineProps<{
  metrics: Metrics | null;
}>();
</script>

<style scoped></style>
