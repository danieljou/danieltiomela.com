"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { ACT_BOUNDARIES, TOTAL_VH, getActState } from "./actProgress";
import { Act1Canvas } from "./act1/Act1Canvas";
import { Act2Canvas } from "./act2/Act2Canvas";
import { Act3Canvas } from "./act3/Act3Canvas";
import { ORDERED_SLUGS } from "./act3/constants";
import { getProject } from "@/content/projects";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";

const RAIL_KEYS = ["act1", "act2", "act3"] as const;

/**
 * One continuous scroll region, one full-viewport pinned canvas, three
 * acts swapped in place rather than three separate boxed scenes sitting
 * beside HTML text. This is what the brief's section 7 actually specifies;
 * the earlier per-act builds bolted their canvases onto the accessible
 * fallback layout instead of building this, which is the mistake this
 * component corrects.
 *
 * Only ever mounted when `ImmersiveSection` has confirmed reduced motion
 * is off and WebGL is available  it is never the thing a first paint or a
 * reduced-motion/no-JS visitor sees.
 */
export function ImmersiveExperience({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const im = dict.immersive;
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);
  const subProgressRef = useRef(0);
  const [activeAct, setActiveAct] = useState<0 | 1 | 2>(0);
  const [activeStage, setActiveStage] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const lastAct = useRef<0 | 1 | 2>(0);
  const lastStage = useRef(0);
  const lastProject = useRef(0);

  useEffect(() => {
    document.body.style.cursor = hoverLabel ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoverLabel]);

  useEffect(() => {
    function update() {
      const state = getActState(progress.current);
      subProgressRef.current = state.subProgress;
      // Written straight to the element: a per-scroll setState is the first
      // cause of jank in a scroll-driven scene (see useScrollProgress).
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.current})`;
      if (state.actIndex !== lastAct.current) {
        lastAct.current = state.actIndex;
        setActiveAct(state.actIndex);
      }
      if (state.actIndex === 0) {
        const stageCount = im.act1.stages.length;
        const stageIdx = Math.round(state.subProgress * (stageCount - 1));
        if (stageIdx !== lastStage.current) {
          lastStage.current = stageIdx;
          setActiveStage(stageIdx);
        }
      }
      if (state.actIndex === 2) {
        const projectIdx = Math.round(state.subProgress * (ORDERED_SLUGS.length - 1));
        if (projectIdx !== lastProject.current) {
          lastProject.current = projectIdx;
          setActiveProject(projectIdx);
        }
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  /** Scroll to a point inside an act: `sub` is 0-1 within that act. */
  function jumpTo(act: number, sub = 0) {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const total = rect.height - window.innerHeight;
    const start = ACT_BOUNDARIES[act];
    const end = ACT_BOUNDARIES[act + 1];
    window.scrollTo({ top: sectionTop + (start + sub * (end - start)) * total, behavior: "smooth" });
  }
  const jumpToAct = (index: number) => jumpTo(index, 0);

  const stage = im.act1.stages[activeStage];
  const projectSlug = ORDERED_SLUGS[activeProject];
  const project = projectSlug ? getProject(projectSlug) : undefined;
  const projectCopy = project?.i18n[locale];

  // Steps on the right edge: the stages of Act I, the projects of Act III.
  const stepCount =
    activeAct === 0 ? im.act1.stages.length : activeAct === 2 ? ORDERED_SLUGS.length : 0;
  const stepActive = activeAct === 0 ? activeStage : activeProject;
  const captionKey = `${activeAct}-${activeAct === 0 ? activeStage : activeAct === 2 ? activeProject : 0}`;

  return (
    <section
      ref={sectionRef}
      className="relative h-(--h-m) lg:h-(--h-d)"
      style={{ "--h-m": `${TOTAL_VH / 2}vh`, "--h-d": `${TOTAL_VH}vh` } as React.CSSProperties}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          {activeAct === 0 && (
            <Act1Canvas
              active
              progress={subProgressRef}
              onHover={setHoverLabel}
              stageLabels={im.act1.stages.map((s) => s.title)}
              onSelectStage={(i) => jumpTo(0, i / (im.act1.stages.length - 1))}
            />
          )}
          {activeAct === 1 && (
            <Act2Canvas
              active
              clockLabel={im.act2.location}
              missionLabels={im.act2.missions.map((m) => m.place)}
              onHover={setHoverLabel}
            />
          )}
          {activeAct === 2 && (
            <Act3Canvas
              active
              locale={locale}
              progress={subProgressRef}
              onHover={setHoverLabel}
              onSelect={(i) => jumpTo(2, i / (ORDERED_SLUGS.length - 1))}
            />
          )}
        </div>

        {/* Legibility: the caption sits on a soft floor of the page colour, and
            the header zone on a soft ceiling, so text never fights the scene. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-bg via-bg/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-linear-to-b from-bg/80 to-transparent"
        />

        {/* Jump nav  real buttons, not scroll-hijacked: each one is a
            plain scrollTo, so keyboard and screen-reader users can still
            reach every act even though the canvas itself is decorative. */}
        <nav
          aria-label={im.progressLabel}
          className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center px-4 sm:top-20"
        >
          <div className="pointer-events-auto flex gap-1 rounded-full border border-line bg-bg/60 p-1 backdrop-blur-md">
            {RAIL_KEYS.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => jumpToAct(i)}
                aria-current={activeAct === i ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm transition-[color,background-color,box-shadow] duration-200",
                  activeAct === i
                    ? "bg-secondary/12 text-text-strong shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                    : "text-muted hover:bg-surface-2/70 hover:text-text",
                )}
              >
                <span className="font-mono text-xs tabular-nums text-secondary-text" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {im.rail[key]}
              </button>
            ))}
          </div>
        </nav>

        {/* What the pointer is on, named. Acts II and III already say it in the
            caption; Act I has no other place for it. */}
        {activeAct === 0 && hoverLabel && (
          <p
            aria-hidden="true"
            className="animate-fade-up pointer-events-none absolute left-1/2 top-36 z-20 -translate-x-1/2 rounded-full border border-secondary/40 bg-bg/80 px-4 py-2 font-mono text-xs text-secondary-text backdrop-blur-md"
          >
            {hoverLabel}
          </p>
        )}

        {/* Steps within the act  where you are, not a control. */}
        {stepCount > 0 && (
          <ol
            aria-hidden="true"
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:right-8"
          >
            {Array.from({ length: stepCount }, (_, i) => (
              <li
                key={i}
                className={cn(
                  "w-1 rounded-full transition-[height,background-color,box-shadow] duration-300 ease-brand",
                  i === stepActive
                    ? "h-8 bg-secondary shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                    : i < stepActive
                      ? "h-3 bg-primary-text/70"
                      : "h-3 bg-line-strong",
                )}
              />
            ))}
          </ol>
        )}

        {/* Overlay text  the only content a mouse/trackpad visitor reads
            here; keyboard and screen-reader visitors get the full version
            in StagePanels once this experience isn't the one rendered. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-8 sm:px-10 sm:pb-12 lg:px-16">
          <div
            key={captionKey}
            className="animate-fade-up pointer-events-auto max-w-xl rounded-xl border border-line-strong/70 bg-bg/70 p-6 shadow-photo backdrop-blur-xl sm:p-7"
          >
            {activeAct === 0 && stage && (
              <div className="flex gap-5">
                <p
                  aria-hidden="true"
                  className="font-display text-5xl font-bold leading-none tabular-nums grad-text sm:text-6xl"
                >
                  {stage.number}
                </p>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold">{stage.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{stage.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {stage.tech.map((t) => (
                      <li key={t}>
                        <Tag size="sm" tone="active">
                          {t}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeAct === 1 && (
              <>
                <h2 className="font-display text-2xl font-bold">{im.act2.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {hoverLabel ?? im.act2.intro}
                </p>
              </>
            )}
            {activeAct === 2 && (
              <div className="flex gap-5">
                <p
                  aria-hidden="true"
                  className="font-display text-5xl font-bold leading-none tabular-nums grad-text sm:text-6xl"
                >
                  {String(activeProject + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold">
                    {projectCopy?.name ?? im.act3.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {hoverLabel ??
                      (projectCopy
                        ? `${project?.year} · ${project?.role} — ${projectCopy.tagline}`
                        : im.act3.intro)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overall progress through the three acts. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-30 h-0.5 bg-line/60"
        >
          <div
            ref={barRef}
            className="h-full origin-left bg-linear-to-r from-primary to-secondary"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
