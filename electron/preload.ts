import { JournalEntry } from "@shared/types/journal-entry";
import { SettingsConfig } from "@shared/types/settings-config";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
  getPlatform: () => ipcRenderer.invoke("get-platform"),
  hideTitlebar: () => ipcRenderer.invoke("hide-titlebar"),
  showTitlebar: () => ipcRenderer.invoke("show-titlebar"),
  windowMinimize: () => ipcRenderer.invoke("window-minimize"),
  windowMaximize: () => ipcRenderer.invoke("window-maximize"),
  windowClose: () => ipcRenderer.invoke("window-close"),
  isMaximized: () => ipcRenderer.invoke("is-maximized"),
  refreshDragRegions: () => ipcRenderer.invoke("refresh-drag-regions"),
  onWindowMaximized: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on("window-maximized", listener);
    return () => ipcRenderer.removeListener("window-maximized", listener);
  },
  onWindowUnmaximized: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on("window-unmaximized", listener);
    return () => ipcRenderer.removeListener("window-unmaximized", listener);
  },
  setup: () => ipcRenderer.invoke("setup"),
  saveSettings: (settings: SettingsConfig) => ipcRenderer.invoke("save-settings", settings),
  loadSettings: () => ipcRenderer.invoke("load-settings"),
  getEntries: () => ipcRenderer.invoke("get-entries"),
  getEntry: (date: Date) => ipcRenderer.invoke("get-entry", date),
  saveEntry: (entry: JournalEntry) => ipcRenderer.invoke("save-entry", entry),
  getPreviousEntry: (date: Date) => ipcRenderer.invoke("get-previous-entry", date),
  getNextEntry: (date: Date) => ipcRenderer.invoke("get-next-entry", date),
  chooseLibrary: () => ipcRenderer.invoke("choose-library"),
  exportEntries: () => ipcRenderer.invoke("export-entries"),
  printEntries: (fontSize: number, fontFamily: string) =>
    ipcRenderer.invoke("print-entries", fontSize, fontFamily),
  printCurrentEntry: (date: Date, fontSize: number, fontFamily: string) =>
    ipcRenderer.invoke("print-current-entry", date, fontSize, fontFamily)
});
