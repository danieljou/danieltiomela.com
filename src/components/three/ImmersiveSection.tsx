"use client";

import { useEffect, useState } from "react";
import { Container, Section } from "@/components/layout/Section";
import { Rule } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trace, Glow } from "@/components/brand/Brand";
import { StagePanels } from "./StagePanels";
import { ProgressRail } from "./ProgressRail";
import { ImmersiveExperience } from "./ImmersiveExperience";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";

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
 * Gates between the two experiences  never both, never a stitched-together
 * mix of the two. Starts `false` on both server and client (matching the
 * hydration-safe pattern used everywhere else in this section): reduced
 * motion, no WebGL, and no-JS visitors all get the plain `StagePanels`
 * fallback below, in normal document flow, full content, real links.
 * Everyone else gets `ImmersiveExperience`, the full-viewport pinned
 * three-act scene the brief's section 7 specifies.
 */
export function ImmersiveSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setImmersive(!reduceMotion && supportsWebGL());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <a
        href="#after-immersive"
        className="sr-only rounded-md focus:not-sr-only focus:absolute
                   focus:left-4 focus:top-4 focus:z-[100] focus:bg-secondary
                   focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
      >
        {dict.immersive.skipLabel}
      </a>

      {immersive ? (
        <ImmersiveExperience locale={locale} dict={dict} />
      ) : (
        <Section className="relative">
          {/* Clipping isolated to this layer, not the whole section: an
              `overflow-hidden` on an ancestor would break `position: sticky`
              for any descendant, regardless of how far down it sits. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Trace opacity={0.25} />
            <Glow tone="violet" className="left-1/2 top-0 h-105 w-155 -translate-x-1/2 opacity-30" />
          </div>

          <Container className="relative">
            <ProgressRail dict={dict} />
            <StagePanels locale={locale} dict={dict} />
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <Rule />
          <div className="mt-10 max-w-xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {dict.immersive.exit.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {dict.immersive.exit.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`/${locale}/projects`}>{dict.immersive.exit.ctaProjects}</Button>
              <Button href={`/${locale}/contact`} variant="ghost">
                {dict.immersive.exit.ctaContact}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <div id="after-immersive" tabIndex={-1} />
    </>
  );
}
