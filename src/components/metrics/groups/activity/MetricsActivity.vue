<template>
  <MetricsGroup name="Activity">
    <div class="flex w-full flex-col items-center justify-between gap-2">
      <MetricsActivityItem
        title="Days Since Last Entry"
        :value="metrics?.daysSinceLastEntry.toString() ?? '0'" />

      <MetricsActivityItem
        title="Most Active Day"
        :value="dayName" />

      <MetricsActivityItem
        title="Journaling Since"
        :value="firstEntryFormatted" />
    </div>
  </MetricsGroup>
</template>

<script setup lang="ts">
import MetricsActivityItem from "@/components/metrics/groups/activity/MetricsActivityItem.vue";
import MetricsGroup from "@/components/metrics/MetricsGroup.vue";
import type { Metrics } from "@shared/types/metrics";
import { computed } from "vue";

// ------------------------ Props

const props = defineProps<{
  metrics: Metrics | null;
}>();

// ------------------------ Variables

const dayNames: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

// ------------------------ Computed

const dayName = computed(() => {
  const day = props.metrics?.mostProductiveDay ?? -1;

  return dayNames[day] ?? "—";
});

const firstEntryFormatted = computed(() => {
  const entry = props.metrics?.firstEntry;
  if (!entry) return "—";

  const date = new Date(entry.date);

  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
});
</script>

<style scoped></style>
