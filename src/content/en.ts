import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "Daniel TIOMELA  Software Engineer",
    description:
      "Software Engineer building modern web applications, scalable APIs and reliable software infrastructure. Full stack and DevOps, based in Yaoundé, working remotely.",
    keywords: [
      "Software Engineer",
      "Full Stack Developer",
      "Django",
      "React",
      "Next.js",
      "DevOps",
      "Kubernetes",
      "Geospatial",
      "PostGIS",
      "Remote",
      "Cameroon",
    ],
  },

  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    blog: "Writing",
    cv: "CV",
    uses: "Stack",
    contact: "Contact",
    skipToContent: "Skip to main content",
    menu: "Open menu",
    close: "Close menu",
    language: "Language",
  },

  hero: {
    eyebrow: "Software Engineer · Full Stack & DevOps",
    name: "Daniel TIOMELA",
    role: "Software Engineer",
    lede: "I build modern web applications, scalable APIs and reliable software infrastructure  from the data model through to the deployment pipeline.",
    ctaPrimary: "See my work",
    ctaSecondary: "Get in touch",
    availability: "Open to remote roles worldwide",
    availabilityDetail:
      "UTC+1 - overlaps most of the working day with Europe, mornings with the Americas. I reply within a day.",
  },

  readyNow: {
    label: "Ready now",
    title: "Where I can help immediately",
    kicker: "Three things I've actually shipped in production, not a wishlist.",
    items: [
      {
        title: "Backend systems at scale",
        body: "Django and DRF APIs designed as contracts before the endpoints exist: authentication, business logic and data modelling, built to be maintained by someone who isn't me.",
      },
      {
        title: "Geospatial data platforms",
        body: "PostGIS, GeoServer, Elasticsearch and mapping APIs - turning location data into search, mapping and reporting people actually use, across five production systems.",
      },
      {
        title: "Deployment & infrastructure",
        body: "Docker, Kubernetes and GitLab CI/CD from preproduction through production, including standing up infrastructure on-site in a national datacenter, not just a managed cloud.",
      },
    ],
  },

  about: {
    label: "About",
    title: "I own things through production",
    lede: "Merging is the middle of the job, not the end.",
    paragraphs: [
      "I'm based in Yaoundé, Cameroon, and trained as a software engineer at IAI Yaoundé (an engineering diploma in computer science and a Licence in software engineering, both awarded with distinction). Most of what I've built since has been for institutional clients: a national real-estate company, government digital-observatory programmes across West and Central Africa, and municipal authorities managing their own data. That work rarely comes with a spec you can trust - it comes with an existing system, a client who understands the problem better than the technology, and a deadline set by someone else's budget cycle.",
      "I've led three of those engagements end to end - architecture, delivery, and the on-site work of standing up infrastructure inside a client's own datacenter rather than a managed cloud. That included training the people who'd actually run the system after I left, and writing documentation so the next engineer wouldn't need me on a call. I'm currently a Junior Solutions Architect and DevOps engineer, which in practice means as much time on Kubernetes manifests and code-review standards as on application code.",
      "A good part of that work turned out to be geospatial - PostGIS, GeoServer, Elasticsearch, mapping APIs - because most of the systems I was asked to build had a location at the center of them: where a property sits, where a service gets delivered, where a boundary actually falls. It isn't a specialisation I set out to have; it's the shape of the problems that kept showing up.",
      "I work in French (C1) and English (B1), from UTC+1, which overlaps most of the European working day and the morning in the Americas. Distributed work doesn't change what makes software good - it just removes the option of clarifying a decision by walking over to someone's desk, so I write more down and assume less.",
    ],
    facts: [
      { label: "Based in", value: "Yaoundé, Cameroon" },
      { label: "Timezone", value: "UTC+1 - overlaps Europe and the Americas" },
      { label: "Working", value: "Remote, worldwide" },
      { label: "Languages", value: "French (C1), English (B1)" },
      {
        label: "Education",
        value: "Engineering diploma & Licence, IAI Yaoundé (with distinction)",
      },
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
    geospatial: "Geospatial",
    geospatialItems: [
      "PostGIS",
      "GeoServer",
      "Elasticsearch",
      "Kibana",
      "QGIS",
      "ArcGIS",
      "Google Maps API",
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
    kicker:
      "Real systems delivered for real clients: from a public map-based marketplace to a government datacenter deployment.",
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
      period: "Duration",
      client: "Client",
      context: "Context",
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
    groups: [
      {
        title: "DevOps & Cloud",
        items: [
          {
            name: "HELM MasterClass: Kubernetes Packaging Manager",
            provider: "Udemy",
            date: "Aug 2025",
          },
          {
            name: "Introduction to DevOps Tools",
            provider: "SkillUp / Simplilearn",
            date: "May 2026",
          },
          {
            name: "Getting Started with Docker",
            provider: "SkillUp / Simplilearn",
            date: "May 2026",
          },
          {
            name: "AI for Cloud Infrastructure: Automating AWS with StationOps",
            provider: "Udemy",
            date: "Aug 2025",
          },
        ],
      },
      {
        title: "Web & Software Development",
        items: [
          {
            name: "Master Django Web Development: Hands-On Projects",
            provider: "Alison",
            date: "Feb 2025",
          },
          {
            name: "Django Essentials: Build and Deploy Real-World Apps",
            provider: "Udemy",
            date: "Apr 2025",
          },
          {
            name: "Node.js: Modern RESTful API Fundamentals",
            provider: "Udemy",
            date: "Mar 2025",
          },
          {
            name: "The Complete JavaScript Course: From Zero to Expert",
            provider: "Udemy",
            date: "Apr 2025",
          },
          {
            name: "Intro to JavaScript for React Developers",
            provider: "CodeSignal",
            date: "Feb 2025",
          },
          {
            name: "Python Development and Programming Fundamentals",
            provider: "Udemy",
            date: "Apr 2025",
          },
          {
            name: "Software Architecture & Clean Code Design in OOP",
            provider: "Learn IT University",
            date: "2025",
          },
        ],
      },
      {
        title: "Methodology & Management",
        items: [
          {
            name: "Scrum Fundamentals Certified (SFC)",
            provider: "SCRUMstudy",
            date: "Sept 2025",
          },
          {
            name: "Marketing Strategy Fundamentals (SCMS-F)",
            provider: "SMstudy",
            date: "Sept 2025",
          },
        ],
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

  cv: {
    label: "CV",
    title: "Daniel TIOMELA - Software Engineer",
    kicker:
      "Full Stack & DevOps engineer, Yaoundé, Cameroon. Open to remote roles worldwide.",
    downloadCta: "Download PDF",
    skillsTitle: "Skills",
    skillGroups: [
      {
        title: "Languages",
        items: ["Python", "JavaScript", "TypeScript", "SQL", "C", "C++", "HTML5", "CSS3"],
      },
      {
        title: "Frameworks & Libraries",
        items: [
          "Django",
          "Django REST Framework",
          "React",
          "React Native",
          "Next.js",
          "Angular",
          "Node.js",
          "Tailwind CSS",
          "jQuery",
          "Bootstrap",
        ],
      },
      {
        title: "DevOps & Cloud",
        items: [
          "Docker",
          "Kubernetes",
          "Helm",
          "GitLab CI/CD",
          "Git",
          "GitHub",
          "Linux",
          "VMware",
          "Vercel",
          "AWS (basics)",
        ],
      },
      { title: "Servers", items: ["Apache", "NGINX"] },
      { title: "Databases", items: ["PostgreSQL", "PostGIS", "MySQL", "MongoDB"] },
      {
        title: "GIS / Geomatics",
        items: ["QGIS", "ArcGIS", "GeoServer", "Google Maps API", "Elasticsearch", "Kibana"],
      },
      { title: "Mobile", items: ["React Native", "Expo"] },
      { title: "AI Tools", items: ["Claude Code", "GitHub Copilot", "Cursor"] },
      { title: "Methods & Modelling", items: ["Agile", "Scrum", "Merise", "UML"] },
    ],
    experienceTitle: "Experience",
    personalProjectsTitle: "Personal projects",
    educationTitle: "Education",
    education: [
      {
        degree: "Engineering Diploma in Computer Science (Analyst-Programmer)",
        school: "Institut Africain d'Informatique (IAI), Yaoundé",
        period: "11/2022 - 07/2023",
        note: "With distinction",
      },
      {
        degree: "Licence in Software Engineering",
        school: "Institut Africain d'Informatique (IAI), Yaoundé",
        period: "11/2020 - 10/2023",
        note: "With distinction",
      },
      {
        degree: "Higher Technician Diploma (DTS)",
        school: "Institut Africain d'Informatique (IAI), Yaoundé",
        period: "11/2020 - 09/2022",
        note: "With distinction",
      },
      {
        degree: "Baccalauréat",
        school: "Lycée du Manengouba",
        period: "09/2019 - 09/2020",
        note: "",
      },
    ],
    priorRole: {
      title: "Web Developer",
      org: "AL-INFOTECH",
      period: "01/2021 - 11/2022",
      summary:
        "Front-end and back-end web interfaces (PHP, MySQL, WordPress); built and maintained responsive websites; configured hosting infrastructure and wrote technical documentation; trained clients and provided support under an Agile process.",
      stack: ["PHP", "MySQL", "WordPress", "HTML", "CSS", "JavaScript"],
    },
  },

  uses: {
    label: "Stack",
    title: "What I use, and why",
    kicker: "Not everything I've touched  the tools I reach for, and the reason.",
    items: [
      {
        name: "Django + Django REST Framework",
        why: "APIs as contracts, not endpoints that happen to exist: the data model comes first, the routes follow.",
      },
      {
        name: "PostgreSQL / PostGIS",
        why: "Most of the systems I build have a location at the center of them, so geography lives in the database, not in application code.",
      },
      {
        name: "Next.js + TypeScript",
        why: "One frontend framework across nearly every project I've shipped: fewer surprises, faster ramp-up on someone else's code.",
      },
      {
        name: "Docker",
        why: "Running a service locally and running it in production should be the same operation.",
      },
      {
        name: "Kubernetes + Helm",
        why: "Once a system needs more than one service talking to itself reliably, orchestration stops being optional.",
      },
      {
        name: "GitLab CI/CD",
        why: "Repetitive work belongs in a pipeline, not in someone's afternoon.",
      },
      {
        name: "GeoServer, QGIS & ArcGIS",
        why: "The tools that turn a spatial database into a map someone can actually query.",
      },
      {
        name: "Elasticsearch + Kibana",
        why: "For the observatory and reporting systems where the interesting question is \"search across all of this,\" not \"fetch one row.\"",
      },
      {
        name: "Nginx + Linux",
        why: "The unglamorous layer that decides whether HTTPS and uptime actually happen.",
      },
      {
        name: "Claude Code, GitHub Copilot & Cursor",
        why: "AI tools I use daily for the same reason I automate anything: so the day goes on the decision, not the boilerplate.",
      },
    ],
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
