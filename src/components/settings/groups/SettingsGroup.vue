<template>
  <div
    class="flex h-auto w-full flex-shrink-0 flex-col items-start justify-start border-b-1 border-zinc-200 pb-4 text-zinc-500 last-of-type:border-none last-of-type:pb-0 dark:border-zinc-800 dark:text-zinc-300">
    <h2 class="mb-2 text-sm font-bold">{{ name }}</h2>

    <div class="flex w-full flex-col gap-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// ------------------------ Props

defineProps<{
  name: string;
}>();
</script>

<style scoped></style>
