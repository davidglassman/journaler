import { FileService } from "./services/file-service";
import { DEFAULT_SETTINGS } from "@shared/constants/settings-defaults";
import { JournalEntry } from "@shared/types/journal-entry";
import { type SettingsConfig } from "@shared/types/settings-config";
import {
  convertDateToFile,
  getNextDate,
  getPreviousDate,
  isFutureDate
} from "@shared/utils/date-utils";
import "dotenv/config";
import { app, BrowserWindow, dialog, ipcMain, screen } from "electron";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ------------------------ Path Setup

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In production, __dirname is inside build/compiled/electron, so we need to go up 3 levels
// In dev, vite-plugin-electron handles this differently
process.env.APP_ROOT = path.join(__dirname, "../../..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "build/compiled/electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "build/compiled/renderer");
export const ICONS_DIR = path.join(process.env.APP_ROOT, "build/resources/icons");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// ------------------------ Variables / Constants

const DISPLAY_INDEX = parseInt(process.env.DISPLAY_INDEX || "0");
const AUTO_OPEN_DEVTOOLS = process.env.AUTO_OPEN_DEVTOOLS === "true";
const IS_MAC = process.platform === "darwin";
const IS_WIN = process.platform === "win32";

// ---------------------- Create Services

const defaultRoot = path.join(app.getPath("documents"), "Journaler");
const settingsPath = path.join(app.getPath("appData"), "Journaler", "settings.json");

const fileService = new FileService(defaultRoot, settingsPath);

// ---------------------- Create Renderer(s)

let win: BrowserWindow | null;

function createWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[DISPLAY_INDEX] || displays[0];

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 720,
    minHeight: 480,
    ...(IS_MAC
      ? {
          titleBarStyle: "hiddenInset",
          trafficLightPosition: {
            x: 15,
            y: 12
          }
        }
      : {
          frame: false
        }),
    x: targetDisplay.bounds.x + 20,
    y: targetDisplay.bounds.y + 20,
    icon: path.join(
      ICONS_DIR,
      IS_WIN ? "windows/icon.ico" : IS_MAC ? "mac/icon.icns" : "linux/icon.png"
    ),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged
    }
  });

  setupWindowEvents();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  if (AUTO_OPEN_DEVTOOLS) {
    win.webContents.openDevTools();
  }
}

// ---------------------- Window Events

function setupWindowEvents() {
  if (!win) return;

  win.on("maximize", () => {
    win?.webContents.send("window-maximized");
  });

  win.on("unmaximize", () => {
    win?.webContents.send("window-unmaximized");
  });

  win.on("closed", () => {
    win = null;
  });
}

// ---------------------- Events from Renderer

ipcMain.handle("get-platform", (_event) => {
  return process.platform;
});

// On macOS, hide the traffic light buttons
// On Windows/Linux, renderer will handle this
ipcMain.handle("hide-titlebar", (_event) => {
  if (IS_MAC) {
    win?.setWindowButtonVisibility(false);
  }

  return null;
});

// On macOS, show the traffic light buttons
// On Windows/Linux, renderer will handle this
ipcMain.handle("show-titlebar", (_event) => {
  if (IS_MAC) {
    // Wait for transition to complete
    setTimeout(() => {
      win?.setWindowButtonVisibility(true);

      // Re-apply the traffic light position to prevent drift
      win?.setWindowButtonPosition({ x: 15, y: 12 });
    }, 60);
  }

  return null;
});

ipcMain.handle("window-minimize", (_event) => {
  win?.minimize();

  return null;
});

ipcMain.handle("window-maximize", (_event) => {
  if (win?.isMaximized()) {
    win?.unmaximize();
  } else {
    win?.maximize();
  }

  return null;
});

ipcMain.handle("window-close", (_event) => {
  win?.close();

  return null;
});

ipcMain.handle("is-maximized", (_event) => {
  return win?.isMaximized();
});

// Force recalculation of -webkit-app-region drag regions on Linux/Windows
// by doing a minimal resize. This is a workaround for Electron bug #6970.
ipcMain.handle("refresh-drag-regions", async (_event) => {
  if (!win || IS_MAC) return null;

  const bounds = win.getBounds();
  win.setBounds({ ...bounds, width: bounds.width + 1 });

  await new Promise((resolve) => setTimeout(resolve, 10));

  win.setBounds(bounds);

  return null;
});

