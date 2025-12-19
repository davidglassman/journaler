<template>
  <Transition
    enter-active-class="transition-all duration-50 ease-out"
    leave-active-class="transition-all duration-50 ease-in"
    enter-from-class="-translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="-translate-y-full">
    <div
      v-show="titlebarStore.isVisible"
      class="fixed top-0 right-0 z-50 flex h-10 flex-row gap-0">
      <!-- Minimize Button -->

      <button
        class="h-10 px-4 hover:bg-zinc-300 active:bg-zinc-400 active:hover:bg-zinc-700 dark:hover:bg-zinc-800"
        title="Minimize"
        @click="minimize">
        <IconMinimize class="size-4 text-zinc-700 dark:text-zinc-300" />
      </button>

      <!-- Maximize Button -->

      <button
        class="h-10 px-4 hover:bg-zinc-300 active:bg-zinc-400 active:hover:bg-zinc-700 dark:hover:bg-zinc-800"
        title="Maximize"
        @click="toggleMaximize">
        <IconMaximize
          v-if="!isMaximized"
          class="size-4 text-zinc-700 dark:text-zinc-400" />
        <IconRestore
          v-else
          class="size-3 text-zinc-700 dark:text-zinc-400" />
      </button>

      <!-- Close Button -->

      <button
        class="group h-10 px-4 hover:bg-red-500 active:bg-red-600"
        title="Close"
        @click="close">
        <IconClose class="size-4 group-hover:text-zinc-100 dark:text-zinc-400" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useWindowControls } from "@/composables/use-window-controls";
import { useTitlebarStore } from "@/store/titlebar-store";
import IconRestore from "~icons/fluent-mdl2/chrome-restore";
import IconClose from "~icons/mdi/close";
import IconMaximize from "~icons/mdi/maximize";
import IconMinimize from "~icons/mdi/minimize";

// ------------------------ Variables

const titlebarStore = useTitlebarStore();
const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();
</script>

<style scoped>
button {
  @apply transition-colors duration-100;
  -webkit-app-region: no-drag;
}

.drag-region {
  -webkit-app-region: drag;
}
</style>
