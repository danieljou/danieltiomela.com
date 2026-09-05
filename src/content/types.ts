export type Locale = "en" | "fr";

/** A block in an architecture row: what it does, never which framework does it. */
export interface ArchNode {
  name: string;
  kind: string;
}

export interface CaseSection {
  /** 01 … 07  the case-study spine from the brand system. */
  step: string;
  title: string;
  body: string[];
}

export interface Project {
  slug: string;
  /** Ordering weight  lower shows first. */
  order: number;
  featured: boolean;
  status: "live" | "building" | "progress";
  year: string;
  role: string;
  stack: string[];
  repo?: string;
  demo?: string;
  architecture?: ArchNode[];
  /** Only rendered when a real, verifiable figure exists. */
  metrics?: { value: string; label: string; note?: string }[];
  i18n: Record<
    Locale,
    {
      name: string;
      tagline: string;
      summary: string;
      focus: string;
      /** Full case study. Leave empty and the page falls back to the summary. */
      sections?: CaseSection[];
    }
  >;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  nav: {
    home: string;
    about: string;
    projects: string;
    blog: string;
    contact: string;
    skipToContent: string;
    menu: string;
    close: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    availability: string;
  };
  about: {
    label: string;
    title: string;
    lede: string;
    paragraphs: string[];
    facts: { label: string; value: string }[];
  };
  principles: {
    label: string;
    title: string;
    kicker: string;
    items: { title: string; body: string }[];
  };
  build: {
    label: string;
    title: string;
    kicker: string;
    items: { title: string; body: string }[];
  };
  systems: {
    label: string;
    title: string;
    kicker: string;
    caption: string;
    layers: { name: string; kind: string; items?: string[] }[];
  };
  stack: {
    label: string;
    title: string;
    kicker: string;
    core: string;
    coreItems: string[];
    infrastructure: string;
    infrastructureItems: string[];
    additional: string;
    additionalItems: string[];
  };
  projects: {
    label: string;
    title: string;
    kicker: string;
    all: string;
    viewCase: string;
    viewRepo: string;
    viewDemo: string;
    backToProjects: string;
    filterAll: string;
    empty: string;
    status: Record<Project["status"], string>;
    fields: {
      role: string;
      year: string;
      stack: string;
      focus: string;
      architecture: string;
    };
  };
  certifications: {
    label: string;
    title: string;
    kicker: string;
    columns: { name: string; provider: string; date: string };
    viewAll: string;
    items: { name: string; provider: string; date: string }[];
  };
  blog: {
    label: string;
    title: string;
    kicker: string;
    empty: { title: string; body: string; cta: string };
    readingTime: string;
  };
  contact: {
    label: string;
    title: string;
    kicker: string;
    lede: string;
    directLabel: string;
    directNote: string;
    form: {
      name: { label: string; placeholder: string; error: string };
      email: {
        label: string;
        placeholder: string;
        help: string;
        error: string;
      };
      subject: { label: string; placeholder: string; error: string };
      message: {
        label: string;
        placeholder: string;
        help: string;
        error: string;
      };
      required: string;
      requiredLegend: string;
      submit: string;
      submitting: string;
      success: { title: string; body: string };
      error: { title: string; body: string; retry: string };
    };
  };
  footer: {
    tagline: string;
    builtWith: string;
    rights: string;
    backToTop: string;
  };
  errors: {
    notFound: { title: string; body: string; cta: string };
    generic: { title: string; body: string; cta: string };
    loading: string;
  };
}
