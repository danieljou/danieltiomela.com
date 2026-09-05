"use client";

import { useEffect, useRef, useState } from "react";

function parseValue(raw: string) {
  const match = raw.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  const decimals = numStr.includes(".") || numStr.includes(",") ? numStr.split(/[.,]/)[1].length : 0;
  return { prefix, num: parseFloat(numStr.replace(",", ".")), decimals, suffix };
}

/**
 * Counts up from zero to `value` once it scrolls into view  once, not on
 * every re-entry. Renders `value` verbatim (no counting) for non-numeric
 * strings, under reduced motion, and before JS has run: the final figure is
 * always what's in the markup, the count-up is a layered enhancement.
 */
export function AnimatedValue({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const parsed = parseValue(value);

  useEffect(() => {
    if (!parsed) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 900;
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) * (1 - t);
          if (t < 1) {
            setDisplay(`${parsed!.prefix}${(parsed!.num * eased).toFixed(parsed!.decimals)}${parsed!.suffix}`);
            requestAnimationFrame(tick);
          } else {
            setDisplay(value);
          }
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
