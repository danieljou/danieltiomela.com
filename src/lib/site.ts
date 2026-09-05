/**
 * Single source of truth for anything that appears in more than one place.
 * Change a handle here and the header, footer, structured data, sitemap and
 * email signature all follow.
 */
export const site = {
  url: "https://danieltiomela.com",
  name: "Daniel Tiomela",
  role: "Software Engineer",
  email: "danieltiomelajou@gmail.com",
  location: "Yaoundé, Cameroon",
  timezone: "UTC+1",
  links: {
    github: "https://github.com/danieljou",
    linkedin: "https://www.linkedin.com/in/daniel-tiomela-jou-40250b279/",
  },
  /** The house order. Never reshuffled  consistency is the point. */
  stack: [
    "Python",
    "Django",
    "React",
    "Next.js",
    "TypeScript",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
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
