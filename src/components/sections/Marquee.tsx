import { site } from "@/lib/site";

/**
 * A slow, continuous strip of the working stack between the hero and the
 * first section. Duplicated once so the loop is seamless; the copy is
 * hidden from assistive tech, and hover or reduced motion stops it.
 */
export function Marquee({ label }: { label: string }) {
  const items = site.stack;
  return (
    <div
      role="group"
      aria-label={label}
      className="marquee relative overflow-hidden border-y border-line/70 bg-ink/40 py-5"
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((t) => (
              <li
                key={t}
                className="flex items-center font-display text-lg font-medium text-muted transition-colors duration-200 hover:text-text-strong sm:text-xl"
              >
                <span className="px-6 sm:px-9">{t}</span>
                <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-bg to-transparent sm:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-bg to-transparent sm:w-40"
      />
    </div>
  );
}
