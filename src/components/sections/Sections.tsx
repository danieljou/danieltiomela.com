import Link from "next/link";
import { Card, Rule } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ArchBlock, Connection, Node, Trace, Glow } from "@/components/brand/Brand";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";

/* ── Ready now  three concrete, CV-grounded axes ──────────────────────── */
export function ReadyNow({ dict }: { dict: Dictionary }) {
  return (
    <Section labelledBy="ready-now-title">
      <Container>
        <SectionHeader
          id="ready-now-title"
          label={dict.readyNow.label}
          title={dict.readyNow.title}
          kicker={dict.readyNow.kicker}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {dict.readyNow.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 60} className="h-full">
                <Card className="h-full" marked>
                  <p className="font-mono text-[11px] tabular-nums tracking-[0.16em] text-primary-text">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.body}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ── Engineering principles ─────────────────────────────────────────────── */
export function Principles({ dict }: { dict: Dictionary }) {
  return (
    <Section labelledBy="principles-title">
      <Container>
        <SectionHeader
          id="principles-title"
          label={dict.principles.label}
          title={dict.principles.title}
          kicker={dict.principles.kicker}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.principles.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 60} className="h-full">
                <Card className="h-full" marked>
                  <p className="font-mono text-[11px] tabular-nums tracking-[0.16em] text-primary-text">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.body}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ── What I build ───────────────────────────────────────────────────────── */
export function WhatIBuild({ dict }: { dict: Dictionary }) {
  return (
    <Section labelledBy="build-title" className="relative overflow-hidden">
      <Trace opacity={0.26} />
      <Glow tone="blue" className="-left-52 -top-40 h-[420px] w-[600px] opacity-45" />
      <Container className="relative">
        <SectionHeader
          id="build-title"
          label={dict.build.label}
          title={dict.build.title}
          kicker={dict.build.kicker}
        />
        <Reveal>
          <dl className="mt-12 divide-y divide-line/55 border-y border-line">
            {dict.build.items.map((item) => (
              <div
                key={item.title}
                className="grid gap-2 py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10"
              >
                <dt className="flex items-start gap-3 font-display text-lg font-semibold text-text-strong">
                  <Node className="mt-2" />
                  {item.title}
                </dt>
                <dd className="text-[15px] leading-relaxed text-muted sm:text-base">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ── How I think about systems ──────────────────────────────────────────── */
export function SystemsDiagram({ dict }: { dict: Dictionary }) {
  const { layers } = dict.systems;
  return (
    <Section labelledBy="systems-title">
      <Container>
        <SectionHeader
          id="systems-title"
          label={dict.systems.label}
          title={dict.systems.title}
          kicker={dict.systems.kicker}
        />

        {/* The diagram is real markup, not an image: it reflows on mobile,
            reads in order to a screen reader, and needs no alt text. */}
        <div className="mt-12 overflow-x-auto rounded-lg border border-line bg-surface/60 p-6 sm:p-8">
          <ol className="flex min-w-max items-start gap-3">
            {layers.map((layer, i) => (
              <li key={layer.name} className="flex items-start gap-3">
                <div className="w-40">
                  <ArchBlock
                    name={layer.name}
                    kind={layer.kind}
                    active={i === 2}
                    className="w-full"
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

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          {dict.systems.caption}
        </p>
      </Container>
    </Section>
  );
}

/* ── Engineering stack ──────────────────────────────────────────────────── */
export function StackSection({ dict }: { dict: Dictionary }) {
  const groups = [
    { title: dict.stack.core, items: dict.stack.coreItems, primary: true },
    { title: dict.stack.geospatial, items: dict.stack.geospatialItems, primary: true },
    { title: dict.stack.infrastructure, items: dict.stack.infrastructureItems },
    { title: dict.stack.additional, items: dict.stack.additionalItems },
  ];

  return (
    <Section labelledBy="stack-title" className="relative overflow-hidden">
      <Glow tone="cyan" className="-right-48 top-0 h-[440px] w-[560px] opacity-35" />
      <Container className="relative">
        <SectionHeader
          id="stack-title"
          label={dict.stack.label}
          title={dict.stack.title}
          kicker={dict.stack.kicker}
        />
        <div className="mt-12 space-y-8">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 60}>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
                <h3 className="pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                  {g.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li key={item}>
                      <Tag tone={g.primary ? "active" : "default"}>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ── Certifications ─────────────────────────────────────────────────────── */
export function Certifications({ dict }: { dict: Dictionary }) {
  return (
    <Section labelledBy="certs-title">
      <Container>
        <SectionHeader
          id="certs-title"
          label={dict.certifications.label}
          title={dict.certifications.title}
          kicker={dict.certifications.kicker}
        />
        <div className="mt-10 space-y-10">
          {dict.certifications.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 60}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                {group.title}
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      {[
                        dict.certifications.columns.name,
                        dict.certifications.columns.provider,
                        dict.certifications.columns.date,
                      ].map((c) => (
                        <th
                          key={c}
                          scope="col"
                          className="pb-3 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-muted"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((c) => (
                      <tr key={c.name} className="border-b border-line/55">
                        <td className="py-3.5 pr-4 text-text">{c.name}</td>
                        <td className="py-3.5 pr-4 text-muted">{c.provider}</td>
                        <td className="whitespace-nowrap py-3.5 tabular-nums text-muted">
                          {c.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          ))}
        </div>
        <a
          href={`${site.links.linkedin}details/certifications/`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
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
    <Section labelledBy="cta-title" className="relative overflow-hidden">
      <Trace opacity={0.35} />
      <Glow tone="blue" className="left-1/4 -top-56 h-[440px] w-[640px] opacity-50" />
      <Glow tone="cyan" className="-right-40 -bottom-40 h-[400px] w-[520px] opacity-40" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
            {dict.contact.label}
          </p>
          <h2 id="cta-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {dict.contact.title}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">{dict.contact.lede}</p>
          <Rule className="mx-auto mt-8" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={`/${locale}/contact`}>{dict.contact.title}</Button>
            <Button href={`mailto:${site.email}`} variant="ghost">
              {site.email}
            </Button>
          </div>
          <p className="mt-6 text-sm text-faint">{dict.contact.kicker}</p>
        </div>
      </Container>
    </Section>
  );
}

/* ── Featured projects on the home page ─────────────────────────────────── */
export function FeaturedProjects({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <Section labelledBy="projects-title">
      <Container>
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
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      </Container>
    </Section>
  );
}
