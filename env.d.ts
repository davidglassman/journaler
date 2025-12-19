/// <reference types="vite/client" />
import type { JournalEntry } from "@shared/types/journal-entry";
import { Result, VoidResult } from "@shared/types/result";
import { SettingsConfig } from "@shared/types/settings-config";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

// Electron IPC types exposed via preload script
declare global {
  interface Window {
    ipcRenderer?: {
      getPlatform(): Promise<string>;
      hideTitlebar(): Promise<void>;
      showTitlebar(): Promise<void>;
      windowMinimize(): Promise<void>;
      windowMaximize(): Promise<void>;
      windowClose(): Promise<void>;
      isMaximized(): Promise<boolean>;
      refreshDragRegions(): Promise<void>;
      onWindowMaximized(callback: () => void): () => void;
      onWindowUnmaximized(callback: () => void): () => void;
      setup(): Promise<Result<SettingsConfig>>;
      saveSettings(settings: SettingsConfig): Promise<VoidResult>;
      loadSettings(): Promise<Result<SettingsConfig | null>>;
      getEntries(): Promise<Result<JournalEntry[]>>;
      getEntry(date: Date): Promise<Result<JournalEntry>>;
      saveEntry(entry: JournalEntry): Promise<VoidResult>;
      getPreviousEntry(date: Date): Promise<Result<JournalEntry>>;
      getNextEntry(date: Date): Promise<Result<JournalEntry>>;
      chooseLibrary(): Promise<Result<string | null>>;
      exportEntries(): Promise<VoidResult>;
      printEntries(fontSize: number, fontFamily: string): Promise<VoidResult>;
      printCurrentEntry(date: Date, fontSize: number, fontFamily: string): Promise<VoidResult>;
    };
  }

  const __APP_VERSION__: string;
  const __APP_NAME__: string;
}

export {};
