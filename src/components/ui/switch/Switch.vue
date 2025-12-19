<script setup lang="ts">
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import type { SwitchRootEmits, SwitchRootProps } from "reka-ui";
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";
import type { HTMLAttributes } from "vue";

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes["class"] }>();

const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    data-slot="switch"
    v-bind="forwarded"
    :class="
      cn(
        'peer focus-isVisible:ring-1 focus-isVisible:ring-zinc-500 dark:focus-isVisible:ring-zinc-500 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-800 data-[state=unchecked]:bg-zinc-200 dark:data-[state=checked]:bg-zinc-300 dark:data-[state=unchecked]:bg-zinc-800',
        props.class
      )
    ">
    <SwitchThumb
      data-slot="switch-thumb"
      :class="
        cn(
          'pointer-events-none block size-4 rounded-full bg-zinc-50 ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:bg-zinc-950'
        )
      ">
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
