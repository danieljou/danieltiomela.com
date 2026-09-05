import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("gutter mx-auto w-full max-w-6xl", className)}
      {...props}
    />
  );
}

/**
 * Every section answers the four questions in the same order: where am I
 * (label), what am I looking at (title), why it matters (kicker).
 */
export function SectionHeader({
  label,
  title,
  kicker,
  id,
  className,
  /**
   * `h2` for a section inside a page; `h1` when this header IS the page title.
   * Every route needs exactly one h1  for screen-reader orientation and for
   * the snippet a search engine builds.
   */
  as: Heading = "h2",
}: {
  label?: string;
  title: string;
  kicker?: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {label && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
          {label}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          "mt-3.5 font-bold leading-[1.15]",
          Heading === "h1"
            ? "text-[clamp(2rem,5.5vw,3.25rem)]"
            : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Heading>
      {kicker && (
        <p className="mt-3.5 text-[15px] leading-relaxed text-muted sm:text-base">
          {kicker}
        </p>
      )}
    </header>
  );
}

export function Section({
  className,
  children,
  labelledBy,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement> & { labelledBy?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-24 py-16 sm:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
