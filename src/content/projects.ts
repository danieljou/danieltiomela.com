import type { Project } from "./types";

/**
 * Only verifiable facts live here: stack, repository, role, status.
 *
 * `sections` is intentionally empty. A case study is the single highest-value
 * thing on this site, and it has to be written by the person who built the
 * thing  see the template at the bottom of this file. Until a project has
 * real sections, its page renders the summary, the stack and the architecture,
 * which are all true, rather than filler that reads as true and is not.
 *
 * `metrics` is the same rule: add a figure only when you can point at where
 * it came from.
 */
export const projects: Project[] = [
  {
    slug: "minhdu",
    order: 1,
    featured: true,
    status: "live",
    year: "2025",
    role: "Backend engineer",
    stack: ["Django", "Django REST Framework", "PostgreSQL", "Docker"],
    repo: "https://github.com/danieljou/Minhdu",
    architecture: [
      { name: "Client", kind: "interface" },
      { name: "REST API", kind: "contract" },
      { name: "Services", kind: "logic" },
      { name: "PostgreSQL", kind: "state" },
    ],
    i18n: {
      en: {
        name: "Minhdu API",
        tagline: "A backend service built to be deployed, not demonstrated.",
        summary:
          "A Django and PostgreSQL backend, containerised from the start so that running it locally and running it in production are the same operation. The API is designed as a contract first  the endpoints follow from the data model rather than the other way round.",
        focus: "API architecture · data modelling · containerised deployment",
      },
      fr: {
        name: "Minhdu API",
        tagline: "Un service backend conçu pour être déployé, pas démontré.",
        summary:
          "Un backend Django et PostgreSQL, conteneurisé dès le départ pour que le lancer en local et le lancer en production soient la même opération. L'API est pensée comme un contrat d'abord  les endpoints découlent du modèle de données, et non l'inverse.",
        focus:
          "Architecture d'API · modélisation des données · déploiement conteneurisé",
      },
    },
  },

  {
    slug: "easyfood",
    order: 2,
    featured: true,
    status: "building",
    year: "2025",
    role: "Mobile engineer",
    stack: ["Flutter", "Dart", "Firebase"],
    repo: "https://github.com/danieljou/EasyFood",
    architecture: [
      { name: "Flutter app", kind: "interface" },
      { name: "Firebase Auth", kind: "identity" },
      { name: "Firestore", kind: "state" },
    ],
    i18n: {
      en: {
        name: "EasyFood",
        tagline:
          "A cross-platform application where the data is live by default.",
        summary:
          "A Flutter application backed by Firebase, built around realtime data and authentication. The interesting constraint is offline behaviour: what the app shows when the connection drops, and how it reconciles when the connection comes back.",
        focus: "Mobile interface · realtime data · authentication",
      },
      fr: {
        name: "EasyFood",
        tagline:
          "Une application multiplateforme où la donnée est temps réel par défaut.",
        summary:
          "Une application Flutter adossée à Firebase, construite autour de la donnée temps réel et de l'authentification. La contrainte intéressante est le comportement hors ligne : ce que l'application affiche quand la connexion tombe, et comment elle se réconcilie quand elle revient.",
        focus: "Interface mobile · données temps réel · authentification",
      },
    },
  },

  {
    slug: "portfolio",
    order: 3,
    featured: true,
    status: "progress",
    year: "2026",
    role: "Design & engineering",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    // TODO  replace with the real repository once it is public.
    repo: "https://github.com/danieljou",
    demo: "https://danieltiomela.com",
    architecture: [
      { name: "Static pages", kind: "interface" },
      { name: "Server actions", kind: "contract" },
      { name: "Edge delivery", kind: "delivery" },
    ],
    i18n: {
      en: {
        name: "This site",
        tagline: "A personal brand system, compiled.",
        summary:
          "Built on a design system defined once as tokens  colour, type, spacing, motion  and consumed by every component. Bilingual, statically rendered, and accessible by construction rather than by audit: focus states, reduced-motion support and measured contrast were part of the first commit, not a pass at the end.",
        focus:
          "Design system · internationalisation · accessibility · performance",
      },
      fr: {
        name: "Ce site",
        tagline: "Un système de marque personnel, compilé.",
        summary:
          "Construit sur un design system défini une seule fois sous forme de tokens  couleur, typographie, espacement, motion  et consommé par tous les composants. Bilingue, rendu statiquement, et accessible par construction plutôt que par audit : les états de focus, le respect de prefers-reduced-motion et les contrastes mesurés faisaient partie du premier commit, pas d'une passe finale.",
        focus:
          "Design system · internationalisation · accessibilité · performance",
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
   ══════════════════════════════════════════════════════════════════════════ */
