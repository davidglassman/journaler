import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-isVisible:border-zinc-950 focus-isVisible:ring-zinc-950/50 focus-isVisible:ring-[3px] aria-invalid:ring-red-500/20 aria-invalid:border-red-500 dark:focus-isVisible:border-zinc-300 dark:focus-isVisible:ring-zinc-300/50 dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 shadow-xs hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
        destructive:
          "bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-isVisible:ring-red-500/20 dark:bg-red-900 dark:hover:bg-red-900/90 dark:focus-isVisible:ring-red-900/40",
        outline:
          "border-1 border-zinc-300 bg-zinc-50 shadow-xs hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:bg-zinc-800/35 dark:hover:text-zinc-300",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
