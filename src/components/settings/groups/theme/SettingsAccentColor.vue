<template>
  <div class="flex flex-row gap-1.5">
    <button
      v-for="color in accentColors"
      :key="color.name"
      class="h-4 w-5 cursor-pointer rounded transition-all"
      :class="[
        color.bgClass,
        settingsStore.accentColor === color.name
          ? 'ring-2 ring-zinc-700 ring-offset-1 dark:ring-zinc-300 dark:ring-offset-zinc-900'
          : 'hover:scale-110'
      ]"
      :aria-label="`Select ${color.name} accent color`"
      @click="handleClick(color.name)" />
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store/settings-store";
import type { AccentColor } from "@shared/types/accent-color";

// ------------------------ Interfaces

interface AccentColorItem {
  name: AccentColor;
  bgClass: string;
}

// ------------------------ Variables

const settingsStore = useSettingsStore();

const accentColors: AccentColorItem[] = [
  { name: "green", bgClass: "bg-green-500" },
  { name: "blue", bgClass: "bg-blue-500" },
  { name: "purple", bgClass: "bg-purple-500" },
  { name: "red", bgClass: "bg-red-500" },
  { name: "orange", bgClass: "bg-orange-500" },
  { name: "yellow", bgClass: "bg-yellow-500" }
];

// ------------------------ Handlers

const handleClick = (value: AccentColor) => {
  settingsStore.setAccentColor(value);
};
</script>

<style scoped></style>
