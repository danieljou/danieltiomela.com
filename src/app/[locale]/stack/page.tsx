import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Trace, Glow } from "@/components/brand/Brand";
import { TechIcon, type TechIconName } from "@/components/brand/TechIcon";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/sections/Sections";

/**
 * Icons live here, indexed to `dict.uses.items`, rather than in the
 * dictionary itself  an icon slug isn't translatable content, and this
 * keeps en.ts/fr.ts limited to actual copy.
 */
const ICONS: TechIconName[][] = [
  ["django"],
  ["postgresql"],
  ["nextdotjs", "typescript"],
  ["docker"],
  ["kubernetes", "helm"],
  ["gitlab"],
  ["qgis"],
  ["elasticsearch", "kibana"],
  ["nginx", "linux"],
  ["anthropic"],
];

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
            {dict.uses.items.map((item, i) => (
              <li key={item.name}>
                <Reveal delay={i * 60} className="h-full">
                  <Card className="h-full">
                    <div className="flex items-center gap-2">
                      {(ICONS[i] ?? []).map((icon) => (
                        <span
                          key={icon}
                          className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-surface text-secondary-text"
                        >
                          <TechIcon name={icon} />
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-3 font-display text-base font-semibold text-text-strong">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.why}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ContactCTA locale={typed} dict={dict} />
    </>
  );
}
