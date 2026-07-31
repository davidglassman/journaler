<template>
  <Teleport to="body">
    <div
      v-if="searchStore.isOpen"
      class="fixed inset-0 z-[100] flex items-start justify-center bg-zinc-950/50 px-4 pt-[20vh] backdrop-blur-[2px]"
      style="-webkit-app-region: no-drag"
      @mousedown.self="searchStore.close()">
      <div
        class="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-label="Search journal entries"
        @keydown="onOverlayKeydown">
        <!-- Search input -->
        <div class="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-700">
          <IconSearch class="size-5 shrink-0 text-zinc-400" />
          <input
            ref="inputRef"
            :value="searchStore.query"
            type="text"
            class="h-14 w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            placeholder="Search entries…"
            autocomplete="off"
            spellcheck="false"
            @input="onInput" />
        </div>

        <!-- Results / empty states -->
        <div class="max-h-[min(24rem,50vh)] overflow-y-auto py-2">
          <p
            v-if="!hasQuery"
            class="px-4 py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
            Type to search…
          </p>

          <p
            v-else-if="results.length === 0"
            class="px-4 py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
            No matches
          </p>

          <button
            v-for="(match, index) in results"
            :key="`${match.date.getTime()}-${match.matchIndex}`"
            :ref="(el) => setResultRef(el, index)"
            type="button"
            class="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors"
            :class="
              index === searchStore.selectedIndex
                ? 'bg-zinc-100 dark:bg-zinc-800'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
            "
            @click="openMatch(match)"
            @mouseenter="searchStore.selectIndex(index)">
            <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {{ match.date.toDateString() }}
            </span>
            <span class="line-clamp-2 text-sm text-zinc-800 dark:text-zinc-200">
              <template v-if="match.snippetHighlightStart > 0">{{
                match.snippet.slice(0, match.snippetHighlightStart)
              }}</template>
              <mark
                class="rounded-sm bg-[rgb(var(--accent-300)/0.55)] text-inherit dark:bg-[rgb(var(--accent-500)/0.35)]"
                >{{
                  match.snippet.slice(match.snippetHighlightStart, match.snippetHighlightEnd)
                }}</mark
              >
              <template v-if="match.snippetHighlightEnd < match.snippet.length">{{
                match.snippet.slice(match.snippetHighlightEnd)
              }}</template>
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { searchEntries, type SearchMatch } from "@/lib/search/search-entries";
import { useJournalStore } from "@/store/journal-store";
import { useSearchStore } from "@/store/search-store";
import { useDebounceFn } from "@vueuse/core";
import { computed, nextTick, ref, watch } from "vue";
import IconSearch from "~icons/mdi/magnify";

// ------------------------ Variables

const searchStore = useSearchStore();
const journalStore = useJournalStore();

const inputRef = ref<HTMLInputElement | null>(null);
const resultRefs = ref<(HTMLElement | null)[]>([]);
const debouncedQuery = ref("");

const hasQuery = computed(() => debouncedQuery.value.trim().length > 0);

const results = computed(() => searchEntries(journalStore.allEntries, debouncedQuery.value));

// ------------------------ Functions

const applyDebouncedQuery = useDebounceFn((value: string) => {
  debouncedQuery.value = value;
}, 120);

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;

  searchStore.setQuery(value);
  applyDebouncedQuery(value);
};

const setResultRef = (el: unknown, index: number) => {
  resultRefs.value[index] = el instanceof HTMLElement ? el : null;
};

const openMatch = async (match: SearchMatch) => {
  searchStore.close();

  await journalStore.getEntry(match.date);

  // Set after getEntry so reveal maps against the loaded entry, not the previous one.
  searchStore.setPendingReveal({
    startOffset: match.startOffset,
    endOffset: match.endOffset
  });
};

const onOverlayKeydown = (event: KeyboardEvent) => {
  const key = event.key;

  if (key === "ArrowDown") {
    event.preventDefault();

    searchStore.moveSelection(1, results.value.length);

    return;
  }

  if (key === "ArrowUp") {
    event.preventDefault();

    searchStore.moveSelection(-1, results.value.length);

    return;
  }

  if (key === "Enter") {
    event.preventDefault();

    const match = results.value[searchStore.selectedIndex];

    if (match) {
      void openMatch(match);
    }
  }
};

const refreshLibraryInBackground = () => {
  void journalStore.getAllEntries().then(() => {
    // Keep unsaved current entry text searchable after a disk refresh.
    const current = journalStore.current;

    if (!current) return;

    const index = journalStore.allEntries.findIndex(
      (e) => e.date.getTime() === current.date.getTime()
    );
    if (index >= 0) {
      journalStore.allEntries[index] = current;
    } else if (current.content.trim() !== "") {
      journalStore.allEntries.push(current);
    }
  });
};

// ------------------------ Watch

watch(
  () => searchStore.isOpen,
  async (open) => {
    if (!open) {
      debouncedQuery.value = "";
      resultRefs.value = [];

      return;
    }

    debouncedQuery.value = "";
    refreshLibraryInBackground();

    await nextTick();

    inputRef.value?.focus();
  }
);

watch(
  () => searchStore.selectedIndex,
  async () => {
    await nextTick();

    resultRefs.value[searchStore.selectedIndex]?.scrollIntoView({
      block: "nearest"
    });
  }
);
</script>
