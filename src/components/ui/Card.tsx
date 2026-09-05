import { cn } from "@/lib/utils";

/**
 * Depth on a dark ground comes from value and a hairline, never from a shadow.
 * `interactive` adds the 2px lift and brighter border used across the site.
 */
export function Card({
  className,
  interactive = false,
  marked = false,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  interactive?: boolean;
  /** The gradient tick at the top-left  the tell that a card belongs here. */
  marked?: boolean;
  /**
   * Constrained to DOM-element tags, not the bare `React.ElementType`  once
   * `@react-three/fiber` is anywhere in the program it globally augments
   * `JSX.IntrinsicElements` with every `three` class, and an unconstrained
   * `ElementType` has to satisfy that whole union too, collapsing props like
   * `className` to `never`.
   */
  as?: React.ElementType<React.HTMLAttributes<HTMLElement>>;
}) {
  return (
    <Tag
      className={cn(
        "relative rounded-lg border border-line bg-surface p-6",
        "transition-[transform,border-color,background-color] duration-200",
        "ease-brand",
        interactive &&
          "hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2 " +
            "focus-within:border-line-strong",
        marked &&
          "before:absolute before:left-6 before:top-0 before:h-0.75 before:w-8 " +
            "before:rounded-b-sm before:content-[''] before:grad-brand",
        className,
      )}
      {...props}
    />
  );
}

export function Separator({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line/55", className)} />;
}

/** The 3px gradient rule. Never thicker. */
export function Rule({
  vertical = false,
  className,
}: {
  vertical?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block rounded-sm grad-brand",
        vertical ? "h-11 w-[3px]" : "h-[3px] w-14",
        className,
      )}
    />
  );
}
