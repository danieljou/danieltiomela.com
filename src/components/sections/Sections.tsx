import Link from "next/link";
import { Rule } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";
import { ArchBlock, Connection, Node, Glow } from "@/components/brand/Brand";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { Reveal3D } from "@/components/motion/Reveal3D";
import { Scene3D } from "@/components/motion/Scene3D";
import { SectionScene } from "@/components/three/SectionScene";
import { PinnedStage } from "@/components/three/stage/PinnedStage";
import { ACT3_LAYOUT } from "@/components/three/act3/constants";
import { sortedProjects } from "@/content/projects";
import { CertCoverflow } from "@/components/sections/CertCoverflow";
import { GROUP_STYLE, TagSphere } from "@/components/sections/TagSphere";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";
import type { CSSProperties } from "react";

/** Depth for a card by its column: the middle one stands proud, the sides
    turn in toward it, so a row reads as a shallow arc rather than a flat line. */
function arc(i: number, count: number, depth = 46, turn = 7): CSSProperties {
  const mid = (count - 1) / 2;
  const off = i - mid;
  return {
    "--zd": `${Math.round(depth - Math.abs(off) * (depth / Math.max(1, mid)))}px`,
    "--ryd": `${(-off / Math.max(1, mid)) * turn}deg`,
  } as CSSProperties;
}

const ARC_ITEM = "layer sm:[--z:var(--zd)] sm:[--ry:var(--ryd)]";

/* ── Ready now  three concrete, CV-grounded axes ──────────────────────── */
function ReadyNowFlat({ dict }: { dict: Dictionary }) {
  const items = dict.readyNow.items;
  return (
    <Section labelledBy="ready-now-title" className="relative overflow-hidden">
      <Container className="relative">
        <SectionHeader
          id="ready-now-title"
          label={dict.readyNow.label}
          title={dict.readyNow.title}
          kicker={dict.readyNow.kicker}
        />
        <Scene3D className="mt-14" baseRx={4}>
          <ul className="layer grid gap-5 sm:grid-cols-3">
            {items.map((item, i) => (
              <li key={item.title} className={ARC_ITEM} style={arc(i, items.length)}>
                <Reveal3D delay={i * 40} className="h-full">
                  <TiltCard className="h-full" marked>
                    <p className="font-display text-4xl font-bold tabular-nums grad-text">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.body}</p>
                  </TiltCard>
                </Reveal3D>
              </li>
            ))}
          </ul>
        </Scene3D>
      </Container>
    </Section>
  );
}

/* ── Engineering principles ─────────────────────────────────────────────── */
function PrinciplesFlat({ dict }: { dict: Dictionary }) {
  const items = dict.principles.items;
  return (
    <Section labelledBy="principles-title" className="relative overflow-hidden">
      <Glow tone="violet" className="-left-40 top-1/3 h-105 w-130 opacity-40" />
      <Container className="relative">
        <SectionHeader
          id="principles-title"
          label={dict.principles.label}
          title={dict.principles.title}
          kicker={dict.principles.kicker}
        />
        <Scene3D className="mt-14" baseRx={5}>
          <ul className="layer grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const col = i % 3;
              return (
                <li
                  key={item.title}
                  className="layer lg:[--z:var(--zd)] lg:[--ry:var(--ryd)]"
                  style={arc(col, 3, 40, 6)}
                >
                  <Reveal3D delay={(i % 3) * 40 + Math.floor(i / 3) * 20} className="h-full">
                    <TiltCard className="h-full" marked>
                      <p className="font-mono text-[11px] tabular-nums tracking-[0.16em] text-primary-text">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.body}</p>
                    </TiltCard>
                  </Reveal3D>
                </li>
              );
            })}
          </ul>
        </Scene3D>
      </Container>
    </Section>
  );
}

/* ── What I build ───────────────────────────────────────────────────────── */
function WhatIBuildFlat({ dict }: { dict: Dictionary }) {
  return (
    <Section labelledBy="build-title" className="relative overflow-hidden">
      <Glow tone="blue" className="-left-52 -top-40 h-[420px] w-[600px] opacity-45" />
      <Container className="relative">
        <SectionHeader
          id="build-title"
          label={dict.build.label}
          title={dict.build.title}
          kicker={dict.build.kicker}
        />
        <Scene3D className="mt-14" baseRx={3} baseRy={-3}>
          <dl className="layer flex flex-col gap-3">
            {dict.build.items.map((item, i) => (
              <Reveal3D key={item.title} delay={i * 30}>
                <TiltCard
                  className="grid gap-2 bg-surface/80 py-5 backdrop-blur-sm sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10 lg:max-w-[calc(100%-6rem)]"
                  style={{ marginLeft: `${i * 0.6}rem` }}
                >
                  <dt className="flex items-start gap-3 font-display text-lg font-semibold text-text-strong">
                    <Node className="mt-2" />
                    {item.title}
                  </dt>
                  <dd className="text-[15px] leading-relaxed text-muted sm:text-base">
                    {item.body}
                  </dd>
                </TiltCard>
              </Reveal3D>
            ))}
          </dl>
        </Scene3D>
      </Container>
    </Section>
  );
}

