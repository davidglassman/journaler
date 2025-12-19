<template>
  <Transition
    enter-active-class="transition-transform duration-50 ease-out"
    leave-active-class="transition-transform duration-50 ease-in"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full">
    <div
      v-show="slidePanelStore.isVisible"
      class="relative w-80">
      <div
        ref="scrollContainer"
        class="scroll-container flex w-full flex-col items-start justify-start gap-4 border-r-1 border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <SettingsContent v-if="slidePanelStore.activePanel === 'settings'" />
        <MetricsContent v-if="slidePanelStore.activePanel === 'metrics'" />
      </div>

      <CustomScrollbar
        :scroll-container="scrollContainer"
        :align-to-viewport="false" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import MetricsContent from "@/components/metrics/MetricsContent.vue";
import SettingsContent from "@/components/settings/SettingsContent.vue";
import CustomScrollbar from "@/components/shared/scrollbar/CustomScrollbar.vue";
import { useSlidePanelStore } from "@/store/slide-panel-store";
import { ref } from "vue";

// ------------------------ Variables

const scrollContainer = ref(null);
const slidePanelStore = useSlidePanelStore();
</script>

<style scoped></style>
