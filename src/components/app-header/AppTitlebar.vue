<template>
  <div class="titlebar absolute top-0 left-0 z-40 flex h-10 w-full flex-row"></div>
</template>

<script setup lang="ts">
import { useEditorStore } from "@/store/editor-store";
import { useSideMenuStore } from "@/store/side-menu-store";
import { onBeforeUnmount, onMounted } from "vue";

const editorStore = useEditorStore();
const sideMenuStore = useSideMenuStore();

const handlePointerMove = (e: PointerEvent) => {
  // Show chrome when mouse is in the top 40px (titlebar area)
  if (e.clientY <= 40 && !sideMenuStore.isVisible) {
    editorStore.setIsTyping(false);
  }
};

onMounted(() => {
  // Use pointermove with capture to intercept events before drag region consumes them
  document.addEventListener("pointermove", handlePointerMove, { capture: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("pointermove", handlePointerMove, { capture: true });
});
</script>

<style scoped>
.titlebar {
  -webkit-app-region: drag;
}

.titlebar button {
  -webkit-app-region: no-drag;
}

.titlebar switch {
  -webkit-app-region: no-drag;
}
</style>