/* ── How I think about systems ──────────────────────────────────────────── */
function SystemsDiagramFlat({ dict }: { dict: Dictionary }) {
  const { layers } = dict.systems;
  return (
    <Section labelledBy="systems-title" className="relative overflow-hidden">
      <Container className="relative">
        <SectionHeader
          id="systems-title"
          label={dict.systems.label}
          title={dict.systems.title}
          kicker={dict.systems.kicker}
        />

        {/* The diagram is real markup, not an image: it reflows on mobile,
            reads in order to a screen reader, and needs no alt text. It sits
            on an isometric base plane; each layer is lifted off it by its
            position in the chain, the active one highest. The scroller is the
            outer element so the 3D space lives inside it, not across it. */}
        <div className="mt-8 overflow-x-auto px-2 py-14">
          <Scene3D baseRx={22} baseRy={-16} className="min-w-max">
            <div className="relative p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-lg border border-line bg-surface/60"
                style={{
                  transform: "translateZ(-40px)",
                  backgroundImage:
                    "linear-gradient(rgba(76,134,255,0.14) 1px,transparent 1px),linear-gradient(90deg,rgba(76,134,255,0.14) 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <ol className="layer relative flex items-start gap-3">
                {layers.map((layer, i) => (
                  <li
                    key={layer.name}
                    className="layer flex items-start gap-3"
                    style={{ "--z": `${i === 2 ? 70 : 12 + i * 6}px` } as CSSProperties}
                  >
                    <div className="w-40">
                      <ArchBlock
                        name={layer.name}
                        kind={layer.kind}
                        active={i === 2}
                        className="w-full shadow-[0_18px_30px_rgba(5,10,22,0.5)]"
                      />
                      {layer.items && (
                        <ul className="mt-4 space-y-2 border-l border-line pl-4">
                          {layer.items.map((it) => (
                            <li key={it} className="text-[13px] leading-snug text-muted">
                              {it}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {i < layers.length - 1 && (
                      <div className="flex w-10 items-center gap-1.5 pt-7">
                        <Connection />
                        <span aria-hidden="true" className="text-xs text-faint">
                          ▸
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Scene3D>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {dict.systems.caption}
        </p>
      </Container>
    </Section>
  );
}

/* ── Engineering stack ──────────────────────────────────────────────────── */
export function StackSection({ dict }: { dict: Dictionary }) {
  const groups = [
    { title: dict.stack.core, items: dict.stack.coreItems },
    { title: dict.stack.geospatial, items: dict.stack.geospatialItems },
    { title: dict.stack.infrastructure, items: dict.stack.infrastructureItems },
    { title: dict.stack.additional, items: dict.stack.additionalItems },
  ];
  const items = groups.flatMap((g, group) => g.items.map((label) => ({ label, group })));

  return (
    <Section labelledBy="stack-title" className="relative overflow-hidden">
      <Glow tone="cyan" className="left-1/2 top-1/3 h-[440px] w-[560px] -translate-x-1/2 opacity-30" />
      <Container className="relative">
        <SectionHeader
          id="stack-title"
          label={dict.stack.label}
          title={dict.stack.title}
          kicker={dict.stack.kicker}
        />
        <Reveal3D className="mt-8">
          <TagSphere items={items} label={dict.stack.label} />
        </Reveal3D>
        <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {groups.map((g, i) => (
            <li key={g.title} className="flex items-center gap-2 text-sm text-muted">
              <span
                aria-hidden="true"
                className={cn("size-2.5 rounded-full border", GROUP_STYLE[i % GROUP_STYLE.length])}
              />
              {g.title}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ── Certifications ─────────────────────────────────────────────────────── */
export function Certifications({ dict }: { dict: Dictionary }) {
  // Flat for the coverflow, but each card carries its group, and the order is
  // the CV's own  never re-sorted.
  const certs = dict.certifications.groups.flatMap((g) =>
    g.items.map((c) => ({ ...c, group: g.title })),
  );
  return (
    <Section labelledBy="certs-title" className="relative overflow-hidden">
      <Container className="relative">
        <SectionHeader
          id="certs-title"
          label={dict.certifications.label}
          title={dict.certifications.title}
          kicker={dict.certifications.kicker}
        />
        <Reveal3D className="mt-12">
          <CertCoverflow
            certs={certs}
            label={dict.certifications.title}
            previousLabel={dict.certifications.previous}
            nextLabel={dict.certifications.next}
          />
        </Reveal3D>
        <a
          href={`${site.links.linkedin}details/certifications/`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
        >
          {dict.certifications.viewAll}
          <span aria-hidden="true">→</span>
        </a>
      </Container>
    </Section>
  );
}

/* ── Closing call to action ─────────────────────────────────────────────── */
export function ContactCTA({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section labelledBy="cta-title" className="relative overflow-hidden py-28 sm:py-40">
      <SectionScene />
      <Glow tone="blue" className="left-1/4 -top-56 h-[440px] w-[640px] opacity-40" />
      {/* A pool of page colour behind the copy, so the tunnel frames the
          words instead of running through them. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_38%_at_50%_50%,var(--color-bg)_30%,transparent_100%)]"
      />
      <Container className="pointer-events-none relative">
        <Reveal3D>
          <div className="pointer-events-auto mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
              {dict.contact.label}
            </p>
            <h2 id="cta-title" className="mt-4 text-4xl font-bold sm:text-5xl">
              {dict.contact.title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">{dict.contact.lede}</p>
            <Rule className="mx-auto mt-8" />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={`/${locale}/contact`} size="lg">
                {dict.contact.title}
              </Button>
              <Button href={`mailto:${site.email}`} variant="ghost" size="lg">
                {site.email}
              </Button>
            </div>
            <p className="mt-6 text-sm text-faint">{dict.contact.kicker}</p>
          </div>
        </Reveal3D>
      </Container>
    </Section>
  );
}

/* ── Featured projects on the home page ─────────────────────────────────── */
function FeaturedProjectsFlat({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <Section labelledBy="projects-title" className="relative overflow-hidden">
      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            id="projects-title"
            label={dict.projects.label}
            title={dict.projects.title}
            kicker={dict.projects.kicker}
          />
          <Link
            href={`/${locale}/projects`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
          >
            {dict.projects.all}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Scene3D className="mt-14" baseRx={4}>
          <div className="layer grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
        </Scene3D>
      </Container>
    </Section>
  );
}

/* ── On a wide screen with motion allowed, each section below becomes a
      pinned 3D scene driven by the scroll (see PinnedStage). The flat
      version above is what everyone else gets, and what the page renders
      before it hydrates. ─────────────────────────────────────────────── */

export function ReadyNow({ dict }: { dict: Dictionary }) {
  return (
    <PinnedStage
      id="ready-now-title"
      label={dict.readyNow.label}
      title={dict.readyNow.title}
      kicker={dict.readyNow.kicker}
      variant="carousel"
      steps={dict.readyNow.items}
      fallback={<ReadyNowFlat dict={dict} />}
    />
  );
}

export function WhatIBuild({ dict }: { dict: Dictionary }) {
  return (
    <PinnedStage
      id="build-title"
      label={dict.build.label}
      title={dict.build.title}
      kicker={dict.build.kicker}
      variant="rail"
      vhPerStep={70}
      steps={dict.build.items}
      fallback={<WhatIBuildFlat dict={dict} />}
    />
  );
}

export function SystemsDiagram({ dict }: { dict: Dictionary }) {
  return (
    <PinnedStage
      id="systems-title"
      label={dict.systems.label}
      title={dict.systems.title}
      kicker={dict.systems.kicker}
      variant="tower"
      vhPerStep={70}
      steps={dict.systems.layers.map((l) => ({ title: l.name, body: l.kind, tags: l.items }))}
      fallback={<SystemsDiagramFlat dict={dict} />}
    />
  );
}

export function Principles({ dict }: { dict: Dictionary }) {
  return (
    <PinnedStage
      id="principles-title"
      label={dict.principles.label}
      title={dict.principles.title}
      kicker={dict.principles.kicker}
      variant="prism"
      vhPerStep={70}
      steps={dict.principles.items}
      fallback={<PrinciplesFlat dict={dict} />}
    />
  );
}

export function FeaturedProjects({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const featured = sortedProjects().filter((p) => p.featured);
  return (
    <PinnedStage
      id="projects-title"
      label={dict.projects.label}
      title={dict.projects.title}
      kicker={dict.projects.kicker}
      variant="screens"
      data={featured.map((p) => ({
        slug: p.slug,
        name: p.i18n[locale].name,
        stack: p.stack,
        kind: ACT3_LAYOUT[p.slug]?.kind ?? "web",
        href: `/${locale}/projects/${p.slug}`,
        label: `${p.i18n[locale].name} · ${p.year} · ${p.role}`,
      }))}
      steps={featured.map((p) => ({
        title: p.i18n[locale].name,
        body: p.i18n[locale].tagline,
        tags: p.stack.slice(0, 4),
        href: `/${locale}/projects/${p.slug}`,
        cta: dict.projects.viewCase,
      }))}
      fallback={
        <FeaturedProjectsFlat locale={locale} dict={dict}>
          {children}
        </FeaturedProjectsFlat>
      }
    />
  );
}
