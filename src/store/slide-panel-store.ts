import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type SlidePanelType = "none" | "settings" | "metrics";

export const useSlidePanelStore = defineStore("slide-panel", () => {
  // ------------------------ Variables

  const activePanel = ref<SlidePanelType>("none");

  // ------------------------ Computed

  const isVisible = computed(() => activePanel.value !== "none");

  // ------------------------ Functions

  const setActivePanel = (panel: SlidePanelType) => {
    activePanel.value = panel;
  };

  const togglePanel = (panel: SlidePanelType) => {
    if (activePanel.value === panel) {
      activePanel.value = "none";
    } else {
      activePanel.value = panel;
    }
  };

  const close = () => {
    activePanel.value = "none";
  };

  // ------------------------ Return

  return {
    activePanel,
    isVisible,
    setActivePanel,
    togglePanel,
    close
  };
});
