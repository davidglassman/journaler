<template>
  <MetricsGroup name="Entries">
    <div class="flex w-full flex-row items-center justify-between gap-2">
      <MetricsEntryCard
        title="Week"
        :count="metrics?.totalEntries.week ?? 0" />

      <MetricsEntryCard
        title="Month"
        :count="metrics?.totalEntries.month ?? 0" />

      <MetricsEntryCard
        title="Year"
        :count="metrics?.totalEntries.year ?? 0" />

      <MetricsEntryCard
        title="All-Time"
        :count="metrics?.totalEntries.all ?? 0" />
    </div>
  </MetricsGroup>
</template>

<script setup lang="ts">
import MetricsEntryCard from "@/components/metrics/groups/entries/MetricsEntryCard.vue";
import MetricsGroup from "@/components/metrics/MetricsGroup.vue";
import type { Metrics } from "@shared/types/metrics";

// ------------------------ Props

defineProps<{
  metrics: Metrics | null;
}>();
</script>

<style scoped></style>
