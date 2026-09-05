import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { projects } from "@/content/projects";
import { site, features } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/projects",
    "/stack",
    "/cv",
    "/contact",
    ...(features.blog ? ["/blog"] : []),
  ];
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${site.url}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === "" ? "monthly" : "yearly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${site.url}/${l}${page}`]),
          ),
        },
      });
    }
  }

  for (const project of projects) {
    for (const locale of locales) {
      entries.push({
        url: `${site.url}/${locale}/projects/${project.slug}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${site.url}/${l}/projects/${project.slug}`]),
          ),
        },
      });
    }
  }

  return entries;
}
