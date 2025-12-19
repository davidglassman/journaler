<template>
  <div
    class="flex h-auto w-full flex-shrink-0 flex-col items-start justify-start text-zinc-500 dark:border-zinc-800 dark:text-zinc-300">
    <h2 class="mb-2 text-sm font-bold">{{ name }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
// ------------------------ Props

defineProps<{
  name: string;
}>();
</script>

<style scoped></style>
