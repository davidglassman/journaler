<template>
  <div class="flex flex-row items-end justify-center gap-1">
    <p class="text-center text-base font-semibold text-zinc-600 dark:text-zinc-300">{{ name }}</p>
    <p class="mb-[2.5px] text-center text-xs text-zinc-500 dark:text-zinc-400">
      {{ `v${version}` }}
    </p>
  </div>
</template>

<script setup lang="ts">
const name = __APP_NAME__;
const version = __APP_VERSION__;
</script>

<style scoped></style>
