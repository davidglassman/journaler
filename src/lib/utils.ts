import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textToHtml(text: string): string {
  if (!text) return "<p></p>";

  // Split by newlines and wrap each line in a <p> tag
  // Empty lines become empty paragraphs to preserve spacing
  const lines = text.split("\n");

  return lines.map((line) => `<p>${line}</p>`).join("");
}
