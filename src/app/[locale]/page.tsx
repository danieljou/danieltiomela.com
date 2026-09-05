import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { sortedProjects } from "@/content/projects";
import { Hero } from "@/components/sections/Hero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import {
  Certifications,
  ContactCTA,
  FeaturedProjects,
  Principles,
  ReadyNow,
  StackSection,
  SystemsDiagram,
  WhatIBuild,
} from "@/components/sections/Sections";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed = locale as Locale;
  const dict = getDictionary(typed);
  const featured = sortedProjects().filter((p) => p.featured);

  return (
    <>
      <Hero locale={typed} dict={dict} />
      <ReadyNow dict={dict} />
      <WhatIBuild dict={dict} />
      <SystemsDiagram dict={dict} />
      <FeaturedProjects locale={typed} dict={dict}>
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} locale={typed} dict={dict} index={i} />
        ))}
      </FeaturedProjects>
      <StackSection dict={dict} />
      <Principles dict={dict} />
      <Certifications dict={dict} />
      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
