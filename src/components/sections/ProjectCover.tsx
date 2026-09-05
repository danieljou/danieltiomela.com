import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArchBlock, Connection, Glow, Trace } from "@/components/brand/Brand";
import type { Project } from "@/content/types";

/**
 * Every project needs a cover, with or without a real screenshot.
 *
 * With `project.cover`: a real image (or an anonymised/composited one),
 * rendered through next/image at a fixed 16:9 so nothing shifts on load.
 *
 * Without one: a generated brand placeholder built from the project's own
 * `architecture` blocks  Trace pattern, brand glows, the same ArchBlock
 * pieces the page already renders. Two projects never look the same because
 * each one draws its own architecture, not a stock graphic. Purely
 * decorative  every fact it shows is already in the page's text  so it is
 * hidden from assistive tech rather than given a made-up alt description.
 */
export function ProjectCover({
  project,
  priority = false,
  className,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  if (project.cover) {
    return (
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl border border-line bg-surface",
          className,
        )}
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  // Three, never four  at 375px, a fourth node's label clips mid-word
  // instead of leaving room to breathe. The full list still renders as
  // accessible text further down the page.
  const nodes = project.architecture?.slice(0, 3) ?? [];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border border-line bg-surface",
        className,
      )}
    >
      <Trace opacity={0.35} />
      <Glow
        tone="blue"
        className="-left-16 -top-16 h-56 w-56 opacity-40 sm:h-64 sm:w-64"
      />
      <Glow
        tone="cyan"
        className="-bottom-16 -right-10 h-60 w-60 opacity-30 sm:h-72 sm:w-72"
      />
      {nodes.length > 0 && (
        <div className="relative flex h-full items-center justify-center gap-1.5 px-4 sm:gap-2.5 sm:px-6">
          {nodes.map((node, i) => (
            <div key={node.name} className="flex items-center gap-1.5 sm:gap-2.5">
              <ArchBlock
                name={node.name}
                kind={node.kind}
                active={i === 1}
                className="w-20 shrink sm:w-28"
              />
              {i < nodes.length - 1 && <Connection className="w-3 sm:w-6" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
