<template>
  <div
    class="flex h-auto w-full flex-shrink-0 flex-col items-start justify-start text-zinc-500 dark:text-zinc-300/80">
    <h2 class="mb-1 text-sm font-normal">{{ name }}</h2>
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
