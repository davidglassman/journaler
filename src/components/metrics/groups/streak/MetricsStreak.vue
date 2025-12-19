<template>
  <div
    class="flex h-auto w-full flex-row items-center justify-between rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
    <div class="flex flex-row items-center gap-2">
      <IconFire class="size-5 text-orange-500" />

      <p class="text-xl font-bold text-zinc-700 dark:text-zinc-300">
        {{ metrics?.streak.current ?? 0 }}
        <span class="text-sm font-medium text-zinc-400"> day streak </span>
      </p>
    </div>

    <div
      class="rounded-full bg-zinc-200/75 px-3 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-700/50 dark:text-zinc-300">
      Best
      <span class="font-bold text-zinc-700 dark:text-zinc-200">{{
        metrics?.streak.longest ?? 0
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Metrics } from "@shared/types/metrics";
import IconFire from "~icons/mdi/fire";

// ------------------------ Props

defineProps<{
  metrics: Metrics | null;
}>();
</script>

<style scoped></style>
