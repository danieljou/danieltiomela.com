"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Glow, Monogram, Node, Trace } from "@/components/brand/Brand";
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

  // The overlay covers the page, so lock the scroll it sits on top of.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
          className="group flex items-center gap-3 rounded-md border border-line p-2 transition-colors duration-200 hover:border-line-strong"
          aria-label={`${dict.hero.name}  ${dict.nav.home}`}
        >
          <Monogram className="w-8 sm:w-9" />
        </Link>

        <nav
          aria-label={dict.nav.menu}
          className="hidden items-center gap-1.5 md:flex"
        >
          {links.map((l) => {
            const active = isActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm transition-colors duration-200",
                  active
                    ? "border-secondary/40 bg-secondary/6 text-text-strong"
                    : "border-line text-muted hover:border-line-strong hover:text-text",
                )}
              >
                {active && <Node className="size-1.5" />}
                {l.label}
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-line" />
          <LocaleSwitcher
            locale={locale}
            pathname={pathname}
            label={dict.nav.language}
          />
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
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
            className="relative z-50 grid size-11 place-items-center rounded-md border border-line text-text transition-colors duration-200 hover:border-line-strong"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 7h17M3.5 12h17M3.5 17h17"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                className={cn(
                  "origin-center transition-[opacity,transform] duration-300 ease-brand",
                  open && "opacity-0",
                )}
              />
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                className={cn(
                  "origin-center scale-75 opacity-0 transition-[opacity,transform] duration-300 ease-brand",
                  open && "scale-100 opacity-100",
                )}
              />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile overlay  a curtain that opens from the vertical centre of the
          viewport rather than dropping from the header, via a clip-path
          wipe. Kept in the DOM (not `hidden`) so the transition can run;
          `inert` removes it from tab order and hit-testing while closed. */}
      <div
        id={menuId}
        aria-hidden={!open}
        inert={!open || undefined}
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink/97 backdrop-blur-md md:hidden",
          "transition-[clip-path,opacity] duration-500 ease-brand",
          open
            ? "opacity-100 [clip-path:inset(0_0_0_0)]"
            : "pointer-events-none opacity-0 [clip-path:inset(50%_0_50%_0)]",
        )}
      >
        <Trace className="opacity-[0.22]" />
        <Glow
          tone="cyan"
          className="left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3"
        />
        <Glow
          tone="violet"
          className="bottom-0 right-0 h-64 w-64 translate-y-1/3"
        />

        <Container className="relative flex min-h-full flex-col justify-between py-6">
          <nav aria-label={dict.nav.menu} className="flex flex-col gap-2.5">
            {links.map((l, i) => {
              const active = isActive(l.href, l.exact);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    transitionDelay: open ? `${90 + i * 60}ms` : "0ms",
                  }}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-lg border px-5 py-4",
                    "transition-[color,border-color,background-color,transform,opacity] duration-400 ease-brand",
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0",
                    active
                      ? "border-secondary/40 bg-secondary/6"
                      : "border-line hover:border-line-strong hover:bg-surface",
                  )}
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-xs text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-2xl font-semibold",
                        active ? "grad-text" : "text-text-strong",
                      )}
                    >
                      {l.label}
                    </span>
                  </span>
                  {active && <Node className="size-2" />}
                </Link>
              );
            })}
          </nav>

          <div
            style={{
              transitionDelay: open ? `${90 + links.length * 60}ms` : "0ms",
            }}
            className={cn(
              "mt-8 flex items-center justify-between border-t border-line pt-6",
              "transition-[opacity,transform] duration-400 ease-brand",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <span className="font-mono text-xs uppercase tracking-label text-faint">
              {dict.nav.language}
            </span>
            <LocaleSwitcher
              locale={locale}
              pathname={pathname}
              label={dict.nav.language}
            />
          </div>
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
    <div
      className="flex items-center gap-0.5 rounded-full border border-line p-0.5"
      role="group"
      aria-label={label}
    >
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
              "grid min-h-11 min-w-11 place-items-center rounded-full",
              "font-mono text-xs uppercase tracking-widest transition-colors duration-200",
              current
                ? "bg-secondary/6 text-secondary-text"
                : "text-faint hover:text-muted",
            )}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
