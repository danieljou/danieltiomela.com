"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { ACT_BOUNDARIES, getActState } from "./actProgress";
import { Act1Canvas } from "./act1/Act1Canvas";
import { Act2Canvas } from "./act2/Act2Canvas";
import { Act3Canvas } from "./act3/Act3Canvas";
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
  const progress = useScrollProgress(sectionRef);
  const subProgressRef = useRef(0);
  const [activeAct, setActiveAct] = useState<0 | 1 | 2>(0);
  const [activeStage, setActiveStage] = useState(0);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const lastAct = useRef<0 | 1 | 2>(0);
  const lastStage = useRef(0);

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

  function jumpToAct(index: number) {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const total = rect.height - window.innerHeight;
    window.scrollTo({ top: sectionTop + ACT_BOUNDARIES[index] * total, behavior: "smooth" });
  }

  const stage = im.act1.stages[activeStage];

  return (
    <section ref={sectionRef} className="relative h-[600vh] lg:h-[1200vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          {activeAct === 0 && (
            <Act1Canvas active progress={subProgressRef} onHover={setHoverLabel} />
          )}
          {activeAct === 1 && (
            <Act2Canvas
              active
              clockLabel={im.act2.location}
              missionLabels={im.act2.missions.map((m) => m.place)}
              onHover={setHoverLabel}
            />
          )}
          {activeAct === 2 && <Act3Canvas active locale={locale} onHover={setHoverLabel} />}
        </div>

        {/* Jump nav  real buttons, not scroll-hijacked: each one is a
            plain scrollTo, so keyboard and screen-reader users can still
            reach every act even though the canvas itself is decorative. */}
        <nav
          aria-label={im.progressLabel}
          className="absolute inset-x-0 top-16 z-20 flex justify-center gap-2 px-4 sm:top-20"
        >
          {RAIL_KEYS.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => jumpToAct(i)}
              aria-current={activeAct === i ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm backdrop-blur-sm transition-colors duration-200",
                activeAct === i
                  ? "border-secondary/50 bg-bg/70 text-secondary-text"
                  : "border-line bg-bg/50 text-muted hover:text-text",
              )}
            >
              <span className="font-mono text-xs tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {im.rail[key]}
            </button>
          ))}
        </nav>

        {/* Overlay text  the only content a mouse/trackpad visitor reads
            here; keyboard and screen-reader visitors get the full version
            in StagePanels once this experience isn't the one rendered. */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10">
          <div className="mx-auto max-w-xl rounded-xl border border-line bg-bg/85 p-6 backdrop-blur-md">
            {activeAct === 0 && stage && (
              <>
                <p className="font-mono text-xs tabular-nums text-primary-text">{stage.number}</p>
                <h2 className="mt-2 font-display text-2xl font-bold">{stage.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{stage.body}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {stage.tech.map((t) => (
                    <li key={t}>
                      <Tag size="sm">{t}</Tag>
                    </li>
                  ))}
                </ul>
              </>
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
              <>
                <h2 className="font-display text-2xl font-bold">{im.act3.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {hoverLabel ?? im.act3.intro}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
