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
  /** "12/2025  03/2026"  the full engagement span, for the facts panel. */
  period?: string;
  /** Real or anonymised  "SIC (HORIZON)" vs "a national real-estate company". */
  client?: string;
  /** Short team-shape note  "Solo" vs "Led a 4-person delivery team". */
  team?: string;
  /** One line of situational context, shown in the facts panel. */
  context?: string;
  /** Cover image. Optional  the page renders a brand fallback without it. */
  cover?: { src: string; alt: string };
  /** Same tools as `stack`, each with the job it actually did on this project. */
  stackDetail?: { name: string; role: string }[];
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
    cv: string;
    uses: string;
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
    /** Timezone overlap and reply time  the first objection to remote hiring. */
    availabilityDetail: string;
  };
  readyNow: {
    label: string;
    title: string;
    kicker: string;
    items: { title: string; body: string }[];
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
    geospatial: string;
    geospatialItems: string[];
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
      period: string;
      client: string;
      context: string;
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
    /** Grouped the way the CV itself groups them  never re-sorted flat. */
    groups: {
      title: string;
      items: { name: string; provider: string; date: string }[];
    }[];
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
  cv: {
    label: string;
    title: string;
    kicker: string;
    downloadCta: string;
    skillsTitle: string;
    skillGroups: { title: string; items: string[] }[];
    experienceTitle: string;
    personalProjectsTitle: string;
    educationTitle: string;
    education: { degree: string; school: string; period: string; note: string }[];
    /** The one real role that predates every project in `projects.ts`. */
    priorRole: {
      title: string;
      org: string;
      period: string;
      summary: string;
      stack: string[];
    };
  };
  uses: {
    label: string;
    title: string;
    kicker: string;
    items: { name: string; why: string }[];
  };
  errors: {
    notFound: { title: string; body: string; cta: string };
    generic: { title: string; body: string; cta: string };
    loading: string;
  };
}
