import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { Card, Rule } from "@/components/ui/Card";
import { Trace, Glow } from "@/components/brand/Brand";
import {
  Principles,
  StackSection,
  ContactCTA,
} from "@/components/sections/Sections";

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
    title: dict.about.label,
    description: dict.about.paragraphs[0],
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", fr: "/fr/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typed = locale as Locale;
  const dict = getDictionary(typed);

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
            label={dict.about.label}
            title={dict.about.title}
            kicker={dict.about.lede}
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div className="space-y-6">
              {dict.about.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="max-w-prose text-[17px] leading-relaxed text-text"
                >
                  {p}
                </p>
              ))}
              <Rule className="mt-2" />
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-line bg-surface">
                <Image
                  src="/assets/brand/avatar.png"
                  alt={`${dict.hero.name}  ${dict.hero.role}`}
                  width={800}
                  height={800}
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="w-full"
                />
              </div>
              <Card>
                <dl className="space-y-4">
                  {dict.about.facts.map((f) => (
                    <div key={f.label}>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                        {f.label}
                      </dt>
                      <dd className="mt-1 text-[15px] text-text">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Principles dict={dict} />
      <StackSection dict={dict} />
      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
