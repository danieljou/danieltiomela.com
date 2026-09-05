import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Trace, Glow } from "@/components/brand/Brand";
import { en } from "@/content/en";

/**
 * not-found cannot read route params, so it speaks the default language and
 * links home. Keeping it simple beats guessing the locale wrong.
 */
export default function NotFound() {
  const dict = en;
  return (
    <Section className="relative overflow-hidden">
      <Trace opacity={0.3} />
      <Glow tone="blue" className="left-1/4 -top-40 h-[380px] w-[540px] opacity-45" />
      <Container className="relative">
        <div className="mx-auto max-w-lg py-16 text-center sm:py-24">
          <p className="font-mono text-6xl font-bold tabular-nums text-line-strong">404</p>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{dict.errors.notFound.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {dict.errors.notFound.body}
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/en">{dict.errors.notFound.cta}</Button>
          </div>
          <p className="mt-6 text-sm">
            <Link href="/fr" className="text-secondary-text hover:text-secondary" hrefLang="fr">
              Version française
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
