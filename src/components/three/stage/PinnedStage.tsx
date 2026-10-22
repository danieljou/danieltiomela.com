"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Section";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "../useScrollProgress";
import type { StageVariant } from "./StageCanvas";
import type { ScreenData } from "./scenes";

const StageCanvas = dynamic(() => import("./StageCanvas"), { ssr: false });

export interface StageStep {
  title: string;
  body: string;
  tags?: string[];
  href?: string;
  cta?: string;
}

/** Scroll held at each end so the first and last step get time to be read. */
const DWELL = 0.08;
const toStep = (p: number) => Math.min(1, Math.max(0, (p - DWELL) / (1 - 2 * DWELL)));
const fromStep = (s: number) => DWELL + s * (1 - 2 * DWELL);

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * A section turned into a pinned 3D scene: the page holds still while the
 * scroll turns, lifts or slides a real WebGL set piece, one step at a time.
 * Its content is the section's own  the heading, one caption per step with
 * its real link, and a full plain list for assistive tech.
 *
 * Same contract as the hero and the immersive scene: it is only built when
 * the viewport is wide, motion is allowed and WebGL exists. Everyone else
 * (and everyone before hydration) gets `fallback`, the section as ordinary,
 * fully readable page content.
 */
export function PinnedStage({
  id,
  label,
  title,
  kicker,
  steps,
  variant,
  data,
  fallback,
  vhPerStep = 80,
}: {
  id: string;
  label?: string;
  title: string;
  kicker?: string;
  steps: StageStep[];
  variant: StageVariant;
  data?: ScreenData[];
  fallback: React.ReactNode;
  vhPerStep?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const stageProgress = useRef(0);
  const [eligible, setEligible] = useState(false);
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastStep = useRef(0);
  const n = steps.length;

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      setEligible(!reduce && wide && supportsWebGL());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!eligible) return;
    function update() {
      const s = toStep(progress.current);
      stageProgress.current = s;
      const idx = Math.round(s * (n - 1));
      if (idx !== lastStep.current) {
        lastStep.current = idx;
        setStep(idx);
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [eligible, progress, n]);

  // Built when the section first comes near, then kept; it only renders
  // frames while on screen, so six stages cost one running at a time.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !eligible) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eligible]);

  function jumpTo(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const total = rect.height - window.innerHeight;
    window.scrollTo({ top: top + fromStep(i / Math.max(1, n - 1)) * total, behavior: "smooth" });
  }

  if (!eligible) return <>{fallback}</>;

  const current = steps[step];

  return (
    <section
      ref={sectionRef}
      aria-labelledby={id}
      className="relative"
      style={{ height: `${100 + n * vhPerStep}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          {mounted && (
            <StageCanvas
              variant={variant}
              progress={stageProgress}
              count={n}
              titles={steps.map((s) => s.title)}
              data={data}
              active={inView}
              onHover={setHover}
              onSelect={jumpTo}
            />
          )}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-bg via-bg/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b from-bg/80 to-transparent"
        />

        <Container className="pointer-events-none relative z-20 pt-28 sm:pt-32">
          <header className="pointer-events-auto max-w-sm">
            {label && (
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
                <span aria-hidden="true" className="h-px w-8 grad-brand" />
                {label}
              </p>
            )}
            <h2 id={id} className="mt-3.5 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {title}
            </h2>
            {kicker && <p className="mt-3.5 text-[15px] leading-relaxed text-muted">{kicker}</p>}
          </header>
        </Container>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-10 sm:pb-12">
          <Container>
            <div
              key={step}
              className="animate-fade-up pointer-events-auto flex max-w-lg gap-5 rounded-xl border border-line-strong/70 bg-bg/70 p-6 shadow-photo backdrop-blur-xl sm:p-7"
            >
              <p
                aria-hidden="true"
                className="font-display text-5xl font-bold leading-none tabular-nums grad-text sm:text-6xl"
              >
                {String(step + 1).padStart(2, "0")}
              </p>
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-bold">{current.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{current.body}</p>
                {current.tags && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {current.tags.map((t) => (
                      <li key={t}>
                        <Tag size="sm" tone="active">
                          {t}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                )}
                {current.href && (
                  <Link
                    href={current.href}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
                  >
                    {current.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </div>

        {hover && (
          <p
            aria-hidden="true"
            className="animate-fade-up pointer-events-none absolute bottom-12 right-6 z-20 rounded-full border border-secondary/40 bg-bg/80 px-4 py-2 font-mono text-xs text-secondary-text backdrop-blur-md sm:right-10 lg:right-16"
          >
            {hover}
          </p>
        )}

        <ol
          aria-hidden="true"
          className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3 lg:right-8"
        >
          {steps.map((_, i) => (
            <li
              key={i}
              className={cn(
                "w-1 rounded-full transition-[height,background-color,box-shadow] duration-300 ease-brand",
                i === step
                  ? "h-8 bg-secondary shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                  : i < step
                    ? "h-3 bg-primary-text/70"
                    : "h-3 bg-line-strong",
              )}
            />
          ))}
        </ol>

        {/* Everything above, in one plain list, for assistive tech. */}
        <ul className="sr-only">
          {steps.map((s) => (
            <li key={s.title}>
              {s.title}. {s.body}
              {s.href && <Link href={s.href}>{s.cta}</Link>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
