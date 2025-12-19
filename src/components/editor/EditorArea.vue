<template>
  <div
    class="flex h-full w-full flex-row justify-center pt-12"
    @click="handleClick">
    <div
      class="absolute top-0 left-0 z-30 h-8 w-full bg-transparent"
      style="pointer-events: auto"
      @mouseenter="handleMouseEnter" />
    <div
      v-if="!sideMenuStore.isVisible"
      class="absolute top-10 left-0 z-30 bg-transparent"
      style="height: calc(100% - 2.5rem); width: 5rem; pointer-events: auto"
      @mouseenter="handleMouseEnter" />

    <TextEditor
      ref="textEditorRef"
      v-model="editorStore.content" />
  </div>
</template>

<script setup lang="ts">
import TextEditor from "@/components/editor/TextEditor.vue";
import { useEditorStore } from "@/store/editor-store";
import { useSideMenuStore } from "@/store/side-menu-store";
import { ref } from "vue";

// ------------------------ Variables

const sideMenuStore = useSideMenuStore();
const editorStore = useEditorStore();

// ------------------------ Handlers

const handleClick = () => {
  if (sideMenuStore.isVisible) {
    // TODO: removed for now. may introduce setting in future to drive whether side menu automatically closes when clicking on the editor
    // I found it was useful to have the calendar open to easily switch between entries as I'm typing/editing instead of the side menu always closing automatically
    //sideMenuStore.setIsVisible(false);
  }
};

const handleMouseEnter = () => {
  if (!sideMenuStore.isVisible) {
    editorStore.setIsTyping(false);
  }
};

// ------------------------ Editor Ref

const textEditorRef = ref<{ focusEnd: () => void } | null>(null);

const focusEnd = () => {
  textEditorRef.value?.focusEnd();
};

// ------------------------ Expose

defineExpose({
  focusEnd
});
</script>

<style scoped></style>
