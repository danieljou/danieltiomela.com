import { cn } from "@/lib/utils";
import { AnimatedValue } from "@/components/motion/AnimatedValue";

/**
 * The DT mark, inline so it inherits colour and never costs a request.
 * Geometry is copied verbatim from the brand system  never redrawn.
 */
export function Monogram({
  className,
  gradient = true,
  title,
}: {
  className?: string;
  gradient?: boolean;
  /** Give a title only when the mark is the sole label for a link. */
  title?: string;
}) {
  const id = gradient ? "dt-mark-gradient" : undefined;
  return (
    <svg
      viewBox="0 0 100 60"
      className={cn("h-auto w-full", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {gradient && (
        <defs>
          <linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            x1="6"
            y1="4"
            x2="94"
            y2="56"
          >
            <stop offset="0" stopColor="#2F6BFF" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      )}
      <g
        fill="none"
        stroke={gradient ? `url(#${id})` : "currentColor"}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 52 V8 H16 A22 22 0 0 1 16 52 Z" />
        <path d="M54 8 H92" />
        <path d="M73 8 V52" />
      </g>
    </svg>
  );
}

/** The atom of every architecture drawing. */
export function Node({
  muted = false,
  className,
}: {
  muted?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-2.5 shrink-0 rounded-full",
        muted
          ? "bg-faint shadow-[0_0_0_5px_rgba(92,110,142,0.12)]"
          : "bg-secondary shadow-[0_0_0_5px_rgba(34,211,238,0.14)]",
        className,
      )}
    />
  );
}

export function Connection({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-px min-w-6 flex-1",
        "bg-[linear-gradient(90deg,#22304F_0%,#2D3F66_50%,#22304F_100%)]",
        className,
      )}
    />
  );
}

/** One block in an architecture row. Names what it does, not what runs it. */
export function ArchBlock({
  name,
  kind,
  active = false,
  className,
}: {
  name: string;
  kind: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md",
        "border px-4 py-3 text-center",
        active
          ? "border-secondary/40 bg-secondary/[0.06]"
          : "border-line bg-surface",
        className,
      )}
    >
      <span className="font-display text-sm font-semibold text-text-strong">
        {name}
      </span>
      <span
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.14em]",
          active ? "text-secondary-text" : "text-faint",
        )}
      >
        {kind}
      </span>
    </div>
  );
}

/** A number, set in the display face and left alone. Never a gauge. */
export function Metric({
  value,
  label,
  note,
  gradient = false,
}: {
  value: string;
  label: string;
  note?: string;
  gradient?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <AnimatedValue
        value={value}
        className={cn(
          "font-display text-4xl font-bold leading-none tracking-[-0.03em] tabular-nums sm:text-5xl",
          gradient ? "grad-text" : "text-text-strong",
        )}
      />
      <span className="font-mono text-[11.5px] uppercase tracking-[0.15em] text-muted">
        {label}
      </span>
      {note && (
        <span className="text-[13px] leading-snug text-faint">{note}</span>
      )}
    </div>
  );
}

/** Background layers. Decorative by definition, so hidden from assistive tech. */
export function Trace({
  className,
  opacity = 0.4,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={cn("pointer-events-none absolute inset-0 trace-bg", className)}
    />
  );
}

export function Glow({
  tone = "blue",
  className,
  style,
}: {
  tone?: "blue" | "cyan" | "violet";
  className?: string;
  style?: React.CSSProperties;
}) {
  const tones = {
    blue: "bg-[rgba(47,107,255,0.40)]",
    cyan: "bg-[rgba(34,211,238,0.28)]",
    violet: "bg-[rgba(124,92,255,0.24)]",
  };
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "pointer-events-none absolute rounded-full blur-[96px]",
        tones[tone],
        className,
      )}
    />
  );
}
