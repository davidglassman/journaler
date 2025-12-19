<template>
  <ButtonGroup>
    <Button
      v-for="theme in themes"
      :key="theme.name"
      variant="outline"
      :class="
        settingsStore.theme === theme.name &&
        'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
      "
      size="icon"
      @click="handleClick(theme.name)">
      <component :is="theme.icon" />
    </Button>
  </ButtonGroup>
</template>

<script setup lang="ts">
import ButtonGroup from "@/components/ui/button-group/ButtonGroup.vue";
import Button from "@/components/ui/button/Button.vue";
import { useSettingsStore } from "@/store/settings-store";
import type { ThemeType } from "@shared/types/theme-type";
import { MonitorCog, Moon, Sun } from "lucide-vue-next";
import { type FunctionalComponent } from "vue";

// ------------------------ Interfaces

interface ThemeItem {
  name: ThemeType;
  icon: FunctionalComponent;
}

// ------------------------ Variables

const settingsStore = useSettingsStore();

const themes: ThemeItem[] = [
  {
    name: "light",
    icon: Sun
  },
  {
    name: "dark",
    icon: Moon
  },
  {
    name: "auto",
    icon: MonitorCog
  }
];

// ------------------------ Handlers

const handleClick = (value: ThemeType) => {
  // Update store directly - the watcher in useTheme will sync to mode
  settingsStore.setTheme(value);
};
</script>

<style scoped></style>
