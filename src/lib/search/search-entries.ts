import type { JournalEntry } from "@shared/types/journal-entry";

export interface SearchMatch {
  date: Date;
  matchIndex: number;
  startOffset: number;
  endOffset: number;
  snippet: string;
  snippetHighlightStart: number;
  snippetHighlightEnd: number;
}

const SNIPPET_PAD = 60;

function buildSnippet(
  content: string,
  startOffset: number,
  endOffset: number
): Pick<SearchMatch, "snippet" | "snippetHighlightStart" | "snippetHighlightEnd"> {
  const snippetStart = Math.max(0, startOffset - SNIPPET_PAD);
  const snippetEnd = Math.min(content.length, endOffset + SNIPPET_PAD);

  const prefix = snippetStart > 0 ? "…" : "";
  const suffix = snippetEnd < content.length ? "…" : "";
  const core = content.slice(snippetStart, snippetEnd);

  return {
    snippet: `${prefix}${core}${suffix}`,
    snippetHighlightStart: prefix.length + (startOffset - snippetStart),
    snippetHighlightEnd: prefix.length + (endOffset - snippetStart)
  };
}

/**
 * Case-insensitive substring search across journal entry bodies.
 * Empty query → []; empty-content entries skipped; newest dates first.
 */
export function searchEntries(entries: JournalEntry[], query: string): SearchMatch[] {
  const trimmed = query.trim();

  if (!trimmed) return [];

  const needle = trimmed.toLowerCase();
  const matches: SearchMatch[] = [];

  for (const entry of entries) {
    const content = entry.content;

    if (content.trim() === "") continue;

    const haystack = content.toLowerCase();

    let from = 0;
    let matchIndex = 0;

    while (from <= haystack.length) {
      const startOffset = haystack.indexOf(needle, from);

      if (startOffset === -1) break;

      const endOffset = startOffset + needle.length;
      const snippetParts = buildSnippet(content, startOffset, endOffset);

      matches.push({
        date: entry.date,
        matchIndex,
        startOffset,
        endOffset,
        ...snippetParts
      });

      matchIndex += 1;
      from = startOffset + 1;
    }
  }

  matches.sort((a, b) => {
    const dateDiff = b.date.getTime() - a.date.getTime();

    if (dateDiff !== 0) return dateDiff;

    return a.startOffset - b.startOffset;
  });

  return matches;
}
