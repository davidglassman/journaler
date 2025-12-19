import { type AccentColor } from "@shared/types/accent-color";
import { type SettingsConfig } from "@shared/types/settings-config";
import { type ThemeType } from "@shared/types/theme-type";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  // ------------------------ Theme
  // Note: Placeholder values - real defaults come from backend

  const theme = ref<ThemeType>("auto");

  const setTheme = (value: ThemeType) => {
    theme.value = value;
  };

  // ------------------------ Accent Color

  const accentColor = ref<AccentColor>("green");

  const setAccentColor = (value: AccentColor) => {
    accentColor.value = value;
  };

  // ------------------------ Text Width

  const textWidth = ref<number>(640);

  const setTextWidth = (value: number) => {
    textWidth.value = value;
  };

  // ------------------------ Paragraph Spacing

  const paragraphSpacing = ref<number>(20);

  const setParagraphSpacing = (value: number) => {
    paragraphSpacing.value = value;
  };

  // ------------------------ Font Size

  const fontSize = ref<number>(20);

  const setFontSize = (value: number) => {
    fontSize.value = value;
  };

  // ------------------------ Library Location

  const libraryLocation = ref("");

  const setLibraryLocation = (value: string) => {
    libraryLocation.value = value;
  };

  // ------------------------ Saving / Loading

  const settingsRefs = {
    theme,
    accentColor,
    textWidth,
    paragraphSpacing,
    fontSize,
    libraryLocation
  };

  const isLoading = ref(false);
  const isSaving = ref(false);

  const saveSettings = async () => {
    if (isLoading.value || isSaving.value) return;

    isSaving.value = true;

    try {
      const settings: SettingsConfig = {
        theme: theme.value,
        accentColor: accentColor.value,
        textWidth: textWidth.value,
        paragraphSpacing: paragraphSpacing.value,
        fontSize: fontSize.value,
        libraryLocation: libraryLocation.value
      };

      if (window.ipcRenderer) {
        const result = await window.ipcRenderer.saveSettings(settings);

        if (!result.success) {
          console.error("Failed to save settings:", result.error);
        }

        return result;
      }

      return { success: false, error: "IPC not available" };
    } finally {
      isSaving.value = false;
    }
  };

  const handleSettingsResponse = (data: SettingsConfig) => {
    const settings = data;

    theme.value = settings.theme;
    accentColor.value = settings.accentColor ?? "green";
    textWidth.value = settings.textWidth;
    paragraphSpacing.value = settings.paragraphSpacing;
    fontSize.value = settings.fontSize;
    libraryLocation.value = settings.libraryLocation;
  };

  const loadSettings = async () => {
    if (isLoading.value) {
      return { success: false, error: "Already loading" };
    }

    if (!window.ipcRenderer) {
      return { success: false, error: "IPC not available" };
    }

    isLoading.value = true;

    try {
      const result = await window.ipcRenderer.loadSettings();

      if (!result.success) {
        console.error("Failed to load settings:", result.error);
        return result;
      }

      // If no settings exist, run setup to create defaults
      if (!result.data) {
        const setupResult = await window.ipcRenderer.setup();

        if (!setupResult.success) {
          console.error("Failed to setup settings:", setupResult.error);
          return setupResult;
        }

        handleSettingsResponse(setupResult.data);
        return setupResult;
      }

      // Load settings into store
      handleSettingsResponse(result.data);

      return result;
    } finally {
      isLoading.value = false;
    }
  };

  watch(Object.values(settingsRefs), () => {
    if (!isLoading.value) {
      saveSettings();
    }
  });

  // ------------------------ Return

  return {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    textWidth,
    setTextWidth,
    paragraphSpacing,
    setParagraphSpacing,
    fontSize,
    setFontSize,
    libraryLocation,
    setLibraryLocation,
    saveSettings,
    loadSettings
  };
});
