import { onMounted, onUnmounted, ref } from "vue";

export const useWindowControls = () => {
  // ------------------------ Variables

  const isMaximized = ref(false);

  // ------------------------ Functions

  const minimize = () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.windowMinimize();
    }
  };

  const toggleMaximize = async () => {
    if (window.ipcRenderer) {
      await window.ipcRenderer.windowMaximize();
      isMaximized.value = await window.ipcRenderer.isMaximized();
    }
  };

  const close = () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.windowClose();
    }
  };

  // ------------------------ Lifecycle

  let cleanupMaximized: (() => void) | undefined;
  let cleanupUnmaximized: (() => void) | undefined;

  onMounted(async () => {
    const ipc = window.ipcRenderer;
    if (ipc) {
      isMaximized.value = await ipc.isMaximized();

      cleanupMaximized = ipc.onWindowMaximized(() => {
        isMaximized.value = true;
      });

      cleanupUnmaximized = ipc.onWindowUnmaximized(() => {
        isMaximized.value = false;
      });
    }
  });

  onUnmounted(() => {
    cleanupMaximized?.();
    cleanupUnmaximized?.();
  });

  // ------------------------ Return

  return { isMaximized, minimize, toggleMaximize, close };
};
