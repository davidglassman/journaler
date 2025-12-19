<template>
  <div class="flex w-full flex-col items-start justify-start gap-6">
    <MetricsStreak :metrics="metrics" />
    <MetricsEntries :metrics="metrics" />
    <MetricsWords :metrics="metrics" />
    <MetricsActivity :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import MetricsActivity from "@/components/metrics/groups/activity/MetricsActivity.vue";
import MetricsEntries from "@/components/metrics/groups/entries/MetricsEntries.vue";
import MetricsStreak from "@/components/metrics/groups/streak/MetricsStreak.vue";
import MetricsWords from "@/components/metrics/groups/words/MetricsWords.vue";
import { useMetricsStore } from "@/store/metrics-store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const metricsStore = useMetricsStore();
const { metrics } = storeToRefs(metricsStore);

onMounted(() => {
  metricsStore.loadMetrics();
});
</script>
