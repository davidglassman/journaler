<script setup lang="ts">
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import { ChevronDown } from "lucide-vue-next";
import type { SelectTriggerProps } from "reka-ui";
import { SelectIcon, SelectTrigger, useForwardProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<SelectTriggerProps & { class?: HTMLAttributes["class"]; size?: "sm" | "default" }>(),
  { size: "default" }
);

const delegatedProps = reactiveOmit(props, "class", "size");
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    data-slot="select-trigger"
    :data-size="size"
    v-bind="forwardedProps"
    :class="
      cn(
        'flex w-fit items-center justify-between gap-2 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-zinc-950 focus-visible:ring-[3px] focus-visible:ring-zinc-950/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 data-[placeholder]:text-zinc-500 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:border-zinc-800 dark:bg-zinc-200/30 dark:dark:bg-zinc-800/30 dark:dark:hover:bg-zinc-800/50 dark:hover:bg-zinc-200/50 dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300/50 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-500/40 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:data-[placeholder]:text-zinc-400 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-zinc-500 dark:[&_svg:not([class*=\'text-\'])]:text-zinc-400',
        props.class
      )
    ">
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="size-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
