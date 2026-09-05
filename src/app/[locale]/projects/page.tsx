import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { sortedProjects } from "@/content/projects";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ContactCTA } from "@/components/sections/Sections";
import { EmptyState } from "@/components/feedback/States";
import { Trace, Glow } from "@/components/brand/Brand";

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
    title: dict.projects.title,
    description: dict.projects.kicker,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { en: "/en/projects", fr: "/fr/projects" },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typed = locale as Locale;
  const dict = getDictionary(typed);
  const projects = sortedProjects();

  return (
    <>
      <Section className="relative overflow-hidden pt-12 sm:pt-20">
        <Trace opacity={0.28} />
        <Glow tone="cyan" className="-right-40 -top-40 h-[420px] w-[560px] opacity-40" />
        <Container className="relative">
          <SectionHeader
            as="h1"
            label={dict.projects.label}
            title={dict.projects.title}
            kicker={dict.projects.kicker}
          />

          {projects.length === 0 ? (
            <EmptyState
              className="mt-12"
              title={dict.projects.empty}
              body={dict.blog.empty.body}
            />
          ) : (
            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <li key={p.slug} className="flex">
                  <ProjectCard project={p} locale={typed} dict={dict} index={i} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
