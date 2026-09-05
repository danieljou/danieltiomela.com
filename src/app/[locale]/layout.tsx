import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  // `cover` lets the background reach the edges on notched phones. The
  // `gutter` utility in globals.css is what then keeps text out of the notch.
  viewportFit: "cover",
  themeColor: "#0A1122",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.title,
      template: `%s  ${site.name}`,
    },
    description: dict.meta.description,
    keywords: [...dict.meta.keywords],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: "/assets/brand/og.png",
          width: 1280,
          height: 640,
          alt: `${site.name}  ${site.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/assets/brand/og.png"],
    },
    icons: {
      icon: [
        { url: "/assets/brand/favicon.svg", type: "image/svg+xml" },
        {
          url: "/assets/brand/favicon-32.png",
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: "/assets/brand/favicon-180.png",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yaoundé",
      addressCountry: "CM",
    },
    sameAs: [site.links.github, site.links.linkedin],
    knowsAbout: [...site.stack],
  };

  return (
    <html lang={typedLocale} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only rounded-md focus:not-sr-only focus:absolute
                     focus:left-4 focus:top-4 focus:z-[100] focus:bg-secondary
                     focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
        >
          {dict.nav.skipToContent}
        </a>

        <div id="top" className="flex min-h-dvh flex-col">
          <Header locale={typedLocale} dict={dict} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={typedLocale} dict={dict} />
        </div>

        <script
          type="application/ld+json"
          // Static, author-controlled object  no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
