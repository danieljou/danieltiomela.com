"use client";

import { useEffect, useState } from "react";

/**
 * Real HTML, ticking every second  not a decorative animation (nothing
 * moves visually beyond digits changing), so it isn't gated behind
 * `prefers-reduced-motion` the way the canvas is.
 */
export function LiveClock({ label, className }: { label: string; className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Douala",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{label}</p>
      <p className="font-mono text-lg font-bold tabular-nums text-secondary-text">{time}</p>
    </div>
  );
}
