import { useEditorStore } from "@/store/editor-store";
import { useSlidePanelStore } from "@/store/slide-panel-store";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSideMenuStore = defineStore("side-menu", () => {
  // ------------------------ Variables

  const isVisible = ref(false);

  const editorStore = useEditorStore();
  const slidePanelStore = useSlidePanelStore();

  // ------------------------ Functions

  const setIsVisible = async (state: boolean) => {
    slidePanelStore.close();

    if (state) {
      // Opening sidebar
      // hide titlebar first, wait for it to fully disappear, then show sidebar
      // Use setChromeVisible to keep chromeVisible state in sync, so that
      // refreshDragRegions() is called when closing (see electron bug #6970)

      editorStore.setChromeVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 50));
      isVisible.value = state;
    } else {
      // Closing sidebar
      // hide sidebar first, wait for it to fully disappear, then show titlebar
      // Ensure chrome stays visible - only hide when typing starts AFTER menu is closed

      isVisible.value = state;
      await new Promise((resolve) => setTimeout(resolve, 50));
      editorStore.setChromeVisible(true);
    }
  };

  // ------------------------ Return

  return { isVisible, setIsVisible };
});
