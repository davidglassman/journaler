<template>
  <div
    class="flex h-auto w-full flex-row items-center justify-between text-zinc-700 dark:text-zinc-300">
    <p class="text-sm font-medium text-zinc-400">{{ title }}</p>
    <p
      class="text-sm font-bold"
      :class="{ 'text-green-700 dark:text-green-700': isAverage }">
      {{ count }}
    </p>
  </div>
</template>

<script setup lang="ts">
// ------------------------ Props

defineProps<{
  title: string;
  count: number;
  isAverage?: boolean;
}>();
</script>

<style scoped></style>
