<template>
  <div
    v-if="showScrollbar"
    class="custom-scrollbar"
    :class="{ 'scrollbar-isVisible': isVisible }"
    :style="{
      top: `${containerTop}px`,
      height: `${containerHeight}px`,
      right: `${containerRight}px`
    }"
    @mousedown="handleTrackClick"
    @mouseenter="handleMouseEnter">
    <div
      class="custom-scrollbar-thumb"
      :style="{ height: `${thumbHeight}px`, top: `${thumbTop}px` }"
      @mousedown.stop="handleThumbMouseDown" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

// ------------------------ Props

const props = withDefaults(
  defineProps<{
    scrollContainer: HTMLElement | null;
    alignToViewport?: boolean;
  }>(),
  {
    alignToViewport: true
  }
);

// ------------------------ Variables

// ---------- Dimensions / Scroll Position

const scrollHeight = ref(0);
const clientHeight = ref(0);
const scrollTop = ref(0);
const containerTop = ref(0);
const containerHeight = ref(0);
const containerRight = ref(0);

// ---------- Track Drag State

const isDragging = ref(false);
const dragStartY = ref(0);
const dragStartScrollTop = ref(0);

// ---------- Inactivity

const isVisible = ref(true);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

// ---------- Content / DOM Observers

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

// ------------------------ Computed

const showScrollbar = computed(() => scrollHeight.value > clientHeight.value);

const thumbHeight = computed(() => {
  if (!showScrollbar.value) return 0;

  const ratio = clientHeight.value / scrollHeight.value;

  return Math.max(clientHeight.value * ratio, 40);
});

const thumbTop = computed(() => {
  if (!showScrollbar.value) return 0;

  const maxScroll = scrollHeight.value - clientHeight.value;
  const scrollRatio = scrollTop.value / maxScroll;
  const maxThumbTop = clientHeight.value - thumbHeight.value;

  return scrollRatio * maxThumbTop;
});

// ------------------------ Helpers

const resetHideTimer = () => {
  isVisible.value = true;

  if (hideTimer) {
    clearTimeout(hideTimer);
  }

  hideTimer = setTimeout(() => {
    isVisible.value = false;
  }, 2000);
};

const updateScrollMetrics = () => {
  if (!props.scrollContainer) return;

  const rect = props.scrollContainer.getBoundingClientRect();

  scrollHeight.value = props.scrollContainer.scrollHeight;
  clientHeight.value = props.scrollContainer.clientHeight;
  scrollTop.value = props.scrollContainer.scrollTop;
  containerTop.value = rect.top;
  containerHeight.value = rect.height;

  if (props.alignToViewport) {
    containerRight.value = 8;
  } else {
    containerRight.value = window.innerWidth - rect.right + 8;
  }
};

// ------------------------ Event Handlers

const handleScroll = () => {
  updateScrollMetrics();
  resetHideTimer();
};

const handleWindowScroll = () => {
  updateScrollMetrics();
};

const handleMouseEnter = () => {
  resetHideTimer();
};

const handleTrackClick = (e: MouseEvent) => {
  if (!props.scrollContainer) return;

  const target = e.target as HTMLElement;

  if (target.classList.contains("custom-scrollbar-thumb")) return;

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const clickRatio = clickY / clientHeight.value;
  const newScrollTop = clickRatio * scrollHeight.value;

  const container = props.scrollContainer;

  container.scrollTo({
    top: newScrollTop,
    behavior: "smooth"
  });
};

const handleThumbMouseDown = (e: MouseEvent) => {
  isDragging.value = true;
  dragStartY.value = e.clientY;
  dragStartScrollTop.value = scrollTop.value;
  document.body.style.userSelect = "none";
  e.preventDefault();
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !props.scrollContainer) return;

  const deltaY = e.clientY - dragStartY.value;

  const maxScroll = scrollHeight.value - clientHeight.value;
  const maxThumbTop = clientHeight.value - thumbHeight.value;
  const scrollRatio = deltaY / maxThumbTop;
  const newScrollTop = dragStartScrollTop.value + scrollRatio * maxScroll;

  const container = props.scrollContainer;

  container.scrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.body.style.userSelect = "";
};

// ------------------------ Lifecycle

onMounted(() => {
  if (props.scrollContainer) {
    props.scrollContainer.addEventListener("scroll", handleScroll);

    updateScrollMetrics();
    resetHideTimer();

    resizeObserver = new ResizeObserver(() => {
      updateScrollMetrics();
    });

    resizeObserver.observe(props.scrollContainer);

    const childNodes = props.scrollContainer.children;

    for (const child of childNodes) {
      resizeObserver.observe(child);
    }

    mutationObserver = new MutationObserver(() => {
      updateScrollMetrics();
      resetHideTimer();
    });

    mutationObserver.observe(props.scrollContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("scroll", handleWindowScroll);
  window.addEventListener("resize", updateScrollMetrics);
});

onBeforeUnmount(() => {
  if (hideTimer) {
    clearTimeout(hideTimer);
  }

  if (props.scrollContainer) {
    props.scrollContainer.removeEventListener("scroll", handleScroll);
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  if (mutationObserver) {
    mutationObserver.disconnect();
  }

  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("scroll", handleWindowScroll);
  window.removeEventListener("resize", updateScrollMetrics);
});

// ------------------------ Watch

watch(
  () => props.scrollContainer,
  (newVal, oldVal) => {
    if (oldVal) {
      oldVal.removeEventListener("scroll", handleScroll);
    }

    if (newVal) {
      newVal.addEventListener("scroll", handleScroll);
      updateScrollMetrics();
    }
  }
);
</script>

<style scoped>
.custom-scrollbar {
  position: fixed;
  width: 6px;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-scrollbar.scrollbar-isVisible {
  opacity: 1;
}

.custom-scrollbar-thumb {
  position: absolute;
  right: 0;
  width: 3px;
  background-color: #c5c5c5;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.dark .custom-scrollbar-thumb {
  background-color: #52525b;
}

.custom-scrollbar-thumb:hover {
  background-color: #a0a0a0;
}

.dark .custom-scrollbar-thumb:hover {
  background-color: #71717a;
}

.custom-scrollbar-thumb:active {
  background-color: #a0a0a0;
}

.dark .custom-scrollbar-thumb:active {
  background-color: #71717a;
}
</style>
