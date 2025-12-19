import { GEIST_FONT_BASE64 } from "./geist-font-base64";
import { JournalEntry } from "@shared/types/journal-entry";
import { Result, VoidResult } from "@shared/types/result";
import { SettingsConfig } from "@shared/types/settings-config";
import { convertDateToFile } from "@shared/utils/date-utils";
import archiver from "archiver";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";

export class FileService {
  private rootPath: string;
  private settingsPath: string;

  constructor(rootPath: string, settingsPath: string) {
    this.rootPath = path.normalize(rootPath);
    this.settingsPath = path.normalize(settingsPath);
  }

  updateRootPath(newRootPath: string) {
    this.rootPath = path.normalize(newRootPath);
  }

  private getFileFolderPath(): string {
    return this.rootPath;
  }

  private getSettingsPath(): string {
    return this.settingsPath;
  }

  private getFilePath(fileName?: string): string {
    const journalerPath = this.getFileFolderPath();

    if (!fileName) {
      return journalerPath;
    }

    // Normalize the filename first
    const normalizedFileName = path.normalize(fileName);

    // Construct the full path
    const fullPath = path.join(journalerPath, normalizedFileName);

    // Ensure the resolved path is still within journalerPath
    const relativePath = path.relative(journalerPath, fullPath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      throw new Error("Invalid file name: directory traversal detected");
    }

    return fullPath;
  }

