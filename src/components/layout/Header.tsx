"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Brand";
import { Container } from "@/components/layout/Section";
import { cn } from "@/lib/utils";
import { locales, localeNames, swapLocale, type Locale } from "@/lib/i18n";
import { features } from "@/lib/site";
import type { Dictionary } from "@/content/types";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: `/${locale}`, label: dict.nav.home, exact: true },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/projects`, label: dict.nav.projects },
    ...(features.blog
      ? [{ href: `/${locale}/blog`, label: dict.nav.blog }]
      : []),
    { href: `/${locale}/stack`, label: dict.nav.uses },
    { href: `/${locale}/cv`, label: dict.nav.cv },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  // Close on route change  otherwise the panel survives navigation. Adjusted
  // during render rather than in an effect: the closed panel is what paints,
  // instead of the open one flashing for a frame on the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 rounded py-2"
          aria-label={`${dict.hero.name}  ${dict.nav.home}`}
        >
          <Monogram className="w-11 sm:w-12" />
        </Link>

        <nav
          aria-label={dict.nav.menu}
          className="hidden items-center gap-1 md:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href, l.exact) ? "page" : undefined}
              className={cn(
                "rounded-sm px-3.5 py-2.5 text-sm transition-colors duration-200",
                isActive(l.href, l.exact)
                  ? "text-text-strong"
                  : "text-muted hover:text-text",
              )}
            >
              {l.label}
            </Link>
          ))}
          <span aria-hidden="true" className="mx-2 h-5 w-px bg-line" />
          <LocaleSwitcher
            locale={locale}
            pathname={pathname}
            label={dict.nav.language}
          />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <LocaleSwitcher
            locale={locale}
            pathname={pathname}
            label={dict.nav.language}
          />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            className="grid size-11 place-items-center rounded-sm text-text"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3.5 7h17M3.5 12h17M3.5 17h17"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile panel  a disclosure, not a modal: the page stays reachable. */}
      <div
        id={menuId}
        hidden={!open}
        className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
      >
        <Container>
          <nav aria-label={dict.nav.menu} className="flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href, l.exact) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-sm px-2 text-[15px]",
                  isActive(l.href, l.exact) ? "text-text-strong" : "text-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}

function LocaleSwitcher({
  locale,
  pathname,
  label,
}: {
  locale: Locale;
  pathname: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={label}>
      {locales.map((l) => {
        const current = l === locale;
        return (
          <Link
            key={l}
            href={swapLocale(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={current ? "true" : undefined}
            aria-label={localeNames[l]}
            className={cn(
              "grid min-h-11 min-w-11 place-items-center rounded-sm",
              "font-mono text-xs uppercase tracking-widest transition-colors duration-200",
              current ? "text-secondary-text" : "text-faint hover:text-muted",
            )}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
