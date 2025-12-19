<template>
  <div class="h-screen w-screen">
    <div class="h-screen w-screen">
      <AppTitlebar />
      <AppWindowControls v-if="!isMac" />

      <div class="flex size-full flex-row">
        <div class="relative flex w-auto flex-row items-center">
          <SideMenu class="z-10" />
          <SlidePanel class="z-0" />

          <button
            class="z-40 flex h-10 w-8 cursor-pointer items-center justify-center rounded-r-full bg-zinc-700 text-white transition-opacity duration-200 hover:bg-zinc-600"
            :class="
              editorStore.chromeVisible || sideMenuStore.isVisible
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            "
            @click="sideMenuStore.setIsVisible(!sideMenuStore.isVisible)">
            <IconChevronLeft
              v-if="sideMenuStore.isVisible"
              class="-ml-1 size-5" />
            <IconChevronRight
              v-else
              class="-ml-1 size-5" />
          </button>
        </div>

        <EditorArea />
      </div>

      <Toaster
        :toast-options="{
          class: 'toast'
        }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTitlebar from "@/components/app-header/AppTitlebar.vue";
import AppWindowControls from "@/components/app-header/AppWindowControls.vue";
import EditorArea from "@/components/editor/EditorArea.vue";
import SideMenu from "@/components/side-menu/SideMenu.vue";
import SlidePanel from "@/components/slide-panel/SlidePanel.vue";
import { Toaster } from "@/components/ui/sonner";
import { useAccentColor } from "@/composables/use-accent-color";
import { usePlatform } from "@/composables/use-platform";
import { useTheme } from "@/composables/use-theme";
import { useEditorStore } from "@/store/editor-store";
import { useJournalStore } from "@/store/journal-store";
import { useSettingsStore } from "@/store/settings-store";
import { useSideMenuStore } from "@/store/side-menu-store";
import { onMounted } from "vue";
import IconChevronLeft from "~icons/mdi/chevron-left";
import IconChevronRight from "~icons/mdi/chevron-right";

// ------------------------ Variables

const { isMac } = usePlatform();

useTheme(); // Initialize theme sync on app startup
useAccentColor(); // Initialize accent color sync on app startup

const settingsStore = useSettingsStore();
const journalStore = useJournalStore();
const editorStore = useEditorStore();
const sideMenuStore = useSideMenuStore();

onMounted(async () => {
  if (window.ipcRenderer) {
    const response = await settingsStore.loadSettings();

    if (response.success) {
      journalStore.getEntry(new Date());
      editorStore.setFocusMode(false);
    }

    await journalStore.getAllEntries();
  }
});
</script>
