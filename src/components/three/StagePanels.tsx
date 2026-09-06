import Link from "next/link";
import { getProject } from "@/content/projects";
import { Card, Rule, Separator } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";
import { ACT3_PROJECT_SLUGS, IMMERSIVE_ACT_IDS } from "./acts";

/**
 * Real HTML, always fully present  no canvas here at all. This is what
 * `prefers-reduced-motion`, no WebGL, and no-JS visitors get: every fact
 * from all three acts, in normal reading order, the seven Act III projects
 * as real links reachable by keyboard. `ImmersiveSection` decides whether
 * to show this or the full-page pinned 3D experience; this component never
 * needs to know which.
 */
export function StagePanels({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const im = dict.immersive;
  const act3Projects = ACT3_PROJECT_SLUGS.map((slug) => getProject(slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <div className="space-y-20">
      {/* Act I  the journey of a request */}
      <section
        id={IMMERSIVE_ACT_IDS[0]}
        aria-labelledby="immersive-act-1-title"
        className="scroll-mt-32"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
          {im.act1.eyebrow}
        </p>
        <h2
          id="immersive-act-1-title"
          className="mt-3 font-display text-3xl font-bold sm:text-4xl"
        >
          {im.act1.title}
        </h2>
        <p className="mt-3 max-w-xl text-muted">{im.act1.kicker}</p>
        <Rule className="mt-6" />

        <ol className="mt-10 space-y-5">
          {im.act1.stages.map((s) => (
            <li key={s.number}>
              <Card marked>
                <p className="font-mono text-xs tabular-nums text-primary-text">{s.number}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
                  {s.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {s.tech.map((t) => (
                    <li key={t}>
                      <Tag size="sm">{t}</Tag>
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <Separator />

      {/* Act II  where I work from */}
      <section
        id={IMMERSIVE_ACT_IDS[1]}
        aria-labelledby="immersive-act-2-title"
        className="scroll-mt-32"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
          {im.act2.eyebrow}
        </p>
        <h2
          id="immersive-act-2-title"
          className="mt-3 font-display text-3xl font-bold sm:text-4xl"
        >
          {im.act2.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{im.act2.intro}</p>

        <Card className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            {im.act2.location}
          </p>
          <dl className="mt-4 grid gap-6 sm:grid-cols-3">
            {im.act2.timezones.map((t) => (
              <div key={t.city}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  {t.city}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-text-strong">
                  {t.offset}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-faint">{im.act2.overlapNote}</p>
        </Card>

        <ul className="mt-6 space-y-4">
          {im.act2.missions.map((m) => (
            <li key={m.place} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full bg-secondary"
              />
              <div>
                <p className="font-semibold text-text-strong">{m.place}</p>
                <p className="text-sm text-muted">{m.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      {/* Act III  what I've built */}
      <section
        id={IMMERSIVE_ACT_IDS[2]}
        aria-labelledby="immersive-act-3-title"
        className="scroll-mt-32"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
          {im.act3.eyebrow}
        </p>
        <h2
          id="immersive-act-3-title"
          className="mt-3 font-display text-3xl font-bold sm:text-4xl"
        >
          {im.act3.title}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{im.act3.intro}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-4">
          {im.act3.metrics.map((m) => (
            <div key={m.label}>
              <p className="font-display text-4xl font-bold text-text-strong">{m.value}</p>
              <p className="mt-1 text-xs leading-snug text-muted">{m.label}</p>
            </div>
          ))}
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {act3Projects.map((project) => {
            const copy = project.i18n[locale];
            return (
              <li key={project.slug}>
                <Link href={`/${locale}/projects/${project.slug}`} className="block h-full">
                  <Card interactive className="h-full">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-bold">{copy.name}</h3>
                      <span className="font-mono text-xs tabular-nums text-faint">
                        {project.year}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-secondary-text">{project.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{copy.tagline}</p>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
          >
            {im.act3.viewAll}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
