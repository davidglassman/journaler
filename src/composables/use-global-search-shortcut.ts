import { useSearchStore } from "@/store/search-store";
import { onMounted, onUnmounted } from "vue";

/**
 * Capture-phase Cmd/Ctrl+F opens global search; Escape closes when open.
 * Wins over TipTap while the editor is focused.
 */
export function useGlobalSearchShortcut() {
  const searchStore = useSearchStore();

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if ((event.metaKey || event.ctrlKey) && key === "f") {
      event.preventDefault();
      event.stopPropagation();
      searchStore.open();
      return;
    }

    if (key === "escape" && searchStore.isOpen) {
      event.preventDefault();
      event.stopPropagation();
      searchStore.close();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", onKeyDown, true);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown, true);
  });
}
