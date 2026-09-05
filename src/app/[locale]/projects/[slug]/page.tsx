import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { getProject, projects, sortedProjects } from "@/content/projects";
import { Container, Section } from "@/components/layout/Section";
import { Card, Rule, Separator } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  ArchBlock,
  Connection,
  Metric,
  Trace,
  Glow,
} from "@/components/brand/Brand";
import { ContactCTA } from "@/components/sections/Sections";
import { ProjectCover } from "@/components/sections/ProjectCover";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(slug);
  if (!project) return {};
  const copy = project.i18n[locale];
  return {
    title: copy.name,
    description: copy.tagline,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        fr: `/fr/projects/${slug}`,
      },
    },
    openGraph: { title: copy.name, description: copy.summary },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();

  const typed = locale as Locale;
  const dict = getDictionary(typed);
  const copy = project.i18n[typed];

  const others = sortedProjects()
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const facts = [
    { label: dict.projects.fields.role, value: project.role },
    {
      label: dict.projects.fields.period,
      value: project.period ?? project.year,
    },
    ...(project.client
      ? [{ label: dict.projects.fields.client, value: project.client }]
      : []),
    ...(project.context
      ? [{ label: dict.projects.fields.context, value: project.context }]
      : []),
    { label: dict.projects.fields.focus, value: copy.focus },
  ];

  return (
    <>
      <Section className="relative overflow-hidden pt-10 sm:pt-16">
        <Trace opacity={0.3} />
        <Glow
          tone="blue"
          className="-left-40 -top-48 h-110 w-150 opacity-45"
        />

        <Container className="relative">
          {/* Breadcrumb  answers "where am I" before anything else. */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.13em] text-faint">
              <li>
                <Link
                  href={`/${typed}/projects`}
                  className="transition-colors duration-200 hover:text-secondary-text"
                >
                  {dict.projects.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-muted">{copy.name}</li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-secondary-text">
              {dict.projects.status[project.status]}
            </p>
            <h1 className="mt-4 text-[clamp(2rem,5.5vw,3.25rem)] font-bold leading-[1.05]">
              {copy.name}
            </h1>
            <p className="mt-4 font-display text-xl font-medium text-muted sm:text-2xl">
              {copy.tagline}
            </p>
            <Rule className="mt-8" />
          </div>

          <ProjectCover project={project} priority className="mt-10" />

          <Card className="mt-8">
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-[15px] text-text">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <div className="mt-12 max-w-3xl space-y-10">
            <p className="max-w-prose text-[17px] leading-relaxed text-text">
              {copy.summary}
            </p>

            {copy.sections && copy.sections.length > 0 && (
              <div className="space-y-10">
                <Separator />
                {copy.sections.map((s) => (
                  <section key={s.step} aria-labelledby={`case-${s.step}`}>
                    <p className="font-mono text-[11px] tabular-nums tracking-[0.16em] text-primary-text">
                      {s.step}
                    </p>
                    <h2
                      id={`case-${s.step}`}
                      className="mt-2 font-display text-2xl font-bold"
                    >
                      {s.title}
                    </h2>
                    <div className="mt-3 space-y-3">
                      {s.body.map((p) => (
                        <p
                          key={p.slice(0, 24)}
                          className="max-w-prose text-[16px] leading-relaxed text-muted"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {project.architecture && (
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                  {dict.projects.fields.architecture}
                </h2>
                <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface/60 p-5">
                  <ol className="flex min-w-max items-center gap-2.5">
                    {project.architecture.map((node, i) => (
                      <li key={node.name} className="flex items-center gap-2.5">
                        <ArchBlock
                          name={node.name}
                          kind={node.kind}
                          active={i === 1}
                        />
                        {i < project.architecture!.length - 1 && (
                          <span className="flex w-8 items-center gap-1.5">
                            <Connection />
                            <span aria-hidden="true" className="text-xs text-faint">
                              ▸
                            </span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {project.metrics && project.metrics.length > 0 && (
              <div className="grid gap-6 border-y border-line py-8 sm:grid-cols-3">
                {project.metrics.map((m, i) => (
                  <Metric key={m.label} {...m} gradient={i === 0} />
                ))}
              </div>
            )}

            {project.stackDetail && project.stackDetail.length > 0 ? (
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                  {dict.projects.fields.stack}
                </h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  {project.stackDetail.map((s) => (
                    <div
                      key={s.name}
                      className="rounded-lg border border-line bg-surface/60 p-4"
                    >
                      <dt className="font-display text-sm font-semibold text-text-strong">
                        {s.name}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted">
                        {s.role}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                  {dict.projects.fields.stack}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={dict.projects.fields.stack}>
                  {project.stack.map((s) => (
                    <li key={s}>
                      <Tag size="sm">{s}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-8">
              {project.repo && (
                <Button href={project.repo} variant="ghost" size="sm" external>
                  {dict.projects.viewRepo}
                </Button>
              )}
              {project.demo && (
                <Button href={project.demo} variant="ghost" size="sm" external>
                  {dict.projects.viewDemo}
                </Button>
              )}
              <Button href={`mailto:${site.email}`} variant="quiet" size="sm">
                {site.email}
              </Button>
            </div>
          </div>

          {others.length > 0 && (
            <>
              <Separator className="mt-16" />
              <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                <Link
                  href={`/${typed}/projects`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
                >
                  <span aria-hidden="true">←</span>
                  {dict.projects.backToProjects}
                </Link>
                <ul className="flex flex-wrap gap-4">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/${typed}/projects/${o.slug}`}
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-text"
                      >
                        {o.i18n[typed].name}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Container>
      </Section>

      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
