<script setup lang="ts">
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import type { SliderRootEmits, SliderRootProps } from "reka-ui";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<SliderRootProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SliderRoot
    v-slot="{ modelValue }"
    data-slot="slider"
    :class="
      cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        props.class
      )
    "
    v-bind="forwarded">
    <SliderTrack
      data-slot="slider-track"
      class="relative grow overflow-hidden rounded-full bg-zinc-200 data-[orientation='horizontal']:h-1 data-[orientation='horizontal']:w-full data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1 dark:bg-zinc-800">
      <SliderRange
        data-slot="slider-range"
        class="absolute bg-zinc-800 data-[orientation='horizontal']:h-full data-[orientation='vertical']:w-full dark:bg-zinc-300" />
    </SliderTrack>

    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      data-slot="slider-thumb"
      class="focus-isVisible:ring-1 focus-isVisible:outline-hidden block size-4 shrink-0 rounded-full border border-zinc-500 bg-zinc-50 shadow-sm ring-zinc-500 transition-[color,box-shadow] hover:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-950 dark:ring-zinc-500" />
  </SliderRoot>
</template>
