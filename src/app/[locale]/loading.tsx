import { Container, Section } from "@/components/layout/Section";
import { Skeleton } from "@/components/feedback/States";

/**
 * R02  a skeleton shaped like the page that is coming. Pages here are static,
 * so this is rarely seen; it exists so a slow network never shows a blank frame.
 */
export default function Loading() {
  return (
    <Section className="pt-12 sm:pt-20">
      <Container>
        <span className="sr-only" role="status">
          Loading
        </span>
        <div aria-hidden="true" className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4 max-w-xl" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-5/6 max-w-xl" />
        </div>
        <div
          aria-hidden="true"
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
