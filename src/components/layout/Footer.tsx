import Link from "next/link";
import { Monogram } from "@/components/brand/Brand";
import { Container } from "@/components/layout/Section";
import { Rule } from "@/components/ui/Card";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const elsewhere = [
    { href: site.links.github, label: "GitHub" },
    { href: site.links.linkedin, label: "LinkedIn" },
    { href: `mailto:${site.email}`, label: "Email" },
  ];

  return (
    <footer className="relative mt-8 border-t border-line">
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Monogram className="w-12" />
            <p className="mt-5 font-display text-lg font-bold text-text-strong">
              {site.name}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {site.role}
            </p>
            <p className="mt-4 text-sm italic text-muted">{dict.footer.tagline}</p>
          </div>

          <nav aria-label="Elsewhere" className="flex flex-col gap-3">
            {elsewhere.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-200 hover:text-secondary-text"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm text-muted">
            <p>
              {site.location} · {site.timezone}
            </p>
            <Link
              href={`/${locale}#top`}
              className="inline-flex min-h-11 items-center gap-2 transition-colors duration-200 hover:text-secondary-text"
            >
              {dict.footer.backToTop}
              <span aria-hidden="true">↑</span>
            </Link>
          </div>
        </div>

        <Rule className="mt-12" />

        <div className="mt-6 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </Container>
    </footer>
  );
}
