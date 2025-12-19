import { type AccentColor } from "./accent-color";
import { type ThemeType } from "./theme-type";

export interface SettingsConfig {
  theme: ThemeType;
  accentColor: AccentColor;
  textWidth: number;
  paragraphSpacing: number;
  fontSize: number;
  libraryLocation: string;
}
