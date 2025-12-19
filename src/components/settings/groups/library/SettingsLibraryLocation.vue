<template>
  <div class="flex w-full flex-col items-start justify-start gap-1">
    <input
      disabled
      class="w-full rounded-md border-1 border-zinc-300 bg-zinc-50 p-1 px-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"
      :value="displayPath" />

    <Button
      variant="outline"
      @click="handleChooseFile">
      Choose
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/store/journal-store";
import { useSettingsStore } from "@/store/settings-store";
import { computed } from "vue";

const settingsStore = useSettingsStore();
const journalStore = useJournalStore();

const displayPath = computed(() => {
  return settingsStore.libraryLocation || "Default (Documents)";
});

const handleChooseFile = async () => {
  if (window.ipcRenderer) {
    const result = await window.ipcRenderer.chooseLibrary();

    if (result.success && result.data) {
      // Update settings with new library location
      settingsStore.setLibraryLocation(result.data);

      // Rescan the library - get all entries and today's entry
      await journalStore.rescanLibrary();
    }
  }
};
</script>

<style scoped></style>
