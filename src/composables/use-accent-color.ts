import { useSettingsStore } from "@/store/settings-store";
import type { AccentColor } from "@shared/types/accent-color";
import { watch } from "vue";

// RGB values for Tailwind colors at different intensities
const ACCENT_COLORS: Record<AccentColor, { 300: string; 500: string; 700: string }> = {
  green: {
    300: "134 239 172",
    500: "34 197 94",
    700: "21 128 61"
  },
  blue: {
    300: "147 197 253",
    500: "59 130 246",
    700: "29 78 216"
  },
  red: {
    300: "252 165 165",
    500: "239 68 68",
    700: "185 28 28"
  },
  orange: {
    300: "253 186 116",
    500: "249 115 22",
    700: "194 65 12"
  },
  yellow: {
    300: "253 224 71",
    500: "234 179 8",
    700: "161 98 7"
  },
  purple: {
    300: "216 180 254",
    500: "168 85 247",
    700: "126 34 206"
  }
};

const applyAccentColor = (color: AccentColor) => {
  const colors = ACCENT_COLORS[color];

  document.documentElement.style.setProperty("--accent-300", colors[300]);
  document.documentElement.style.setProperty("--accent-500", colors[500]);
  document.documentElement.style.setProperty("--accent-700", colors[700]);
};

export const useAccentColor = () => {
  const settingsStore = useSettingsStore();

  // Apply initial accent color
  applyAccentColor(settingsStore.accentColor);

  // Watch for changes and update CSS variables
  watch(
    () => settingsStore.accentColor,
    (newColor) => {
      applyAccentColor(newColor);
    }
  );

  return {};
};
