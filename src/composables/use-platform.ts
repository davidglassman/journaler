import { onMounted, ref } from "vue";

const isMac = ref(false);
let initialized = false;

export const usePlatform = () => {
  onMounted(async () => {
    if (!initialized && window.ipcRenderer) {
      const result = await window.ipcRenderer.getPlatform();

      isMac.value = result === "darwin";
      initialized = true;
    }
  });

  return { isMac };
};
