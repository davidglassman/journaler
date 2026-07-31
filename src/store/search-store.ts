import { defineStore } from "pinia";
import { ref } from "vue";

export interface PendingReveal {
  startOffset: number;
  endOffset: number;
}

export const useSearchStore = defineStore("search", () => {
  // ------------------------ Variables

  const isOpen = ref(false);
  const query = ref("");
  const selectedIndex = ref(0);
  const pendingReveal = ref<PendingReveal | null>(null);

  // ------------------------ Functions

  const open = () => {
    query.value = "";
    selectedIndex.value = 0;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const setQuery = (value: string) => {
    query.value = value;
    selectedIndex.value = 0;
  };

  const selectIndex = (index: number) => {
    selectedIndex.value = index;
  };

  const moveSelection = (delta: number, resultCount: number) => {
    if (resultCount <= 0) {
      selectedIndex.value = 0;
      return;
    }

    const next = selectedIndex.value + delta;

    if (next < 0) {
      selectedIndex.value = resultCount - 1;
    } else if (next >= resultCount) {
      selectedIndex.value = 0;
    } else {
      selectedIndex.value = next;
    }
  };

  const setPendingReveal = (reveal: PendingReveal | null) => {
    pendingReveal.value = reveal;
  };

  const clearPendingReveal = () => {
    pendingReveal.value = null;
  };

  // ------------------------ Return

  return {
    isOpen,
    query,
    selectedIndex,
    pendingReveal,
    open,
    close,
    setQuery,
    selectIndex,
    moveSelection,
    setPendingReveal,
    clearPendingReveal
  };
});