ipcMain.handle("setup", async (_event) => {
  try {
    const directoryResult = await fileService.createDirectory();

    if (!directoryResult.success) {
      return directoryResult;
    }

    // Set the library location to the default root for first-time setup
    const settingsWithDefaults = {
      ...DEFAULT_SETTINGS,
      libraryLocation: defaultRoot
    };

    const saveResult = await fileService.saveSettings(settingsWithDefaults);

    if (!saveResult.success) {
      return saveResult;
    }

    return { success: true, data: settingsWithDefaults };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle("save-settings", async (_event, settings: SettingsConfig) => {
  return fileService.saveSettings(settings);
});

ipcMain.handle("load-settings", async (_event) => {
  const result = await fileService.loadSettings();

  // If settings were loaded successfully and contain a library location, update the file service
  if (result.success && result.data && result.data.libraryLocation) {
    fileService.updateRootPath(result.data.libraryLocation);
  }

  return result;
});

ipcMain.handle("get-entries", async (_event) => {
  return fileService.readAllEntries();
});

ipcMain.handle("get-entry", async (_event, date: Date) => {
  return fileService.getEntry(date);
});

ipcMain.handle("save-entry", async (_event, entry: JournalEntry) => {
  const fileName = convertDateToFile(entry.date);

  if (!fileName) {
    return {
      success: false,
      error: "Entry in data received is not a Date"
    };
  }

  return await fileService.writeFile(fileName, entry.content);
});

ipcMain.handle("get-previous-entry", async (_event, date: Date) => {
  const previousDate = getPreviousDate(date);

  if (!previousDate) {
    return {
      success: false,
      error: "Entry in data received is not a Date"
    };
  }

  return fileService.getEntry(previousDate);
});

ipcMain.handle("get-next-entry", async (_event, date: Date) => {
  const nextDate = getNextDate(date);

  if (!nextDate) {
    return {
      success: false,
      error: "Entry in data received is not a Date"
    };
  }

  if (isFutureDate(nextDate)) {
    return {
      success: false,
      error: "Cannot write to future dates"
    };
  }

  return fileService.getEntry(nextDate);
});

ipcMain.handle("choose-library", async (_event) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Choose Library Location"
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: true, data: null };
    }

    const selectedPath = result.filePaths[0];

    // Update the file service to use the new path
    fileService.updateRootPath(selectedPath);

    // Create the journaler directory if it doesn't exist
    const directoryResult = await fileService.createDirectory();

    if (!directoryResult.success) {
      return directoryResult;
    }

    return { success: true, data: selectedPath };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle("export-entries", async (_event) => {
  try {
    const result = await dialog.showSaveDialog({
      title: "Export Journal Entries",
      defaultPath: "journaler-export.zip",
      filters: [{ name: "ZIP Archive", extensions: ["zip"] }]
    });

    if (result.canceled || !result.filePath) {
      return { success: false, error: "cancelled" };
    }

    return await fileService.exportEntries(result.filePath);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle("print-entries", async (_event, fontSize: number, fontFamily: string) => {
  try {
    // Show save dialog for PDF
    const result = await dialog.showSaveDialog({
      title: "Save Journal as PDF",
      defaultPath: "journal-entries.pdf",
      filters: [{ name: "PDF Document", extensions: ["pdf"] }]
    });

    if (result.canceled || !result.filePath) {
      return { success: false, error: "cancelled" };
    }

    // Generate the HTML content
    const htmlResult = await fileService.generatePrintableHTML(fontSize, fontFamily);

    if (!htmlResult.success) {
      return htmlResult;
    }

    // Create a hidden browser window to generate PDF
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // Load the HTML content
    await printWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(htmlResult.data)}`
    );

    // Wait for page to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate PDF
    const pdfData = await printWindow.webContents.printToPDF({
      printBackground: true,
      margins: {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1
      },
      pageSize: "Letter"
    });

    // Save the PDF to the chosen location
    await fsPromises.writeFile(result.filePath, pdfData);

    // Close the window
    printWindow.close();

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle(
  "print-current-entry",
  async (_event, date: Date, fontSize: number, fontFamily: string) => {
    try {
      // Show save dialog for PDF
      const result = await dialog.showSaveDialog({
        title: "Save Entry as PDF",
        defaultPath: "journal-entry.pdf",
        filters: [{ name: "PDF Document", extensions: ["pdf"] }]
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: "cancelled" };
      }

      // Generate the HTML content for the current entry
      const htmlResult = await fileService.generatePrintableHTMLForEntry(
        date,
        fontSize,
        fontFamily
      );

      if (!htmlResult.success) {
        return htmlResult;
      }

      // Create a hidden browser window to generate PDF
      const printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      // Load the HTML content
      await printWindow.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(htmlResult.data)}`
      );

      // Wait for page to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate PDF
      const pdfData = await printWindow.webContents.printToPDF({
        printBackground: true,
        margins: {
          top: 1,
          bottom: 1,
          left: 1,
          right: 1
        },
        pageSize: "Letter"
      });

      // Save the PDF to the chosen location
      await fsPromises.writeFile(result.filePath, pdfData);

      // Close the window
      printWindow.close();

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  }
);

// ---------------------- App Ready

app.whenReady().then(async () => {
  createWindow();

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// ---------------------- App Close

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (!IS_MAC) {
    app.quit();
    win = null;
  }
});
