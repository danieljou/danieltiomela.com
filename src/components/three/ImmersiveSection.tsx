import { Container, Section } from "@/components/layout/Section";
import { Rule } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trace, Glow } from "@/components/brand/Brand";
import { StagePanels } from "./StagePanels";
import { ProgressRail } from "./ProgressRail";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";

/**
 * Step 1 of the brief: real, stacked HTML  no canvas, no scroll-hijack yet.
 * This IS the accessible fallback (`prefers-reduced-motion`, no WebGL,
 * no JS all get exactly this), not a placeholder for it. The pinned,
 * scroll-driven 3D presentation is a later, separate pass layered on top of
 * this same content once there's something worth pinning behind it.
 */
export function ImmersiveSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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

      <Section className="relative">
        {/* Clipping isolated to this layer, not the whole section: an
            `overflow-hidden` on an ancestor of Act I's sticky canvas column
            breaks `position: sticky` for every descendant, regardless of
            how far down the tree it sits. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Trace opacity={0.25} />
          <Glow tone="violet" className="left-1/2 top-0 h-105 w-155 -translate-x-1/2 opacity-30" />
        </div>

        <Container className="relative">
          <ProgressRail dict={dict} />
          <StagePanels locale={locale} dict={dict} />

          <Rule className="mt-20" />
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
