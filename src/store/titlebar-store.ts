import { defineStore } from "pinia";
import { ref } from "vue";

export const useTitlebarStore = defineStore("titlebar", () => {
  // ------------------------ Variables

  const isVisible = ref(true);

  // ------------------------ Functions

  const setIsVisible = (state: boolean) => {
    isVisible.value = state;

    if (window.ipcRenderer) {
      if (state) {
        window.ipcRenderer.showTitlebar();
      } else {
        window.ipcRenderer.hideTitlebar();
      }
    }
  };

  // ------------------------ Return

  return { isVisible, setIsVisible };
});
