import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "Daniel Tiomela  Software Engineer",
    description:
      "Software Engineer building modern web applications, scalable APIs and reliable software infrastructure. Full stack and DevOps, based in Yaoundé, working remotely.",
    keywords: [
      "Software Engineer",
      "Full Stack Developer",
      "Django",
      "React",
      "Next.js",
      "DevOps",
      "Remote",
      "Cameroon",
    ],
  },

  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    blog: "Writing",
    contact: "Contact",
    skipToContent: "Skip to main content",
    menu: "Open menu",
    close: "Close menu",
    language: "Language",
  },

  hero: {
    eyebrow: "Software Engineer · Full Stack & DevOps",
    name: "Daniel Tiomela",
    role: "Software Engineer",
    lede: "I build modern web applications, scalable APIs and reliable software infrastructure  from the data model through to the deployment pipeline.",
    ctaPrimary: "See my work",
    ctaSecondary: "Get in touch",
    availability: "Open to remote roles worldwide",
  },

  about: {
    label: "About",
    title: "I own things through production",
    lede: "Merging is the middle of the job, not the end.",
    paragraphs: [
      "I work across the stack  frontend interfaces, backend architecture, and the infrastructure that puts both into production. Most of what I build is meant to run for years and be maintained by someone who is not me.",
      "That shapes how I work. I reach for clear architecture over clever solutions, because clever code is a debt someone pays later. I write decisions down before they get argued about. And I would rather carry a feature through deployment and stay with it afterwards than hand it over at review.",
      "The part of engineering I find most interesting is the second delivery of the same message  retries, replays, duplicate events. Designing for that before the happy path is what separates a system that survives contact with real users from one that needs watching.",
    ],
    facts: [
      { label: "Based in", value: "Yaoundé, Cameroon" },
      { label: "Timezone", value: "UTC+1  overlaps Europe and the Americas" },
      { label: "Working", value: "Remote, worldwide" },
      { label: "Languages", value: "French (native), English" },
    ],
  },

  principles: {
    label: "How I work",
    title: "Engineering principles",
    kicker: "Five rules that decide the arguments before they start.",
    items: [
      {
        title: "Build with purpose",
        body: "Solve the real problem before adding complexity. Most features are a symptom of a question nobody asked properly.",
      },
      {
        title: "Keep it maintainable",
        body: "Clear architecture and readable code outlive clever code. The next person to open the file is the actual user.",
      },
      {
        title: "Automate what matters",
        body: "Repetitive work belongs in tooling, not in someone's day. If it happens twice, it gets a script.",
      },
      {
        title: "Design for reliability",
        body: "Systems should be observable, testable and boring in production. Excitement at 2 a.m. is a design failure.",
      },
      {
        title: "Ship and iterate",
        body: "Software gets good through feedback, not through planning. A deployed guess beats a perfect document.",
      },
    ],
  },

  build: {
    label: "What I build",
    title: "Systems, not just screens",
    kicker: "Five kinds of work, all of which end in production.",
    items: [
      {
        title: "Web applications",
        body: "Modern interfaces and production-ready applications, built with React and Next.js on top of real data models.",
      },
      {
        title: "APIs & backend systems",
        body: "REST APIs, authentication, business logic and data services  designed as contracts, not as endpoints that happen to exist.",
      },
      {
        title: "Software architecture",
        body: "Modular systems, integrations and application structure that a new engineer can read without a guided tour.",
      },
      {
        title: "DevOps & infrastructure",
        body: "Containerised deployments, CI/CD pipelines, reverse proxies and cloud environments that make releasing a non-event.",
      },
      {
        title: "Mobile applications",
        body: "Cross-platform applications with Flutter or React Native, when the product genuinely needs to be in a pocket.",
      },
    ],
  },

  systems: {
    label: "System thinking",
    title: "How I think about systems",
    kicker:
      "A generic shape, not a specific project  the layers I reason in before writing any code.",
    caption:
      "Each layer names what it does, never which framework does it. The framework is the part most likely to change.",
    layers: [
      { name: "Users", kind: "people" },
      { name: "Web / Mobile", kind: "interface" },
      {
        name: "API",
        kind: "contract",
        items: ["Authentication", "Business logic", "Integrations"],
      },
      {
        name: "Data",
        kind: "state",
        items: ["PostgreSQL", "Redis", "Storage"],
      },
      {
        name: "Infrastructure",
        kind: "delivery",
        items: ["Docker", "CI/CD", "Cloud"],
      },
    ],
  },

  stack: {
    label: "Tools",
    title: "Engineering stack",
    kicker:
      "Not everything I have touched  what I actually reach for, in the order I reach for it.",
    core: "Core",
    coreItems: [
      "Python",
      "Django",
      "Django REST Framework",
      "React",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Docker",
    ],
    infrastructure: "Infrastructure",
    infrastructureItems: [
      "Linux",
      "Nginx",
      "CI/CD",
      "Containers",
      "Cloud",
      "Deployment",
    ],
    additional: "Also work with",
    additionalItems: [
      "Flutter",
      "React Native",
      "Node.js",
      "MongoDB",
      "Redis",
      "GraphQL",
      "Firebase",
    ],
  },

  projects: {
    label: "Work",
    title: "Selected projects",
    kicker: "Three systems, and what each one taught me.",
    all: "All projects",
    viewCase: "Read the case study",
    viewRepo: "View repository",
    viewDemo: "View live site",
    backToProjects: "Back to projects",
    filterAll: "All",
    empty: "No projects match this filter yet.",
    status: {
      live: "Live",
      building: "In development",
      progress: "In progress",
    },
    fields: {
      role: "Role",
      year: "Year",
      stack: "Built with",
      focus: "Focus",
      architecture: "Architecture",
    },
  },

  certifications: {
    label: "Credentials",
    title: "Certifications",
    kicker: "Recent and verifiable.",
    columns: { name: "Certification", provider: "Provider", date: "Date" },
    viewAll: "View all certifications on LinkedIn",
    items: [
      {
        name: "Scrum Fundamentals Certified (SFC™)",
        provider: "ScrumStudy",
        date: "Sept 2025",
      },
      {
        name: "Software Architecture & Code Design in OOP",
        provider: "Udemy",
        date: "Jun 2025",
      },
      {
        name: "Node.js  Modern RESTful API Fundamentals",
        provider: "Udemy",
        date: "Apr 2025",
      },
      {
        name: "Master Django Web Development",
        provider: "Alison",
        date: "Feb 2025",
      },
      {
        name: "Intro to JavaScript for React Developers",
        provider: "CodeSignal",
        date: "Feb 2025",
      },
    ],
  },

  blog: {
    label: "Writing",
    title: "Engineering notes",
    kicker: "Things worth writing down once and pointing at afterwards.",
    empty: {
      title: "Nothing published yet",
      body: "The first notes are being written. In the meantime, the case studies cover how these systems were actually built.",
      cta: "Read the case studies",
    },
    readingTime: "min read",
  },

  contact: {
    label: "Contact",
    title: "Let's build something",
    kicker: "I answer within a day.",
    lede: "I'm interested in engineering problems worth solving, products that need building properly, and teams where an engineer is trusted to own a feature end to end.",
    directLabel: "Prefer email?",
    directNote: "Write directly  it reaches me just as fast.",
    form: {
      name: {
        label: "Your name",
        placeholder: "Jane Okafor",
        error: "Please enter your name.",
      },
      email: {
        label: "Email address",
        placeholder: "jane@company.com",
        help: "So I can reply. Nothing else.",
        error: "Please enter a valid email address.",
      },
      subject: {
        label: "Subject",
        placeholder: "Backend role at …",
        error: "Please add a subject.",
      },
      message: {
        label: "Message",
        placeholder: "What are you building, and where would I fit?",
        help: "A few sentences is plenty.",
        error: "Please write at least 20 characters.",
      },
      required: "required",
      requiredLegend: "Fields marked * are required.",
      submit: "Send message",
      submitting: "Sending…",
      success: {
        title: "Message sent",
        body: "Thanks  it landed. I'll get back to you within a day.",
      },
      error: {
        title: "That didn't send",
        body: "Something went wrong on my end. Email me directly and it will reach me.",
        retry: "Try again",
      },
    },
  },

  footer: {
    tagline: "Building software. Engineering solutions.",
    builtWith: "Built with Next.js and TypeScript",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },

  errors: {
    notFound: {
      title: "This page does not exist",
      body: "The link may be out of date, or the page may have moved. Everything else is still where it was.",
      cta: "Back to home",
    },
    generic: {
      title: "Something broke",
      body: "An unexpected error occurred. Reloading usually fixes it  if it doesn't, tell me and I'll look at it.",
      cta: "Try again",
    },
    loading: "Loading",
  },
};
