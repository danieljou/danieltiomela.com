import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full border font-mono leading-tight " +
    "transition-colors duration-200",
  {
    variants: {
      tone: {
        default: "border-line bg-surface text-muted",
        active: "border-secondary/40 bg-secondary/[0.07] text-secondary-text",
      },
      size: {
        sm: "px-2.5 py-1 text-[11px]",
        md: "px-3.5 py-1.5 text-[12.5px]",
      },
    },
    defaultVariants: { tone: "default", size: "md" },
  },
);

export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

/** A technology. The smallest element in the system, on purpose. */
export function Tag({ className, tone, size, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ tone, size }), className)} {...props} />
  );
}

/** A status that is true right now  availability, project state. */
export function Pill({
  children,
  pulse = false,
  className,
}: {
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-secondary/35",
        "bg-secondary/[0.06] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em]",
        "text-secondary-text",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-[7px] shrink-0 rounded-full bg-secondary",
          "shadow-[0_0_0_4px_rgba(34,211,238,0.16)]",
          pulse &&
            "motion-safe:animate-[pulse-node_2.4s_cubic-bezier(.2,.7,.3,1)_infinite]",
        )}
      />
      {children}
    </span>
  );
}
