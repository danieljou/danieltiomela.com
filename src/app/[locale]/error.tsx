"use client";

import { useEffect } from "react";
import { Container, Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { en } from "@/content/en";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const dict = en;

  return (
    <Section>
      <Container>
        <div
          role="alert"
          className="mx-auto max-w-lg py-16 text-center sm:py-24"
        >
          <h1 className="text-3xl font-bold sm:text-4xl">{dict.errors.generic.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {dict.errors.generic.body}
          </p>
          <div className="mt-8 flex justify-center">
            <Button onClick={reset}>{dict.errors.generic.cta}</Button>
          </div>
          {error.digest && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-faint">
              Error ID · {error.digest}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
