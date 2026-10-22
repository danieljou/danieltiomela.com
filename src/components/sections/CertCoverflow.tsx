"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Cert {
  group: string;
  name: string;
  provider: string;
  date: string;
}

const STEP = 68; // % of a card's width between neighbours

/**
 * Certifications as a 3D coverflow: the current one faces you, the rest fan
 * away in depth. Every certification stays in the DOM, in the CV's own order,
 * as a list; the buttons and arrow keys are the real controls, a click or a
 * swipe on a side card is only a shortcut. Reduced motion keeps the layout
 * and drops the easing (see globals.css).
 */
export function CertCoverflow({
  certs,
  previousLabel,
  nextLabel,
  label,
}: {
  certs: Cert[];
  previousLabel: string;
  nextLabel: string;
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const drag = useRef<number | null>(null);
  const last = certs.length - 1;
  const go = (i: number) => setIndex(Math.min(last, Math.max(0, i)));

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div
        className="scene3d relative h-72 touch-pan-y sm:h-64"
        style={{ perspective: "1500px" }}
        onPointerDown={(e) => {
          drag.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (drag.current === null) return;
          const dx = e.clientX - drag.current;
          drag.current = null;
          if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <ul className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {certs.map((c, i) => {
            const off = i - index;
            const abs = Math.abs(off);
            const current = off === 0;
            return (
              <li
                key={c.name}
                aria-current={current ? "true" : undefined}
                onClick={() => !current && go(i)}
                style={
                  {
                    "--tx": `${off * STEP}%`,
                    "--tz": `${-abs * 130}px`,
                    "--rot": `${Math.max(-1, Math.min(1, off)) * -34}deg`,
                    "--sc": current ? 1 : 0.92,
                    // Distance dims with brightness, not opacity: a see-through
                    // card lets the card behind it bleed through its text.
                    "--br": 1 - Math.min(abs, 3) * 0.2,
                    "--op": abs > 3 ? 0 : 1,
                    zIndex: 10 - abs,
                  } as React.CSSProperties
                }
                className={cn(
                  "coverflow-card absolute left-1/2 top-0 -ml-[min(11rem,42vw)] w-[min(22rem,84vw)]",
                  "rounded-lg border bg-surface p-6 shadow-photo",
                  current
                    ? "border-secondary/50 bg-surface-2"
                    : "cursor-pointer border-line hover:border-line-strong",
                  abs > 3 && "pointer-events-none",
                )}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-secondary-text">
                  {c.group}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{c.name}</h3>
                <p className="mt-4 text-sm text-muted">{c.provider}</p>
                <p className="mt-1 font-mono text-xs tabular-nums text-faint">{c.date}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={previousLabel}
          className="grid size-11 place-items-center rounded-full border border-line text-text transition-colors duration-200 hover:border-line-strong disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="min-w-16 text-center font-mono text-sm tabular-nums text-muted" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(certs.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label={nextLabel}
          className="grid size-11 place-items-center rounded-full border border-line text-text transition-colors duration-200 hover:border-line-strong disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
