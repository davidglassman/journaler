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
import { useSearchStore } from "@/store/search-store";
import { useSettingsStore } from "@/store/settings-store";
import { BackgroundColor, TextStyle } from "@tiptap/extension-text-style";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
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
const searchStore = useSearchStore();

const { fontSize, textWidth, paragraphSpacing } = storeToRefs(useSettingsStore());

let highlightClearTimer: ReturnType<typeof setTimeout> | null = null;

// ------------------------ Helpers

/**
 * Map a plain-text offset (JournalEntry.content / textToHtml rules) to a
 * ProseMirror document position. Blocks are separated by a single `\n`.
 */
const mapPlainOffsetToPos = (doc: ProseMirrorNode, targetOffset: number): number | null => {
  if (targetOffset < 0) return null;

  let plainOffset = 0;
  let isFirstBlock = true;
  let result: number | null = null;

  doc.forEach((block, blockPos) => {
    if (result !== null) return;

    if (!isFirstBlock) {
      if (plainOffset === targetOffset) {
        result = blockPos + 1;
        return;
      }
      plainOffset += 1;
    }
    isFirstBlock = false;

    if (plainOffset > targetOffset) return;

    block.descendants((node, posInBlock) => {
      if (result !== null) return false;
      if (!node.isText || !node.text) return;

      const absPos = blockPos + 1 + posInBlock;
      const len = node.text.length;

      if (plainOffset + len >= targetOffset) {
        result = absPos + (targetOffset - plainOffset);
        return false;
      }

      plainOffset += len;
    });
  });

  if (result === null && plainOffset === targetOffset) {
    result = doc.content.size;
  }

  return result;
};

const revealPlainTextRange = (startOffset: number, endOffset: number): boolean => {
  if (!editor.value || endOffset <= startOffset) return false;

  const { doc } = editor.value.state;
  const from = mapPlainOffsetToPos(doc, startOffset);
  const to = mapPlainOffsetToPos(doc, endOffset);

  if (from === null || to === null || to <= from) return false;

  if (highlightClearTimer) {
    clearTimeout(highlightClearTimer);
    highlightClearTimer = null;
  }

  editor.value
    .chain()
    .focus()
    .setTextSelection({ from, to })
    .setBackgroundColor("rgb(var(--accent-300) / 0.55)")
    .run();

  scrollToCursor(true);

  highlightClearTimer = setTimeout(() => {
    if (!editor.value) return;

    editor.value
      .chain()
      .setTextSelection({ from, to })
      .unsetBackgroundColor()
      .setTextSelection(to)
      .run();
    highlightClearTimer = null;
  }, 1500);

  return true;
};

const tryApplyPendingReveal = () => {
  const reveal = searchStore.pendingReveal;

  if (!reveal || !editor.value) return;

  revealPlainTextRange(reveal.startOffset, reveal.endOffset);
  searchStore.clearPendingReveal();
};

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
      if (highlightClearTimer) {
        clearTimeout(highlightClearTimer);
        highlightClearTimer = null;
      }

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
  if (highlightClearTimer) {
    clearTimeout(highlightClearTimer);
    highlightClearTimer = null;
  }
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

watch(
  () => searchStore.pendingReveal,
  (reveal) => {
    if (!reveal || !editor.value) return;

    // Nested rAF: run after setContent → scroll-to-top so reveal is not undone.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tryApplyPendingReveal();
      });
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
  focusEnd,
  revealPlainTextRange
});
</script>

<style scoped></style>
