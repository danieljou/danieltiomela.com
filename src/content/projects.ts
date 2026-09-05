import type { Project } from "./types";

/**
 * Only verifiable facts live here: stack, repository, role, status, dates.
 * Everything traces back to Daniel's CV or his explicit confirmation  see
 * the confidentiality notes below for what is named and what is not.
 *
 * Two projects (immotic, giz-observatory-phase-2) carry a real case study in
 * `sections`. The rest render their summary, stack and architecture until
 * Daniel supplies the missing narrative  see the GAPS block at the bottom
 * of this file. No section is padded with text that reads as true and is
 * not; an incomplete case study stays incomplete rather than getting filler.
 *
 * Confidentiality: IMMOTIC and Passage Canada are freelance/personal work,
 * outside AFREETECH, and are named as-is. Every AFREETECH-delivered client
 * project below is anonymised by default (client identity replaced by a
 * generic, still-specific description)  Daniel asked for this as the
 * default rather than confirming each client individually. AFREETECH
 * CAMEROON SARL itself, as employer, is nameable.
 */
export const projects: Project[] = [
  {
    slug: "immotic",
    order: 1,
    featured: true,
    status: "live",
    year: "2026",
    period: "03/2026 - present",
    role: "Full Stack Developer",
    client: "Independent client project  freelance, outside AFREETECH",
    stack: [
      "Django",
      "Django REST Framework",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL / PostGIS",
      "Google Maps API",
      "Vercel",
    ],
    demo: "https://immotic.vercel.app",
    architecture: [
      { name: "Next.js interface", kind: "interface" },
      { name: "Search & filters", kind: "logic" },
      { name: "Django REST API", kind: "contract" },
      { name: "PostgreSQL / PostGIS", kind: "geodata" },
      { name: "Google Maps API", kind: "maps" },
    ],
    stackDetail: [
      { name: "Django REST Framework", role: "REST API and business logic" },
      {
        name: "PostgreSQL / PostGIS",
        role: "Geolocated listing storage and spatial queries",
      },
      {
        name: "Next.js / TypeScript",
        role: "Search UI, listing pages, user accounts",
      },
      { name: "Tailwind CSS", role: "Responsive, SEO-tuned layout" },
      { name: "Google Maps API", role: "Map rendering and geocoding" },
      { name: "Vercel", role: "Hosting and deployment" },
    ],
    i18n: {
      en: {
        name: "IMMOTIC",
        tagline:
          "A property platform where every listing lives on a map, not just a list.",
        summary:
          "A real-estate marketplace built solo and freelance: a Django/PostGIS backend for geolocated listings, a Next.js search experience with advanced filters, and a Google Maps integration so buyers browse by location, not just keyword. Public and live.",
        focus: "Geospatial data modelling · search & filtering · map UX",
        sections: [
          {
            step: "01",
            title: "Problem",
            body: [
              "Residential and commercial listings in Cameroon are scattered across informal channels  word of mouth, single-agency sites, social posts  with no shared way to search by criteria or see where a property actually sits. IMMOTIC set out to put listings, search and geography in one place.",
            ],
          },
          {
            step: "02",
            title: "Architecture",
            body: [
              "The data model is geography-first: every listing carries a PostGIS point, so searching by radius, neighbourhood or map viewport is a database query, not an application-layer filter. Django REST Framework exposes that as a typed API; Next.js and TypeScript consume it for search, listing pages and user accounts. The Google Maps API handles rendering and geocoding on top of coordinates the backend already validated.",
            ],
          },
          {
            step: "03",
            title: "Implementation",
            body: [
              "Built end to end: the Django/DRF backend and its PostGIS schema, the advanced filter and search engine, authentication and user spaces, the Next.js/Tailwind frontend, and the Google Maps integration for browsing listings spatially.",
              "Also handled the parts that don't show up in a demo  collecting and structuring real listing data with the client, tuning the site for performance and SEO, deploying to Vercel, and training the client to use and maintain it.",
            ],
          },
        ],
      },
      fr: {
        name: "IMMOTIC",
        tagline:
          "Une plateforme immobilière où chaque annonce vit sur une carte, pas seulement dans une liste.",
        summary:
          "Une plateforme immobilière construite en solo et en freelance : un backend Django/PostGIS pour des annonces géolocalisées, une expérience de recherche Next.js avec filtres avancés, et une intégration Google Maps pour parcourir les biens par localisation, pas seulement par mot-clé. Publique et en ligne.",
        focus: "Modélisation géospatiale · recherche & filtres · UX carto",
        sections: [
          {
            step: "01",
            title: "Problème",
            body: [
              "Au Cameroun, les annonces immobilières résidentielles et commerciales sont dispersées entre canaux informels  bouche-à-oreille, sites d'agences isolés, réseaux sociaux  sans moyen commun de chercher par critères ou de voir où se situe réellement un bien. IMMOTIC réunit annonces, recherche et géographie au même endroit.",
            ],
          },
          {
            step: "02",
            title: "Architecture",
            body: [
              "Le modèle de données est géographique dès le départ : chaque annonce porte un point PostGIS, si bien que chercher par rayon, par quartier ou par vue de carte est une requête base de données, pas un filtre applicatif. Django REST Framework expose cela sous forme d'API typée ; Next.js et TypeScript la consomment pour la recherche, les pages d'annonce et les comptes utilisateurs. L'API Google Maps prend en charge le rendu et le géocodage à partir de coordonnées déjà validées côté backend.",
            ],
          },
          {
            step: "03",
            title: "Réalisation",
            body: [
              "Construit de bout en bout : le backend Django/DRF et son schéma PostGIS, le moteur de recherche et de filtres avancés, l'authentification et les espaces utilisateurs, le frontend Next.js/Tailwind, et l'intégration Google Maps pour parcourir les biens dans l'espace.",
              "Pris en charge aussi ce qui ne se voit pas sur une démo : collecte et structuration des données réelles avec le client, optimisation des performances et du référencement, déploiement sur Vercel, et formation du client à l'utilisation et à la maintenance.",
            ],
          },
        ],
      },
    },
  },

  {
    slug: "passage-canada",
    order: 2,
    featured: true,
    status: "building",
    year: "2026",
    period: "En cours",
    role: "Creator & Solo Developer",
    client: "Personal project  freelance, no client",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
    demo: "https://passage-canada.vercel.app",
    architecture: [
      { name: "Next.js interface", kind: "interface" },
      { name: "Eligibility & scoring", kind: "logic" },
      { name: "Budget & checklist", kind: "state" },
    ],
    i18n: {
      en: {
        name: "Passage Canada",
        tagline: "The immigration math, done once, correctly, in the open.",
        summary:
          "A self-directed SaaS that walks candidates through Canadian immigration: eligibility screening, FSWP and CRS / Express Entry score calculators, round tracking, a migration budget planner and a document checklist. Personal project, live and evolving.",
        focus: "Calculators & scoring logic · Next.js · solo product ownership",
      },
      fr: {
        name: "Passage Canada",
        tagline: "Le calcul de l'immigration, fait une fois, correctement, en clair.",
        summary:
          "Un SaaS personnel qui accompagne les candidats à l'immigration canadienne : évaluation d'éligibilité, calculateurs de score FSWP et CRS / Entrée Express, suivi des rondes, planificateur de budget de migration et checklist documentaire. Projet perso, en ligne et en évolution.",
        focus: "Calculateurs & logique de score · Next.js · produit porté en solo",
      },
    },
  },

  {
    slug: "giz-observatory-phase-2",
    order: 3,
    featured: true,
    status: "live",
    year: "2026",
    period: "12/2025 - 03/2026",
    role: "Lead Developer",
    client: "A government digital-observatory programme, West Africa (anonymised)",
    context:
      "Delivered via AFREETECH CAMEROON SARL, including an on-site mission at the client's national datacenter.",
    stack: [
      "Django",
      "Django REST Framework",
      "Next.js",
      "Docker",
      "Kubernetes",
      "PostgreSQL / PostGIS",
      "Reverse proxy / HTTPS",
    ],
    architecture: [
      { name: "Next.js frontend", kind: "interface" },
      { name: "Django REST API", kind: "contract" },
      { name: "PostgreSQL / PostGIS", kind: "geodata" },
      { name: "Docker images", kind: "packaging" },
      { name: "Kubernetes cluster", kind: "orchestration" },
      { name: "Reverse proxy · HTTPS", kind: "delivery" },
    ],
    stackDetail: [
      { name: "Django REST Framework", role: "Observatory API and data model" },
      { name: "Next.js", role: "Public-facing frontend" },
      { name: "Docker", role: "Packaging every service for the cluster" },
      {
        name: "Kubernetes",
        role: "Production orchestration on the national datacenter cluster",
      },
      { name: "PostgreSQL / PostGIS", role: "Geospatial observatory data" },
      { name: "Reverse proxy", role: "On-site HTTPS/SSL termination" },
    ],
    i18n: {
      en: {
        name: "Government Digital Observatory  :  Phase 2",
        tagline:
          "Taking a national observatory from running software to a production system with a datacenter behind it.",
        summary:
          "Led the second phase of a government digital-observatory platform for an international development programme in West Africa: backend API, frontend, containerisation, and a Kubernetes deployment run in production. The distinguishing part was on-site  standing up the reverse proxy, HTTPS and persistent storage inside the client's own national datacenter, not a managed cloud.",
        focus: "Kubernetes deployment · on-site infrastructure · technical leadership",
        sections: [
          {
            step: "01",
            title: "Problem",
            body: [
              "An earlier phase had already produced a working version of the observatory. What was still open was turning it into a system a national institution could actually operate day to day, in its own infrastructure, rather than software that merely ran. That gap defined the phase 2 mandate.",
            ],
          },
          {
            step: "02",
            title: "Architecture",
            body: [
              "The brief split into two halves that had to ship together: the application  a Django/DRF API and a Next.js frontend, with PostgreSQL/PostGIS holding the observatory's geospatial data  and the infrastructure it would run on: Docker images for every service, a production Kubernetes cluster, and a reverse proxy terminating HTTPS on-site. Because deployment targeted the client's own national datacenter rather than a managed cloud, the infrastructure half wasn't optional scaffolding  it was as much the deliverable as the application.",
            ],
          },
          {
            step: "03",
            title: "Implementation",
            body: [
              "Led the phase as lead developer: designed and built the backend API and the Next.js frontend, containerised every service, and deployed the cluster in production.",
              "That included on-site DevOps missions at the client's national datacenter in West Africa  standing up the reverse proxy, HTTPS/SSL and persistent storage in place, rather than through a remote pipeline. Alongside the build, led the technical team, collected the observatory's data, trained the end users, and handed over documentation and support.",
            ],
          },
        ],
      },
      fr: {
        name: "Observatoire numérique gouvernemental  :  Phase 2",
        tagline:
          "Faire passer un observatoire national d'un logiciel qui tourne à un système en production, avec un datacenter derrière.",
        summary:
          "Piloté la deuxième phase d'une plateforme d'observatoire numérique gouvernemental pour un programme de développement international en Afrique de l'Ouest : API backend, frontend, conteneurisation et déploiement Kubernetes en production. La partie qui distingue ce projet s'est jouée sur site  mise en place du reverse proxy, du HTTPS et de la persistance des données dans le datacenter national du client, pas dans un cloud managé.",
        focus: "Déploiement Kubernetes · infrastructure sur site · leadership technique",
        sections: [
          {
            step: "01",
            title: "Problème",
            body: [
              "Une phase précédente avait déjà produit une première version de l'observatoire. Restait à en faire un système qu'une institution nationale pouvait réellement exploiter au quotidien, sur sa propre infrastructure, et non un logiciel qui se contentait de fonctionner. C'est ce qui a défini le mandat de la phase 2.",
            ],
          },
          {
            step: "02",
            title: "Architecture",
            body: [
              "Le mandat se scindait en deux volets à livrer ensemble : l'application  une API Django/DRF et un frontend Next.js, avec PostgreSQL/PostGIS pour les données géospatiales de l'observatoire  et l'infrastructure sur laquelle elle tournerait : des images Docker pour chaque service, un cluster Kubernetes de production, et un reverse proxy terminant le HTTPS sur site. Le déploiement visant le datacenter national du client plutôt qu'un cloud managé, le volet infrastructure n'était pas un à-côté : il pesait autant que l'application elle-même.",
            ],
          },
          {
            step: "03",
            title: "Réalisation",
            body: [
              "Piloté la phase en tant que Lead Développeur : conception et développement de l'API backend et du frontend Next.js, conteneurisation de chaque service, et déploiement du cluster en production.",
              "Cela a inclus des missions DevOps sur site, au datacenter national du client en Afrique de l'Ouest  mise en place du reverse proxy, du HTTPS/SSL et de la persistance des données directement sur place, plutôt que via un pipeline distant. En parallèle du développement, encadrement de l'équipe technique, collecte des données de l'observatoire, formation des utilisateurs finaux, et transmission de la documentation et du support.",
            ],
          },
        ],
      },
    },
  },

  {
    slug: "real-estate-platform-infrastructure",
    order: 4,
    featured: true,
    status: "live",
    year: "2025",
    period: "09/2025 - present",
    role: "Junior Solutions Architect · DevOps",
    client: "A national real-estate company (anonymised)",
    context: "Current role, delivered via AFREETECH CAMEROON SARL.",
    stack: [
      "Kubernetes",
      "Docker",
      "GitLab CI",
      "Bash",
      "Python",
      "Docker Volumes / Bind Mounts",
    ],
    architecture: [
      { name: "Application services", kind: "logic" },
      { name: "Docker images", kind: "packaging" },
      { name: "Kubernetes microservices", kind: "orchestration" },
      { name: "GitLab CI/CD", kind: "delivery" },
      { name: "Monitoring & logging", kind: "observability" },
    ],
    i18n: {
      en: {
        name: "Real-Estate Platform  :  Infrastructure & Architecture",
        tagline:
          "The architecture and the infrastructure behind a national real-estate platform, not just the app.",
        summary:
          "Current role as junior solutions architect and DevOps engineer for a national real-estate company: application architecture and technical documentation, preproduction/production infrastructure, a Kubernetes-orchestrated microservices setup, GitLab CI/CD, Docker image automation with Bash and Python, persistent-storage tuning, monitoring and logging, and code-review standards introduced across the team.",
        focus: "Kubernetes microservices · CI/CD · infrastructure automation",
      },
      fr: {
        name: "Plateforme immobilière  :  Architecture & Infrastructure",
        tagline:
          "L'architecture et l'infrastructure derrière une plateforme immobilière nationale, pas seulement l'application.",
        summary:
          "Poste actuel d'architecte logiciel junior et DevOps pour une société immobilière nationale : architectures applicatives et documentation technique, infrastructures de préproduction et de production, microservices orchestrés sous Kubernetes, CI/CD GitLab, automatisation des images Docker en Bash et Python, optimisation du stockage persistant, supervision et journalisation, et standards de revue de code instaurés dans l'équipe.",
        focus: "Microservices Kubernetes · CI/CD · automatisation d'infrastructure",
      },
    },
  },

  {
    slug: "gis-geodata-infrastructure",
    order: 5,
    featured: false,
    status: "live",
    year: "2025",
    period: "01/2025 - 09/2025",
    role: "Technical Lead",
    client: "A regional urban-planning authority (anonymised)",
    context: "Delivered via AFREETECH CAMEROON SARL.",
    stack: [
      "Next.js",
      "React",
      "Angular",
      "Django REST Framework",
      "PostgreSQL / PostGIS",
      "GeoServer",
      "Elasticsearch",
      "Kibana",
      "QGIS",
      "ArcGIS",
      "Docker Compose",
      "GitLab CI",
      "Hyper-V",
      "Windows Server",
      "Java",
    ],
    architecture: [
      { name: "Web clients", kind: "interface" },
      { name: "Django REST API", kind: "contract" },
      { name: "PostGIS / GeoServer", kind: "geodata" },
      { name: "Elasticsearch / Kibana", kind: "search" },
      { name: "Windows Server / Hyper-V", kind: "hosting" },
    ],
    i18n: {
      en: {
        name: "GIS & Geographic Data Infrastructure",
        tagline:
          "Two systems, one shared question: where does this data actually live, geographically.",
        summary:
          "Technical lead on two applications for a regional urban-planning authority: a GIS and a geographic-data infrastructure (IDG). Analysed existing processes and scoped both systems, designed the architecture across Next.js/Django REST, PostgreSQL/PostGIS, GeoServer, Elasticsearch and Kibana, set up GitLab CI pipelines, and configured the serving infrastructure on Hyper-V and Windows Server.",
        focus: "GIS architecture · GeoServer & spatial data · technical leadership",
      },
      fr: {
        name: "SIG & Infrastructure de données géographiques",
        tagline:
          "Deux systèmes, une même question : où vit réellement cette donnée, géographiquement.",
        summary:
          "Lead technique sur deux applications pour une autorité régionale d'urbanisme : un SIG et une infrastructure de données géographiques (IDG). Analyse des processus existants et cadrage des deux systèmes, conception de l'architecture autour de Next.js/Django REST, PostgreSQL/PostGIS, GeoServer, Elasticsearch et Kibana, mise en place des pipelines GitLab CI, et configuration des serveurs sur Hyper-V et Windows Server.",
        focus: "Architecture SIG · GeoServer & données spatiales · leadership technique",
      },
    },
  },

  {
    slug: "municipal-revenue-system",
    order: 6,
    featured: false,
    status: "live",
    year: "2025",
    period: "11/2024 - 01/2025",
    role: "Technical Lead",
    client: "A municipal urban authority (anonymised)",
    context: "Delivered via AFREETECH CAMEROON SARL.",
    stack: [
      "Next.js",
      "React",
      "Django REST Framework",
      "Docker",
      "PostgreSQL / PostGIS",
      "Python",
      "TypeScript",
    ],
    architecture: [
      { name: "Next.js interface", kind: "interface" },
      { name: "Django REST API", kind: "contract" },
      { name: "Revenue / reporting / payments", kind: "logic" },
      { name: "PostgreSQL / PostGIS", kind: "state" },
    ],
    i18n: {
      en: {
        name: "Municipal Revenue Tracking System",
        tagline: "Centralising how a city collects and tracks what it's owed.",
        summary:
          "Technical lead on a revenue management and tracking system for a municipal urban authority: modernised and centralised revenue collection into a secure platform with a geographic component, designed the Next.js/Django architecture, modelled the database, and integrated the revenue, reporting and payment modules.",
        focus: "Data modelling · geographic component · Next.js/Django",
      },
      fr: {
        name: "Système de suivi des recettes municipales",
        tagline: "Centraliser la façon dont une ville collecte et suit ce qui lui est dû.",
        summary:
          "Lead technique sur un système de gestion et de suivi des recettes pour une autorité urbaine municipale : modernisation et centralisation de la collecte des recettes au sein d'une plateforme sécurisée à composante géographique, conception de l'architecture Next.js/Django, modélisation de la base de données et intégration des modules recettes, reporting et paiements.",
        focus: "Modélisation de données · composante géographique · Next.js/Django",
      },
    },
  },

  {
    slug: "regional-digital-observatory",
    order: 7,
    featured: false,
    status: "live",
    year: "2024",
    period: "07/2024 - 11/2024",
    role: "Developer",
    client: "A regional digital-observatory programme, Central Africa (anonymised)",
    context: "Delivered via AFREETECH CAMEROON SARL.",
    stack: [
      "React",
      "Django REST Framework",
      "Docker",
      "PostgreSQL / PostGIS",
      "Python",
      "TypeScript",
    ],
    architecture: [
      { name: "React interface", kind: "interface" },
      { name: "Django REST API", kind: "contract" },
      { name: "Statistics & reporting", kind: "logic" },
      { name: "PostgreSQL / PostGIS", kind: "state" },
    ],
    i18n: {
      en: {
        name: "Regional Digital Observatory",
        tagline: "Turning raw regional statistics into something a visitor can actually read.",
        summary:
          "Built the site for a regional digital-observatory programme covering Central Africa: statistics-display modules, data-visualisation components and interactive reports, plus performance and security work and integration testing.",
        focus: "Data visualisation · reporting modules · performance & security",
      },
      fr: {
        name: "Observatoire numérique régional",
        tagline: "Transformer des statistiques régionales brutes en quelque chose de réellement lisible.",
        summary:
          "Développé le site d'un programme d'observatoire numérique régional couvrant l'Afrique Centrale : modules d'affichage de statistiques, composants de visualisation de données et rapports interactifs, ainsi que le travail de performance, de sécurité et les tests d'intégration.",
        focus: "Visualisation de données · modules de reporting · performance & sécurité",
      },
    },
  },

  {
    slug: "giz-observatory-phase-1",
    order: 8,
    featured: false,
    status: "live",
    year: "2024",
    period: "05/2024 - 07/2024",
    role: "Web Developer",
    client: "A government digital-observatory programme, West Africa (anonymised)",
    context: "Delivered via AFREETECH CAMEROON SARL.",
    stack: ["Angular", "Django REST Framework", "Docker", "Python", "TypeScript", "Scrum"],
    architecture: [
      { name: "Angular interface", kind: "interface" },
      { name: "Django REST API", kind: "contract" },
      { name: "Data management", kind: "state" },
    ],
    i18n: {
      en: {
        name: "Government Digital Observatory  :  Phase 1",
        tagline: "Standing up the first version of a national observatory platform.",
        summary:
          "Contributed to building the first version of a government digital-observatory platform for an international development programme in West Africa: integrated the Django backend APIs, worked on performance and security, and took part in integration testing under an Agile/Scrum process.",
        focus: "API integration · Angular frontend · Agile delivery",
      },
      fr: {
        name: "Observatoire numérique gouvernemental  :  Phase 1",
        tagline: "Mettre sur pied la première version d'une plateforme d'observatoire national.",
        summary:
          "Contribué à la construction de la première version d'une plateforme d'observatoire numérique gouvernemental pour un programme de développement international en Afrique de l'Ouest : intégration des API backend Django, travail de performance et de sécurité, participation aux tests d'intégration dans un processus Agile/Scrum.",
        focus: "Intégration d'API · frontend Angular · livraison Agile",
      },
    },
  },

  {
    slug: "document-authentication-platform",
    order: 9,
    featured: false,
    status: "live",
    year: "2024",
    period: "11/2023 - 05/2024",
    role: "Web Developer",
    client: "A national document-authentication programme, Central Africa (anonymised)",
    context: "Delivered via AFREETECH CAMEROON SARL, including on-site hardware installation.",
    stack: ["Python", "HTML5", "JavaScript", "CSS"],
    architecture: [
      { name: "Web interface", kind: "interface" },
      { name: "Authentication logic", kind: "logic" },
      { name: "On-site hardware", kind: "delivery" },
    ],
    i18n: {
      en: {
        name: "Document Authentication Platform",
        tagline: "Authenticating official state documents, deployed on the client's own hardware.",
        summary:
          "Built a platform for authenticating official diplomas and titles for a national government programme in Central Africa: developed the application, deployed and installed it on client hardware on site, and led the data migration from the client's existing records.",
        focus: "On-site deployment · data migration · government platform",
      },
      fr: {
        name: "Plateforme d'authentification de documents",
        tagline: "Authentifier des titres officiels de l'État, déployée sur le matériel du client.",
        summary:
          "Construit une plateforme d'authentification des parchemins et titres officiels pour un programme gouvernemental national en Afrique Centrale : développement de l'application, déploiement et installation sur le matériel du client sur site, et reprise des données existantes du client.",
        focus: "Déploiement sur site · reprise de données · plateforme gouvernementale",
      },
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function sortedProjects() {
  return [...projects].sort((a, b) => a.order - b.order);
}

/* ══════════════════════════════════════════════════════════════════════════
   TEMPLATE  copy into a project's `i18n.en.sections` when you write it up.
   Seven steps, always in this order. Keep each body to two or three sentences;
   a case study earns attention by being specific, not by being long.

   sections: [
     { step: "01", title: "Problem",
       body: ["What was broken, and who felt it. One concrete sentence."] },
     { step: "02", title: "Architecture",
       body: ["The shape of the answer, before any code."] },
     { step: "03", title: "Implementation",
       body: ["What was actually built, and in what order."] },
     { step: "04", title: "Challenges",
       body: ["Where it resisted. Be honest  this is the part engineers read."] },
     { step: "05", title: "Solution",
       body: ["What finally worked, and why it worked."] },
     { step: "06", title: "Results",
       body: ["The measurable difference. A number, with its basis."] },
     { step: "07", title: "Lessons",
       body: ["What you would do differently."] },
   ],
   ══════════════════════════════════════════════════════════════════════════

   GAPS  ask Daniel before adding any of the following. Do not infer them.

   1. Challenges / Solution / Results / Lessons (steps 04-07) are missing on
      every project, including the two with a case study (immotic,
      giz-observatory-phase-2). Steps 01-03 above are grounded in CV facts
      only  what broke, what he'd do differently, and any verifiable metric
      still need his answers from the interview questions asked in chat.
   2. Cover images: none exist yet. IMMOTIC and Passage Canada are public and
      need real screenshots (desktop + mobile) from Daniel  no browser tool
      is available here to capture them. The anonymised/institutional
      projects need either an anonymised screenshot or a generated
      architecture cover composed from `public/assets/diagrams/` (A.5,
      option 3)  not built yet.
   3. giz-observatory-phase-2's anonymisation (masking "GIZ" and "Bénin" down
      to "a government digital-observatory programme, West Africa") follows
      Daniel's blanket "anonymise by default" instruction, but this project
      is also the single strongest story on the CV (Lead role, on-site
      national-datacenter mission). Worth a direct yes/no from Daniel on
      whether the country/agency can be named specifically for this one,
      since the generic version keeps the shape of the story but loses some
      of its punch.
   4. AL-INFOTECH (01/2021  11/2022, PHP/MySQL/WordPress) is real prior
      experience from the CV but isn't a case-study-worthy project  it isn't
      listed here. Surface it in the About/experience timeline instead
      (Chantier D), not as a project card.
   ══════════════════════════════════════════════════════════════════════════ */
