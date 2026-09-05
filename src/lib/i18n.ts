import type { Dictionary } from "@/content/types";
import { en } from "@/content/en";
import { fr } from "@/content/fr";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The same path in the other language  used by the locale switcher. */
export function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/") || "/";
  }
  return `/${next}${pathname}`;
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};
