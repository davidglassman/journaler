<template>
  <main
    ref="scrollContainer"
    class="scroll-container w-full tracking-widest">
    <EditorContent :editor="editor" />
  </main>

  <CustomScrollbar :scroll-container="scrollContainer" />
</template>

<script setup lang="ts">
import CustomScrollbar from "@/components/shared/scrollbar/CustomScrollbar.vue";
import { FocusParagraph } from "@/lib/editor/focus-paragraph.js";
import { useEditorStore } from "@/store/editor-store";
import { useJournalStore } from "@/store/journal-store";
import { useSettingsStore } from "@/store/settings-store";
import { BackgroundColor, TextStyle } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface EditorWithFocusMode extends Editor {
  commands: Editor["commands"] & {
    setFocusMode: (enabled: boolean) => boolean;
  };
}

// ------------------------ Props

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

// ------------------------ Emits

const emit = defineEmits(["update:modelValue"]);

// ------------------------ Variables

const editor = ref<Editor>();
const spellcheck = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);
const isSettingContent = ref(false);

const { setIsTyping } = useEditorStore();
const { focusMode } = storeToRefs(useEditorStore());
const journalStore = useJournalStore();

const { fontSize, textWidth, paragraphSpacing } = storeToRefs(useSettingsStore());

// ------------------------ Helpers

const scrollToCursor = (smooth = true) => {
  if (!editor.value || !scrollContainer.value) return;

  const editorInstance = editor.value;
  const container = scrollContainer.value;

  requestAnimationFrame(() => {
    const { view } = editorInstance;

    const { state } = view;

    const { from } = state.selection;

    const coords = view.coordsAtPos(from);

    const containerRect = container.getBoundingClientRect();

    // Use the visible height of the container (what's actually visible in viewport)
    // The container might extend beyond the viewport, so use the actual visible portion
    const viewportHeight = window.innerHeight;
    const visibleTop = Math.max(0, containerRect.top);
    const visibleBottom = Math.min(viewportHeight, containerRect.bottom);
    const visibleHeight = visibleBottom - visibleTop;

    // The center of the visible area, adjusted for titlebar area
    // Users perceive center as center of content area, not including titlebar
    const titlebarOffset = 60;
    const visibleCenterY = visibleTop + visibleHeight / 2 - titlebarOffset / 2;

    // Use the vertical center of the cursor line
    const cursorVerticalCenter = (coords.top + coords.bottom) / 2;

    // How far the cursor center is from the visible center
    const offsetFromCenter = cursorVerticalCenter - visibleCenterY;

    // Adjust scroll to bring cursor to visible center
    const newScrollTop = container.scrollTop + offsetFromCenter;

    container.scrollTo({
      top: newScrollTop,
      behavior: smooth ? "smooth" : "auto"
    });
  });
};

// ------------------------ Lifecycle

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      TextStyle,
      BackgroundColor,
      FocusParagraph.configure({
        enabled: focusMode.value
      })
    ],
    content: props.modelValue,
    autofocus: "end",
    editorProps: {
      attributes: {
        spellcheck: spellcheck.value.toString(),
        class: "text-lg p-4 mb-12"
      }
    },

    onCreate: () => {
      // Scroll to center the cursor after editor is created and content is rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToCursor(false);
        });
      });
    },

    onUpdate: () => {
      emit("update:modelValue", editor.value?.getHTML());

      setIsTyping(true);
      scrollToCursor(!isSettingContent.value);

      if (editor.value) {
        journalStore.updateContent(editor.value?.getText());
      }
    }
  });

  editor.value?.view.dom.style.setProperty("--paragraph-spacing", `${paragraphSpacing.value}px`);
  editor.value?.view.dom.style.setProperty("--font-size", `${fontSize.value}px`);
  scrollContainer.value?.style.setProperty("--text-width", `${textWidth.value}px`);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// ------------------------ Watch

watch(
  () => props.modelValue,

  (value) => {
    if (!editor.value) return;

    const isSame = editor.value.getHTML() === value;

    if (isSame) {
      return;
    }

    isSettingContent.value = true;
    editor.value.commands.setContent(value, { emitUpdate: false });

    // Scroll to top after content is set (when switching entries)
    requestAnimationFrame(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTo({ top: 0, behavior: "auto" });
      }
      isSettingContent.value = false;
    });
  }
);

watch(spellcheck, (value) => {
  if (editor.value) {
    editor.value.view.dom.setAttribute("spellcheck", value.toString());
  }
});

watch(paragraphSpacing, (value) => {
  if (editor.value) {
    editor.value.view.dom.style.setProperty("--paragraph-spacing", `${value}px`);
  }
});

watch(fontSize, (value) => {
  if (editor.value) {
    editor.value.view.dom.style.setProperty("--font-size", `${value}px`);
  }
});

watch(textWidth, (value) => {
  if (scrollContainer.value) {
    scrollContainer.value.style.setProperty("--text-width", `${value}px`);
  }
});

watch(focusMode, (value) => {
  if (editor.value) {
    (editor.value as EditorWithFocusMode).commands.setFocusMode(value);
  }
});

// ------------------------ Methods

const focusEnd = () => {
  if (!editor.value) return;

  const { doc } = editor.value.state;
  const endPos = doc.content.size;

  editor.value.chain().focus().setTextSelection(endPos).run();
};

// ------------------------ Expose

defineExpose({
  spellcheck,
  paragraphSpacing,
  focusEnd
});
</script>

<style scoped></style>
