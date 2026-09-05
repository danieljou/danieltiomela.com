import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { getProject, sortedProjects } from "@/content/projects";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { Card, Rule, Separator } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Trace, Glow } from "@/components/brand/Brand";
import { Certifications, ContactCTA } from "@/components/sections/Sections";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.cv.title,
    description: dict.cv.kicker,
    alternates: {
      canonical: `/${locale}/cv`,
      languages: { en: "/en/cv", fr: "/fr/cv" },
    },
  };
}

/**
 * Reverse-chronological, matching the CV document itself  not the portfolio
 * ordering in projects.ts, which puts the most demonstrable work first.
 * Passage Canada is deliberately excluded: it's a personal project, not
 * employment, and gets its own "personal projects" section below instead.
 */
const EXPERIENCE_ORDER = [
  "real-estate-platform-infrastructure",
  "immotic",
  "giz-observatory-phase-2",
  "gis-geodata-infrastructure",
  "municipal-revenue-system",
  "regional-digital-observatory",
  "giz-observatory-phase-1",
  "document-authentication-platform",
];

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typed = locale as Locale;
  const dict = getDictionary(typed);

  const experience = EXPERIENCE_ORDER.map((slug) => getProject(slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const personalProjects = sortedProjects().filter((p) => p.slug === "passage-canada");

  return (
    <>
      <Section className="relative overflow-hidden pt-12 sm:pt-20">
        <Trace opacity={0.3} />
        <Glow
          tone="blue"
          className="-left-40 -top-48 h-[460px] w-[620px] opacity-50"
        />
        <Container className="relative">
          <SectionHeader
            as="h1"
            label={dict.cv.label}
            title={dict.cv.title}
            kicker={dict.cv.kicker}
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={site.cvPdfPath}>{dict.cv.downloadCta}</Button>
            <Button href={`mailto:${site.email}`} variant="ghost" size="sm">
              {site.email}
            </Button>
            <Button href={site.links.github} variant="ghost" size="sm" external>
              GitHub
            </Button>
            <Button href={site.links.linkedin} variant="ghost" size="sm" external>
              LinkedIn
            </Button>
          </div>

          <Card className="mt-8">
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dict.about.facts.slice(0, 4).map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-[15px] text-text">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* Skills */}
          <div className="mt-14">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              {dict.cv.skillsTitle}
            </h2>
            <div className="mt-5 space-y-6">
              {dict.cv.skillGroups.map((g) => (
                <div
                  key={g.title}
                  className="grid gap-3 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
                >
                  <h3 className="pt-1 text-[13px] font-semibold text-text-strong">
                    {g.title}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <li key={item}>
                        <Tag size="sm">{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Rule className="mt-14" />

          {/* Experience */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">{dict.cv.experienceTitle}</h2>
            <ol className="mt-6 space-y-5">
              {experience.map((project) => {
                const copy = project.i18n[typed];
                return (
                  <li key={project.slug}>
                    <Card>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-display text-lg font-bold">{copy.name}</h3>
                        <p className="font-mono text-[11px] tabular-nums text-faint">
                          {project.period ?? project.year}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-secondary-text">
                        {project.role}
                        {project.client ? ` · ${project.client}` : ""}
                      </p>
                      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
                        {copy.tagline}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {project.stack.map((s) => (
                          <li key={s}>
                            <Tag size="sm">{s}</Tag>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/${typed}/projects/${project.slug}`}
                        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
                      >
                        {dict.projects.viewCase}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </Card>
                  </li>
                );
              })}

              <li>
                <Card>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-bold">
                      {dict.cv.priorRole.title}
                    </h3>
                    <p className="font-mono text-[11px] tabular-nums text-faint">
                      {dict.cv.priorRole.period}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-secondary-text">{dict.cv.priorRole.org}</p>
                  <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
                    {dict.cv.priorRole.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {dict.cv.priorRole.stack.map((s) => (
                      <li key={s}>
                        <Tag size="sm">{s}</Tag>
                      </li>
                    ))}
                  </ul>
                </Card>
              </li>
            </ol>
          </div>

          {/* Personal projects */}
          {personalProjects.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold">
                {dict.cv.personalProjectsTitle}
              </h2>
              <ol className="mt-6 space-y-5">
                {personalProjects.map((project) => {
                  const copy = project.i18n[typed];
                  return (
                    <li key={project.slug}>
                      <Card>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h3 className="font-display text-lg font-bold">{copy.name}</h3>
                          <p className="font-mono text-[11px] tabular-nums text-faint">
                            {project.period ?? project.year}
                          </p>
                        </div>
                        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
                          {copy.tagline}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {project.stack.map((s) => (
                            <li key={s}>
                              <Tag size="sm">{s}</Tag>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/${typed}/projects/${project.slug}`}
                          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-secondary-text transition-colors duration-200 hover:text-secondary"
                        >
                          {dict.projects.viewCase}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </Card>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          <Separator className="mt-14" />

          {/* Education */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">{dict.cv.educationTitle}</h2>
            <ul className="mt-6 space-y-4">
              {dict.cv.education.map((e) => (
                <li key={e.degree} className="border-b border-line/55 pb-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-display text-base font-semibold text-text-strong">
                      {e.degree}
                    </p>
                    <p className="font-mono text-[11px] tabular-nums text-faint">{e.period}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {e.school}
                    {e.note ? ` · ${e.note}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Certifications dict={dict} />
      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
