<template>
  <div class="flex w-full grow flex-col">
    <button
      v-for="item in items"
      :key="item.name"
      class="flex w-full flex-row items-center gap-3 rounded-md p-2 px-3 text-zinc-500 hover:bg-zinc-200 dark:text-zinc-300/80 dark:hover:bg-zinc-800"
      @click="item.action()">
      <!-- Icon -->

      <component :is="item.icon" />

      <!-- Name -->

      <p class="text-sm font-normal">
        {{ item.name }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useJournalStore } from "@/store/journal-store";
import { useSlidePanelStore } from "@/store/slide-panel-store";
import type { FunctionalComponent } from "vue";
import { toast } from "vue-sonner";
import IconChart from "~icons/mdi/bar-chart";
import IconExport from "~icons/mdi/download-outline";
import IconPrintCurrent from "~icons/mdi/file-document-outline";
import IconPrint from "~icons/mdi/printer-outline";
import IconSettings from "~icons/mdi/settings-outline";

// ------------------------ Interfaces

interface SideMenuItem {
  name: string;
  icon: FunctionalComponent;
  action: () => void;
}

// ------------------------ Variables

const slidePanelStore = useSlidePanelStore();
const journalStore = useJournalStore();

// ------------------------ Functions

async function handleExport() {
  try {
    if (!window.ipcRenderer) {
      toast.error("Export failed", {
        description: "IPC renderer not available"
      });

      return;
    }

    const result = await window.ipcRenderer.exportEntries();

    if (!result.success) {
      if (result.error && result.error !== "cancelled") {
        toast.error("Export failed", {
          description: result.error
        });
      }

      return;
    }

    toast.success("Export successful", {
      description: "Your journal entries have been exported"
    });
  } catch (err) {
    toast.error("Export failed", {
      description: err instanceof Error ? err.message : "An unknown error occurred"
    });
  }
}

async function handlePrintAll() {
  try {
    if (!window.ipcRenderer) {
      toast.error("PDF export failed", {
        description: "IPC renderer not available"
      });

      return;
    }

    const printFontSize = 12;
    const printFontFamily = "Geist, system-ui, sans-serif";

    const result = await window.ipcRenderer.printEntries(printFontSize, printFontFamily);

    if (!result.success) {
      if (result.error && result.error !== "cancelled") {
        toast.error("PDF export failed", {
          description: result.error
        });
      }

      return;
    }

    toast.success("PDF saved successfully", {
      description: "Your journal has been exported as a PDF"
    });
  } catch (err) {
    toast.error("PDF export failed", {
      description: err instanceof Error ? err.message : "An unknown error occurred"
    });
  }
}

async function handlePrintCurrent() {
  try {
    if (!window.ipcRenderer) {
      toast.error("PDF export failed", {
        description: "IPC renderer not available"
      });

      return;
    }

    if (!journalStore.current) {
      toast.error("PDF export failed", {
        description: "No entry is currently selected"
      });

      return;
    }

    const printFontSize = 12;
    const printFontFamily = "Geist, system-ui, sans-serif";

    const result = await window.ipcRenderer.printCurrentEntry(
      journalStore.current.date,
      printFontSize,
      printFontFamily
    );

    if (!result.success) {
      if (result.error && result.error !== "cancelled") {
        toast.error("PDF export failed", {
          description: result.error
        });
      }

      return;
    }

    toast.success("PDF saved successfully", {
      description: "Entry has been exported as a PDF"
    });
  } catch (err) {
    toast.error("PDF export failed", {
      description: err instanceof Error ? err.message : "An unknown error occurred"
    });
  }
}

const items: SideMenuItem[] = [
  {
    name: "Export",
    icon: IconExport,
    action: handleExport
  },
  {
    name: "Print All",
    icon: IconPrint,
    action: handlePrintAll
  },
  {
    name: "Print Current",
    icon: IconPrintCurrent,
    action: handlePrintCurrent
  },
  {
    name: "Metrics",
    icon: IconChart,
    action: () => {
      slidePanelStore.togglePanel("metrics");
    }
  },
  {
    name: "Settings",
    icon: IconSettings,
    action: () => {
      slidePanelStore.togglePanel("settings");
    }
  }
];
</script>

<style scoped></style>
