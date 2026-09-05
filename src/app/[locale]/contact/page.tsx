import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { Card, Rule } from "@/components/ui/Card";
import { Trace, Glow } from "@/components/brand/Brand";
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
    title: dict.contact.title,
    description: dict.contact.lede,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", fr: "/fr/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <Section className="relative overflow-hidden pt-12 sm:pt-20">
      <Trace opacity={0.28} />
      <Glow tone="blue" className="-left-40 -top-48 h-[440px] w-[600px] opacity-45" />
      <Glow tone="cyan" className="-right-40 bottom-0 h-[380px] w-[500px] opacity-35" />

      <Container className="relative">
        <SectionHeader
            as="h1"
          label={dict.contact.label}
          title={dict.contact.title}
          kicker={dict.contact.lede}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <ContactForm dict={dict} />

          <aside className="space-y-6">
            <Card>
              <p className="font-display text-lg font-semibold text-text-strong">
                {dict.contact.directLabel}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {dict.contact.directNote}
              </p>
              <Rule className="mt-5" />
              <a
                href={`mailto:${site.email}`}
                className="mt-5 inline-flex min-h-11 items-center break-all text-[15px] text-secondary-text transition-colors duration-200 hover:text-secondary"
              >
                {site.email}
              </a>
            </Card>

            <Card>
              <dl className="space-y-4 text-[15px]">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    {dict.about.facts[0].label}
                  </dt>
                  <dd className="mt-1 text-text">
                    {site.location} · {site.timezone}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    {dict.nav.projects}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.links.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-secondary-text transition-colors duration-200 hover:text-secondary"
                    >
                      github.com/danieljou
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    LinkedIn
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.links.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-secondary-text transition-colors duration-200 hover:text-secondary"
                    >
                      Daniel Tiomela Jou
                    </a>
                  </dd>
                </div>
              </dl>
            </Card>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
