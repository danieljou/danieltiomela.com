import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { Container, Section, SectionHeader } from "@/components/layout/Section";
import { EmptyState } from "@/components/feedback/States";
import { Trace } from "@/components/brand/Brand";

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
    title: dict.blog.title,
    description: dict.blog.kicker,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { en: "/en/blog", fr: "/fr/blog" },
    },
    // Nothing to index until something is published.
    robots: { index: false, follow: true },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typed = locale as Locale;
  const dict = getDictionary(typed);

  // Posts land here once written. The empty state is the honest state until then.
  const posts: { slug: string; title: string }[] = [];

  return (
    <Section className="relative overflow-hidden pt-12 sm:pt-20">
      <Trace opacity={0.26} />
      <Container className="relative">
        <SectionHeader
            as="h1"
          label={dict.blog.label}
          title={dict.blog.title}
          kicker={dict.blog.kicker}
        />
        {posts.length === 0 && (
          <EmptyState
            className="mt-12"
            title={dict.blog.empty.title}
            body={dict.blog.empty.body}
            action={{ label: dict.blog.empty.cta, href: `/${typed}/projects` }}
          />
        )}
      </Container>
    </Section>
  );
}