  async createDirectory(): Promise<VoidResult> {
    try {
      await fsPromises.mkdir(this.getFilePath(), { recursive: true });

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async deleteDirectory(): Promise<VoidResult> {
    try {
      await fsPromises.rm(this.getFilePath(), { recursive: true, force: true });

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async checkFileExists(fileName: string) {
    try {
      await fsPromises.access(this.getFilePath(fileName));

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async readAllFiles(): Promise<Result<string[]>> {
    try {
      const files = await fsPromises.readdir(this.getFilePath());

      return {
        success: true,
        data: files
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async readAllEntries(): Promise<Result<JournalEntry[]>> {
    try {
      const filesResult = await this.readAllFiles();

      if (!filesResult.success) {
        return filesResult;
      }

      const entries: JournalEntry[] = [];

      for (const fileName of filesResult.data) {
        // Only process .md files
        if (!fileName.endsWith(".md")) {
          continue;
        }

        // Extract the date from the filename
        const dateString = fileName.replace(".md", "");

        // Parse the date string (YYYY-MM-DD format)
        const dateParts = dateString.split("-");

        if (dateParts.length !== 3) {
          continue; // Skip invalid filenames
        }

        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
        const day = parseInt(dateParts[2], 10);

        // Validate the date parts
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          continue; // Skip invalid dates
        }

        const date = new Date(year, month, day);

        // Read the file content
        const contentResult = await this.readFile(fileName);

        if (!contentResult.success) {
          // Skip files that can't be read
          continue;
        }

        entries.push({
          date: date,
          content: contentResult.data
        });
      }

      return {
        success: true,
        data: entries
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async readFile(fileName: string): Promise<Result<string>> {
    try {
      const content = await fsPromises.readFile(this.getFilePath(fileName), "utf-8");

      return {
        success: true,
        data: content
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async writeFile(fileName: string, contents: string): Promise<VoidResult> {
    try {
      const directoryResult = await this.createDirectory();

      if (!directoryResult.success) {
        return directoryResult;
      }

      await fsPromises.writeFile(this.getFilePath(fileName), contents, "utf-8");

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async deleteFile(fileName: string): Promise<VoidResult> {
    try {
      await fsPromises.unlink(this.getFilePath(fileName));

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async saveSettings(settings: SettingsConfig): Promise<VoidResult> {
    try {
      const filePath = this.getSettingsPath();
      const dirPath = path.dirname(filePath);

      await fsPromises.mkdir(dirPath, { recursive: true });
      await fsPromises.writeFile(filePath, JSON.stringify(settings, null, 2), "utf8");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async loadSettings(): Promise<Result<SettingsConfig | null>> {
    try {
      const filePath = this.getSettingsPath();

      try {
        const fileContents = await fsPromises.readFile(filePath, "utf8");
        const data = JSON.parse(fileContents);

        return { success: true, data };
      } catch (error) {
        // File doesn't exist - this is OK for first run
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          return { success: true, data: null };
        }

        throw error;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      return { success: false, error: errorMessage };
    }
  }

  async getEntry(date: Date): Promise<Result<JournalEntry>> {
    try {
      const fileName = convertDateToFile(date);

      if (!fileName) {
        return {
          success: false,
          error: "Data received is not a Date"
        };
      }

      const exists = await this.checkFileExists(fileName);

      if (!exists.success) {
        const writeResult = await this.writeFile(fileName, "");

        if (!writeResult.success) {
          return writeResult;
        }

        return {
          success: true,
          data: {
            date: date,
            content: ""
          }
        };
      }

      const readResult = await this.readFile(fileName);

      if (!readResult.success) {
        return readResult;
      }

      return {
        success: true,
        data: {
          date: date,
          content: readResult.data
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      return { success: false, error: errorMessage };
    }
  }

  async exportEntries(savePath: string): Promise<VoidResult> {
    return new Promise((resolve) => {
      try {
        // Create a file stream for the zip file
        const output = fs.createWriteStream(savePath);
        const archive = archiver("zip", {
          zlib: { level: 9 } // Maximum compression
        });

        // Listen for errors
        archive.on("error", (err) => {
          resolve({
            success: false,
            error: err instanceof Error ? err.message : String(err)
          });
        });

        // Listen for completion
        output.on("close", () => {
          resolve({ success: true });
        });

        // Handle output stream errors
        output.on("error", (err: Error) => {
          resolve({
            success: false,
            error: err.message
          });
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add all files from the journal directory
        archive.directory(this.getFilePath(), false);

        // Finalize the archive
        archive.finalize();
      } catch (err) {
        resolve({
          success: false,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    });
  }

  async generatePrintableHTMLForEntry(
    date: Date,
    fontSize: number = 12,
    fontFamily: string = "Georgia, serif"
  ): Promise<Result<string>> {
    try {
      // Get the entry
      const entryResult = await this.getEntry(date);

      if (!entryResult.success) {
        return entryResult;
      }

      const entry = entryResult.data;

      // Check if entry is empty
      if (entry.content.trim() === "") {
        return {
          success: false,
          error: "Entry is empty"
        };
      }

      // Format date helper
      const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        };
        return date.toLocaleDateString("en-US", options);
      };

      // Escape HTML to prevent injection
      const escapeHTML = (text: string): string => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      // Generate HTML document with embedded Geist font (no external network requests)
      const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Journal Entry - ${formatDate(entry.date)}</title>
					<style>
						@font-face {
							font-family: 'Geist';
							src: url('data:font/woff2;base64,${GEIST_FONT_BASE64}') format('woff2');
							font-weight: 100 900;
							font-style: normal;
						}

						@page {
							margin: 1in 1in 1.5in 1in;
							@bottom-center {
								content: counter(page);
								font-family: ${fontFamily};
								font-size: 10pt;
								color: #666;
							}
						}

						* {
							margin: 0;
							padding: 0;
							box-sizing: border-box;
						}

						body {
							font-family: ${fontFamily};
							font-size: ${fontSize}pt;
							line-height: 1.6;
							color: #000;
							background: #fff;
						}

						.entry-date {
							font-weight: bold;
							font-size: ${fontSize + 2}pt;
							margin-bottom: 1em;
							color: #333;
						}

						.entry-content {
							white-space: pre-wrap;
							word-wrap: break-word;
						}
					</style>
				</head>
				<body>
					<div class="entry">
						<div class="entry-date">${formatDate(entry.date)}</div>
						<div class="entry-content">${escapeHTML(entry.content)}</div>
					</div>
				</body>
				</html>
			`;

      return {
        success: true,
        data: html
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }

  async generatePrintableHTML(
    fontSize: number = 12,
    fontFamily: string = "Georgia, serif"
  ): Promise<Result<string>> {
    try {
      // Get all entries
      const entriesResult = await this.readAllEntries();

      if (!entriesResult.success) {
        return entriesResult;
      }

      // Filter out empty entries and sort by date
      const entries = entriesResult.data
        .filter((entry) => entry.content.trim() !== "")
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (entries.length === 0) {
        return {
          success: false,
          error: "No entries to print"
        };
      }

      // Format date helper
      const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        };
        return date.toLocaleDateString("en-US", options);
      };

      // Escape HTML to prevent injection
      const escapeHTML = (text: string): string => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      // Generate HTML document with embedded Geist font (no external network requests)
      const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Journal Entries</title>
					<style>
						@font-face {
							font-family: 'Geist';
							src: url('data:font/woff2;base64,${GEIST_FONT_BASE64}') format('woff2');
							font-weight: 100 900;
							font-style: normal;
						}

						@page {
							margin: 1in 1in 1.5in 1in;
							@bottom-center {
								content: counter(page);
								font-family: ${fontFamily};
								font-size: 10pt;
								color: #666;
							}
						}

						* {
							margin: 0;
							padding: 0;
							box-sizing: border-box;
						}

						body {
							font-family: ${fontFamily};
							font-size: ${fontSize}pt;
							line-height: 1.6;
							color: #000;
							background: #fff;
						}

						.entry {
							page-break-after: always;
							page-break-inside: avoid;
						}

						.entry:last-child {
							page-break-after: auto;
						}

						.entry-date {
							font-weight: bold;
							font-size: ${fontSize + 2}pt;
							margin-bottom: 1em;
							color: #333;
						}

						.entry-content {
							white-space: pre-wrap;
							word-wrap: break-word;
						}
					</style>
				</head>
				<body>
				${entries
          .map(
            (entry) => `
					<div class="entry">
						<div class="entry-date">${formatDate(entry.date)}</div>
						<div class="entry-content">${escapeHTML(entry.content)}</div>
					</div>`
          )
          .join("\n")}
				</body>
				</html>
			`;

      return {
        success: true,
        data: html
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }
}
