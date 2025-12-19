import { textToHtml } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { useMetricsStore } from "@/store/metrics-store";
import { type JournalEntry } from "@shared/types/journal-entry";
import { type VoidResult } from "@shared/types/result";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, toRaw } from "vue";
import { toast } from "vue-sonner";

export const useJournalStore = defineStore("journal", () => {
  const current = ref<JournalEntry | null>(null);
  const allEntries = ref<JournalEntry[]>([]);

  const editorStore = useEditorStore();

  const setCurrent = (entry: JournalEntry | null) => {
    current.value = entry;

    // Sync editor content when current entry changes
    if (entry) {
      const htmlContent = textToHtml(entry.content);
      editorStore.setContent(htmlContent);
    }
  };

  const updateContent = (content: string) => {
    if (current.value) {
      // TipTap's getText() adds a newline after each block element
      // Remove the trailing newline and normalize double newlines to single
      const normalizedContent = content
        .replace(/\n$/, "") // Remove trailing newline
        .replace(/\n\n/g, "\n"); // Convert double newlines to single

      current.value.content = normalizedContent;

      // Sync current entry to allEntries for calendar reactivity
      const index = allEntries.value.findIndex(
        (e) => e.date.getTime() === current.value?.date.getTime()
      );
      if (index >= 0) {
        allEntries.value[index] = current.value;
      } else {
        allEntries.value.push(current.value);
      }

      debouncedSave();
    }
  };

  const saveCurrent = async () => {
    if (window.ipcRenderer && current.value) {
      const result = await window.ipcRenderer.saveEntry(toRaw(current.value));

      if (result?.success) {
        const metricsStore = useMetricsStore();
        metricsStore.refreshMetrics();
      }

      return result;
    }
  };

  const saveCurrentWithToast = () => {
    toast.promise(saveCurrent, {
      loading: "Saving entry...",
      success: (result: VoidResult | undefined) => {
        if (result?.success) {
          return "Entry saved successfully";
        }
        return "Entry saved";
      },
      error: (err: { error?: string }) => {
        return err?.error || "Failed to save entry";
      }
    });
  };

  const getEntry = async (date: Date) => {
    if (window.ipcRenderer) {
      const result = await window.ipcRenderer.getEntry(date);

      if (result.success) {
        setCurrent(result.data);
      }
    }
  };

  const getPreviousEntry = async () => {
    if (window.ipcRenderer && current.value) {
      const result = await window.ipcRenderer.getPreviousEntry(current.value.date);

      if (result.success) {
        setCurrent(result.data);
      }
    }
  };

  const getNextEntry = async () => {
    if (window.ipcRenderer && current.value) {
      const result = await window.ipcRenderer.getNextEntry(current.value.date);

      if (result.success) {
        setCurrent(result.data);
      }
    }
  };

  const setAllEntries = (entries: JournalEntry[] | null) => {
    allEntries.value = entries ?? [];
  };

  const getAllEntries = async () => {
    if (window.ipcRenderer) {
      const result = await window.ipcRenderer.getEntries();

      if (result.success) {
        setAllEntries(result.data);
      }
    }
  };

  const debouncedSave = useDebounceFn(saveCurrent, 1000);

  const rescanLibrary = async () => {
    if (window.ipcRenderer) {
      // Get all entries from the new location
      await getAllEntries();

      // Get/create today's entry and set it as current (just like app startup)
      await getEntry(new Date());
    }
  };

  return {
    current,
    setCurrent,
    updateContent,
    saveCurrent,
    saveCurrentWithToast,
    getEntry,
    getPreviousEntry,
    getNextEntry,
    allEntries,
    getAllEntries,
    rescanLibrary
  };
});
