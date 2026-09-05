import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Trace, Glow } from "@/components/brand/Brand";
import { ContactCTA } from "@/components/sections/Sections";

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
    title: dict.uses.title,
    description: dict.uses.kicker,
    alternates: {
      canonical: `/${locale}/stack`,
      languages: { en: "/en/stack", fr: "/fr/stack" },
    },
  };
}

export default async function StackPage({
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
          tone="cyan"
          className="-right-40 -top-40 h-[420px] w-[560px] opacity-40"
        />
        <Container className="relative">
          <SectionHeader
            as="h1"
            label={dict.uses.label}
            title={dict.uses.title}
            kicker={dict.uses.kicker}
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {dict.uses.items.map((item) => (
              <li key={item.name}>
                <Card className="h-full">
                  <h2 className="font-display text-base font-semibold text-text-strong">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.why}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
