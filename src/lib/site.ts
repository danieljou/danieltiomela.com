/**
 * Single source of truth for anything that appears in more than one place.
 * Change a handle here and the header, footer, structured data, sitemap and
 * email signature all follow.
 */
export const site = {
  url: "https://danieltiomela.com",
  name: "Daniel TIOMELA",
  role: "Software Engineer",
  email: "danieltiomelajou@gmail.com",
  location: "Yaoundé, Cameroon",
  timezone: "UTC+1",
  links: {
    github: "https://github.com/danieljou",
    linkedin: "https://www.linkedin.com/in/daniel-tiomela-jou-40250b279/",
  },
  /**
   * Expected at this path in `public/`  not present yet. Until the file is
   * added, the download button on /cv links here and 404s. See the /cv
   * page's own note in the codebase for what to drop in and where.
   */
  cvPdfPath: "/Daniel-Tiomela-Jou-Software-Engineer.pdf",
  /** The house order. Never reshuffled  consistency is the point. */
  stack: [
    "Python",
    "Django",
    "PostgreSQL / PostGIS",
    "Next.js",
    "TypeScript",
    "Kubernetes",
    "Docker",
    "React",
    "GeoServer",
  ],
} as const;

/**
 * Sections are hidden until they hold something worth reading.
 * An empty blog costs more credibility than no blog at all  flip this to
 * true once two posts are published.
 */
export const features = {
  blog: false,
} as const;
