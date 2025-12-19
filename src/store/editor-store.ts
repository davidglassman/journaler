import { useTitlebarStore } from "@/store/titlebar-store";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEditorStore = defineStore("editor", () => {
  // ------------------------ Variables

  const isTyping = ref(false);
  const focusMode = ref(true);
  const content = ref("");
  const chromeVisible = ref(true);

  const titlebarStore = useTitlebarStore();

  let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

  // ------------------------ Functions

  const setChromeVisible = async (state: boolean) => {
    const wasVisible = chromeVisible.value;
    chromeVisible.value = state;
    titlebarStore.setIsVisible(state);

    // When chrome becomes visible, refresh drag regions after transition completes.
    // Debounce to avoid multiple rapid calls (e.g., from mousemove events).
    // See: https://github.com/electron/electron/issues/6970
    if (state && !wasVisible) {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(async () => {
        await window.ipcRenderer?.refreshDragRegions();
        refreshTimeout = null;
      }, 60);
    }
  };

  const setIsTyping = (state: boolean) => {
    isTyping.value = state;

    if (focusMode.value) {
      setChromeVisible(!state);
    }
  };

  const setFocusMode = (state: boolean) => {
    focusMode.value = state;
  };

  const toggleFocusMode = () => {
    focusMode.value = !focusMode.value;
  };

  const setContent = (text: string) => {
    content.value = text;
  };

  // ------------------------ Return

  return {
    isTyping,
    setIsTyping,
    focusMode,
    setFocusMode,
    toggleFocusMode,
    content,
    setContent,
    chromeVisible,
    setChromeVisible
  };
});
