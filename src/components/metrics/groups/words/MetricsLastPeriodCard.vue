<template>
  <div
    class="flex h-auto w-full flex-col items-center justify-center rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
    <p
      class="text-lg font-bold"
      :class="styles.count">
      {{ count }}
    </p>
    <p
      class="text-[10px] font-medium"
      :class="styles.title">
      {{ title }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// ------------------------ Props

const props = defineProps<{
  title: string;
  count: number;
}>();

// ------------------------ Computed

const styles = computed(() => {
  const variant = props.count === 0 ? "neutral" : props.count > 0 ? "positive" : "negative";

  const variants = {
    neutral: {
      count: "text-zinc-700",
      title: "text-zinc-400"
    },
    positive: {
      count: "text-green-700",
      title: "text-green-700/50 dark:text-green-700"
    },
    negative: {
      count: "text-red-700",
      title: "text-red-700/50 dark:text-red-700"
    }
  };

  return variants[variant];
});
</script>

<style scoped></style>
