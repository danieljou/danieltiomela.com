import type { Dictionary } from "./types";

export const fr: Dictionary = {
  meta: {
    title: "Daniel Tiomela  Ingénieur logiciel",
    description:
      "Ingénieur logiciel. Je construis des applications web modernes, des API qui tiennent la charge et l'infrastructure qui les fait tourner. Full stack et DevOps, basé à Yaoundé, en remote.",
    keywords: [
      "Ingénieur logiciel",
      "Développeur Full Stack",
      "Django",
      "React",
      "Next.js",
      "DevOps",
      "Remote",
      "Cameroun",
    ],
  },

  nav: {
    home: "Accueil",
    about: "À propos",
    projects: "Projets",
    blog: "Écrits",
    contact: "Contact",
    skipToContent: "Aller au contenu principal",
    menu: "Ouvrir le menu",
    close: "Fermer le menu",
    language: "Langue",
  },

  hero: {
    eyebrow: "Ingénieur logiciel · Full Stack & DevOps",
    name: "Daniel Tiomela",
    role: "Ingénieur logiciel",
    lede: "Je construis des applications web modernes, des API qui tiennent la charge et l'infrastructure qui les fait tourner  du modèle de données jusqu'à la mise en production.",
    ctaPrimary: "Voir mes projets",
    ctaSecondary: "Me contacter",
    availability: "Ouvert aux postes en remote, partout",
  },

  about: {
    label: "À propos",
    title: "Je porte les choses jusqu'en production",
    lede: "Le merge, c'est le milieu du travail, pas la fin.",
    paragraphs: [
      "Je travaille sur toute la chaîne  interfaces frontend, architecture backend, et l'infrastructure qui met les deux en production. La plupart de ce que je construis doit tourner pendant des années et être maintenu par quelqu'un d'autre que moi.",
      "Ça change la façon de coder. Je préfère une architecture claire à une solution astucieuse, parce que le code astucieux est une dette que quelqu'un paie plus tard. J'écris les décisions avant qu'on en débatte. Et je préfère accompagner une fonctionnalité jusqu'au déploiement et rester dessus ensuite, plutôt que de la passer au moment de la revue.",
      "La partie du métier qui m'intéresse le plus, c'est la deuxième livraison du même message  les retries, les rejeux, les événements en double. Concevoir pour ce cas-là avant le chemin nominal, c'est ce qui sépare un système qui résiste aux vrais utilisateurs d'un système qu'il faut surveiller.",
    ],
    facts: [
      { label: "Basé à", value: "Yaoundé, Cameroun" },
      { label: "Fuseau", value: "UTC+1  compatible Europe et Amériques" },
      { label: "Mode", value: "Remote, partout dans le monde" },
      { label: "Langues", value: "Français (natif), anglais" },
    ],
  },

  principles: {
    label: "Méthode",
    title: "Principes d'ingénierie",
    kicker: "Cinq règles qui tranchent les débats avant qu'ils commencent.",
    items: [
      {
        title: "Construire avec une intention",
        body: "Résoudre le vrai problème avant d'ajouter de la complexité. La plupart des fonctionnalités sont le symptôme d'une question mal posée.",
      },
      {
        title: "Rester maintenable",
        body: "Une architecture claire et un code lisible survivent au code astucieux. Le prochain à ouvrir le fichier est le véritable utilisateur.",
      },
      {
        title: "Automatiser ce qui compte",
        body: "Le travail répétitif appartient à l'outillage, pas à la journée de quelqu'un. Si ça arrive deux fois, ça mérite un script.",
      },
      {
        title: "Concevoir pour la fiabilité",
        body: "Un système doit être observable, testable et ennuyeux en production. Une nuit mouvementée est un défaut de conception.",
      },
      {
        title: "Livrer puis itérer",
        body: "Un logiciel devient bon par le retour terrain, pas par la planification. Une hypothèse déployée vaut mieux qu'un document parfait.",
      },
    ],
  },

  build: {
    label: "Ce que je construis",
    title: "Des systèmes, pas seulement des écrans",
    kicker: "Cinq types de travail, tous destinés à la production.",
    items: [
      {
        title: "Applications web",
        body: "Interfaces modernes et applications prêtes pour la production, en React et Next.js, posées sur de vrais modèles de données.",
      },
      {
        title: "API et systèmes backend",
        body: "API REST, authentification, logique métier et services de données  pensés comme des contrats, pas comme des endpoints qui existent par accident.",
      },
      {
        title: "Architecture logicielle",
        body: "Systèmes modulaires, intégrations et structure applicative qu'un nouvel ingénieur peut lire sans visite guidée.",
      },
      {
        title: "DevOps et infrastructure",
        body: "Déploiements conteneurisés, pipelines CI/CD, reverse proxies et environnements cloud qui font de la mise en production un non-événement.",
      },
      {
        title: "Applications mobiles",
        body: "Applications multiplateformes en Flutter ou React Native, quand le produit a réellement besoin d'être dans une poche.",
      },
    ],
  },

  systems: {
    label: "Pensée système",
    title: "Comment je pense les systèmes",
    kicker:
      "Une forme générique, pas un projet précis  les couches dans lesquelles je raisonne avant d'écrire la moindre ligne.",
    caption:
      "Chaque couche nomme ce qu'elle fait, jamais le framework qui le fait. Le framework est précisément la partie la plus susceptible de changer.",
    layers: [
      { name: "Utilisateurs", kind: "personnes" },
      { name: "Web / Mobile", kind: "interface" },
      {
        name: "API",
        kind: "contrat",
        items: ["Authentification", "Logique métier", "Intégrations"],
      },
      {
        name: "Données",
        kind: "état",
        items: ["PostgreSQL", "Redis", "Stockage"],
      },
      {
        name: "Infrastructure",
        kind: "livraison",
        items: ["Docker", "CI/CD", "Cloud"],
      },
    ],
  },

  stack: {
    label: "Outils",
    title: "Stack technique",
    kicker:
      "Pas tout ce que j'ai touché  ce vers quoi je vais réellement, dans l'ordre où j'y vais.",
    core: "Cœur",
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
      "Conteneurs",
      "Cloud",
      "Déploiement",
    ],
    additional: "Également",
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
    label: "Travaux",
    title: "Projets sélectionnés",
    kicker: "Trois systèmes, et ce que chacun m'a appris.",
    all: "Tous les projets",
    viewCase: "Lire l'étude de cas",
    viewRepo: "Voir le dépôt",
    viewDemo: "Voir le site",
    backToProjects: "Retour aux projets",
    filterAll: "Tous",
    empty: "Aucun projet ne correspond à ce filtre pour l'instant.",
    status: {
      live: "En production",
      building: "En développement",
      progress: "En cours",
    },
    fields: {
      role: "Rôle",
      year: "Année",
      stack: "Construit avec",
      focus: "Axe technique",
      architecture: "Architecture",
    },
  },

  certifications: {
    label: "Certifications",
    title: "Certifications",
    kicker: "Récentes et vérifiables.",
    columns: { name: "Certification", provider: "Organisme", date: "Date" },
    viewAll: "Voir toutes mes certifications sur LinkedIn",
    items: [
      {
        name: "Scrum Fundamentals Certified (SFC™)",
        provider: "ScrumStudy",
        date: "Sept. 2025",
      },
      {
        name: "Software Architecture & Code Design in OOP",
        provider: "Udemy",
        date: "Juin 2025",
      },
      {
        name: "Node.js  Fondamentaux d'API RESTful modernes",
        provider: "Udemy",
        date: "Avr. 2025",
      },
      {
        name: "Master Django Web Development",
        provider: "Alison",
        date: "Févr. 2025",
      },
      {
        name: "Intro to JavaScript for React Developers",
        provider: "CodeSignal",
        date: "Févr. 2025",
      },
    ],
  },

  blog: {
    label: "Écrits",
    title: "Notes d'ingénierie",
    kicker: "Des choses qui méritent d'être écrites une fois, puis citées.",
    empty: {
      title: "Rien de publié pour l'instant",
      body: "Les premières notes sont en cours d'écriture. En attendant, les études de cas racontent comment ces systèmes ont réellement été construits.",
      cta: "Lire les études de cas",
    },
    readingTime: "min de lecture",
  },

  contact: {
    label: "Contact",
    title: "Construisons quelque chose",
    kicker: "Je réponds sous 24 heures.",
    lede: "Les problèmes d'ingénierie qui méritent d'être résolus m'intéressent, tout comme les produits à construire correctement et les équipes où un ingénieur a le droit de porter une fonctionnalité de bout en bout.",
    directLabel: "Vous préférez l'email ?",
    directNote: "Écrivez directement  ça arrive aussi vite.",
    form: {
      name: {
        label: "Votre nom",
        placeholder: "Jeanne Okafor",
        error: "Merci d'indiquer votre nom.",
      },
      email: {
        label: "Adresse email",
        placeholder: "jeanne@entreprise.com",
        help: "Pour vous répondre. Rien d'autre.",
        error: "Merci d'indiquer une adresse email valide.",
      },
      subject: {
        label: "Objet",
        placeholder: "Poste backend chez…",
        error: "Merci d'ajouter un objet.",
      },
      message: {
        label: "Message",
        placeholder:
          "Que construisez-vous, et où est-ce que j'interviendrais ?",
        help: "Quelques phrases suffisent largement.",
        error: "Merci d'écrire au moins 20 caractères.",
      },
      required: "obligatoire",
      requiredLegend: "Les champs marqués * sont obligatoires.",
      submit: "Envoyer le message",
      submitting: "Envoi en cours…",
      success: {
        title: "Message envoyé",
        body: "Merci  c'est bien arrivé. Je reviens vers vous sous 24 heures.",
      },
      error: {
        title: "L'envoi a échoué",
        body: "Quelque chose a cassé de mon côté. Écrivez-moi directement, ça me parviendra.",
        retry: "Réessayer",
      },
    },
  },

  footer: {
    tagline: "Construire des logiciels. Concevoir des solutions.",
    builtWith: "Construit avec Next.js et TypeScript",
    rights: "Tous droits réservés.",
    backToTop: "Retour en haut",
  },

  errors: {
    notFound: {
      title: "Cette page n'existe pas",
      body: "Le lien est peut-être périmé, ou la page a été déplacée. Tout le reste est resté à sa place.",
      cta: "Retour à l'accueil",
    },
    generic: {
      title: "Quelque chose a cassé",
      body: "Une erreur inattendue s'est produite. Recharger règle généralement le problème  sinon, dites-le-moi et j'irai voir.",
      cta: "Réessayer",
    },
    loading: "Chargement",
  },
};
