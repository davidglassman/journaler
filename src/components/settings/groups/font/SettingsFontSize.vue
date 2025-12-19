<template>
  <div class="flex h-auto w-3/4 flex-row items-center justify-between gap-3">
    <!-- Slider -->
    <Slider
      v-model="modelValue"
      :min="4"
      :max="72"
      :step="1" />

    <!-- Value Text -->
    <p class="w-12 text-sm text-gray-500 dark:text-zinc-300/80">{{ modelValue[0] }}</p>
  </div>
</template>

<script setup lang="ts">
import Slider from "@/components/ui/slider/Slider.vue";
import { useSettingsStore } from "@/store/settings-store";
import { computed } from "vue";

// ------------------------ Variables

const settingsStore = useSettingsStore();

// ------------------------ Computed

// Data stored as single number but slider expects an array
const modelValue = computed({
  get: () => [settingsStore.fontSize],
  set: (value) => settingsStore.setFontSize(value[0] as number)
});
</script>

<style scoped></style>
