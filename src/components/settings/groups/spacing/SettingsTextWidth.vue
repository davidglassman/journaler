<template>
  <ButtonGroup>
    <Button
      v-for="width in widths"
      :key="width.size"
      variant="outline"
      :class="
        settingsStore.textWidth === width.size &&
        'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
      "
      size="icon"
      @click="handleClick(width.size)">
      <component :is="width.icon" />
    </Button>
  </ButtonGroup>
</template>

<script setup lang="ts">
import ButtonGroup from "@/components/ui/button-group/ButtonGroup.vue";
import Button from "@/components/ui/button/Button.vue";
import { useSettingsStore } from "@/store/settings-store";
import { Tally1, Tally2, Tally3, Tally4 } from "lucide-vue-next";
import { type FunctionalComponent } from "vue";

// ------------------------ Interfaces

interface WidthItem {
  size: number;
  icon: FunctionalComponent;
}

// ------------------------ Variables

const settingsStore = useSettingsStore();

const widths: WidthItem[] = [
  {
    size: 480,
    icon: Tally1
  },
  {
    size: 640,
    icon: Tally2
  },
  {
    size: 768,
    icon: Tally3
  },
  {
    size: 1024,
    icon: Tally4
  }
];

// ------------------------ Handlers

const handleClick = (value: number) => {
  settingsStore.setTextWidth(value);
};
</script>

<style scoped></style>
