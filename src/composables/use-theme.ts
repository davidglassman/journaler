import { useSettingsStore } from "@/store/settings-store";
import { useColorMode } from "@vueuse/core";
import { watch } from "vue";

export const useTheme = () => {
  // ------------------------ Variables

  const settingsStore = useSettingsStore();

  const mode = useColorMode({
    storageKey: null, // let the store handle persistence
    initialValue: settingsStore.theme,
    modes: {
      light: "light",
      dark: "dark",
      auto: "auto"
    }
  });

  // ------------------------ Watch

  // Only sync store -> mode (one-way)
  // Store holds the preference (light/dark/auto), mode applies it
  watch(
    () => settingsStore.theme,
    (newTheme) => {
      if (mode.value !== newTheme) {
        mode.value = newTheme;
      }
    }
  );

  // ------------------------ Return

  // No need to return anything - this composable just sets up the sync
  return {};
};
