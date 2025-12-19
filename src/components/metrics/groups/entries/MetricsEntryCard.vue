<template>
  <div
    class="flex h-auto w-full flex-col items-center justify-center rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
    <p class="text-lg font-bold text-zinc-700 dark:text-zinc-300">{{ count }}</p>
    <p class="dark: text-[10px] font-medium text-zinc-400">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
// ------------------------ Props

defineProps<{
  title: string;
  count: number;
}>();
</script>

<style scoped></style>
