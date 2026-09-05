import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ProjectCover } from "@/components/sections/ProjectCover";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { Dictionary, Project } from "@/content/types";

const statusTone: Record<Project["status"], string> = {
  live: "text-secondary-text before:bg-secondary",
  building: "text-muted before:bg-primary-text",
  progress: "text-muted before:bg-faint",
};

export function ProjectCard({
  project,
  locale,
  dict,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}) {
  const copy = project.i18n[locale];
  const href = `/${locale}/projects/${project.slug}`;

  return (
    <Card as="article" interactive className="group flex h-full flex-col gap-4">
      <ProjectCover project={project} />

      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]",
            "before:size-1.5 before:rounded-full before:content-['']",
            statusTone[project.status],
          )}
        >
          {dict.projects.status[project.status]}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-faint">
          {project.year}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-display text-xl font-bold leading-tight">
          {/* The whole card is the target  the link stretches over it, so
              there is one tab stop per card rather than three. */}
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {copy.name}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          {copy.tagline}
        </p>
      </div>

      <ul
        className="flex flex-wrap gap-1.5"
        aria-label={dict.projects.fields.stack}
      >
        {project.stack.slice(0, 4).map((s) => (
          <li key={s}>
            <Tag size="sm">{s}</Tag>
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-2 text-sm text-secondary-text">
        {dict.projects.viewCase}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </p>
    </Card>
  );
}
