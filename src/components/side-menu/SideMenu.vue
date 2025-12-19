<template>
  <Transition
    enter-active-class="transition-transform duration-50 ease-out"
    leave-active-class="transition-transform duration-50 ease-in"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full">
    <nav
      v-show="sideMenuStore.isVisible"
      class="relative h-full w-auto">
      <div
        ref="scrollContainer"
        class="scroll-container flex min-h-full flex-col items-start justify-between border-r-1 border-zinc-200 bg-zinc-100 p-6 select-none dark:border-zinc-800 dark:bg-zinc-900">
        <div class="flex w-full grow flex-col items-center justify-start">
          <SideMenuAppInfo />

          <Separator class="my-4" />

          <SideMenuOptions />
        </div>

        <Separator class="my-8" />

        <div class="flex flex-col items-center justify-center">
          <div class="mb-8 w-full">
            <SideMenuEntryInfo />
          </div>

          <div class="mb-6">
            <SideMenuCalendar />
          </div>

          <div class="flex flex-row items-center justify-center gap-2">
            <button
              class="text-right text-xs text-zinc-500 dark:text-zinc-300/80"
              @click="editorStore.setFocusMode(false)">
              Edit
            </button>

            <Switch
              :model-value="editorStore.focusMode"
              @update:model-value="editorStore.setFocusMode" />

            <button
              class="text-left text-xs text-zinc-500 dark:text-zinc-300/80"
              @click="editorStore.setFocusMode(true)">
              Focus
            </button>
          </div>
        </div>
      </div>

      <CustomScrollbar
        :scroll-container="scrollContainer"
        :align-to-viewport="false" />
    </nav>
  </Transition>
</template>

<script setup lang="ts">
import CustomScrollbar from "@/components/shared/scrollbar/CustomScrollbar.vue";
import SideMenuAppInfo from "@/components/side-menu/SideMenuAppInfo.vue";
import SideMenuCalendar from "@/components/side-menu/SideMenuCalendar.vue";
import SideMenuEntryInfo from "@/components/side-menu/SideMenuEntryInfo.vue";
import SideMenuOptions from "@/components/side-menu/SideMenuOptions.vue";
import { Separator } from "@/components/ui/separator";
import Switch from "@/components/ui/switch/Switch.vue";
import { useEditorStore } from "@/store/editor-store";
import { useSideMenuStore } from "@/store/side-menu-store";
import { ref } from "vue";

// ------------------------ Variables

const scrollContainer = ref(null);
const sideMenuStore = useSideMenuStore();
const editorStore = useEditorStore();
</script>

<style scoped></style>
