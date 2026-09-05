import type { Dictionary } from "./types";

export const fr: Dictionary = {
  meta: {
    title: "Daniel TIOMELA  Ingénieur logiciel",
    description:
      "Ingénieur logiciel. Je construis des applications web modernes, des API qui tiennent la charge et l'infrastructure qui les fait tourner. Full stack et DevOps, basé à Yaoundé, en remote.",
    keywords: [
      "Ingénieur logiciel",
      "Développeur Full Stack",
      "Django",
      "React",
      "Next.js",
      "DevOps",
      "Kubernetes",
      "Géospatial",
      "PostGIS",
      "Remote",
      "Cameroun",
    ],
  },

  nav: {
    home: "Accueil",
    about: "À propos",
    projects: "Projets",
    blog: "Écrits",
    cv: "CV",
    uses: "Stack",
    contact: "Contact",
    skipToContent: "Aller au contenu principal",
    menu: "Ouvrir le menu",
    close: "Fermer le menu",
    language: "Langue",
  },

  hero: {
    eyebrow: "Ingénieur logiciel · Full Stack & DevOps",
    name: "Daniel TIOMELA",
    role: "Ingénieur logiciel",
    lede: "Je construis des applications web modernes, des API qui tiennent la charge et l'infrastructure qui les fait tourner  du modèle de données jusqu'à la mise en production.",
    ctaPrimary: "Voir mes projets",
    ctaSecondary: "Me contacter",
    availability: "Ouvert aux postes en remote, partout",
    availabilityDetail:
      "UTC+1 - chevauche l'essentiel de la journée de travail avec l'Europe, les matinées avec les Amériques. Je réponds sous 24 heures.",
  },

  readyNow: {
    label: "Disponible maintenant",
    title: "Où je peux être utile tout de suite",
    kicker: "Trois choses que j'ai réellement livrées en production, pas une liste de souhaits.",
    items: [
      {
        title: "Backend à l'échelle",
        body: "Des API Django et DRF pensées comme des contrats avant que les endpoints existent : authentification, logique métier et modélisation des données, construites pour être maintenues par quelqu'un d'autre que moi.",
      },
      {
        title: "Plateformes de données géospatiales",
        body: "PostGIS, GeoServer, Elasticsearch et API cartographiques - transformer la donnée de localisation en recherche, cartographie et reporting réellement utilisés, sur cinq systèmes en production.",
      },
      {
        title: "Déploiement & infrastructure",
        body: "Docker, Kubernetes et CI/CD GitLab de la préproduction à la production, jusqu'à la mise en place d'infrastructure sur site dans un datacenter national, pas seulement un cloud managé.",
      },
    ],
  },

  about: {
    label: "À propos",
    title: "Je porte les choses jusqu'en production",
    lede: "Le merge, c'est le milieu du travail, pas la fin.",
    paragraphs: [
      "Je suis basé à Yaoundé, au Cameroun, et formé comme ingénieur logiciel à l'IAI Yaoundé (un diplôme d'ingénieur des travaux informatiques et une licence en génie logiciel, tous deux obtenus avec mention Bien). L'essentiel de ce que j'ai construit depuis a été pour des clients institutionnels : une société immobilière nationale, des programmes d'observatoires numériques gouvernementaux en Afrique de l'Ouest et Centrale, et des autorités municipales gérant leurs propres données. Ce travail arrive rarement avec un cahier des charges fiable : il arrive avec un système existant, un client qui connaît le problème mieux que la technologie, et un délai fixé par le cycle budgétaire de quelqu'un d'autre.",
      "J'ai piloté trois de ces missions de bout en bout - architecture, livraison, et le travail sur site de mise en place de l'infrastructure directement dans le datacenter du client plutôt que dans un cloud managé. Cela incluait la formation des personnes qui allaient réellement faire tourner le système après mon départ, et la rédaction de la documentation pour que le prochain ingénieur n'ait pas besoin de m'appeler. Je suis actuellement Architecte Logiciel Junior et ingénieur DevOps, ce qui veut dire en pratique autant de temps sur des manifests Kubernetes et des standards de revue de code que sur du code applicatif.",
      "Une bonne partie de ce travail s'est révélée géospatiale - PostGIS, GeoServer, Elasticsearch, API cartographiques - parce que la plupart des systèmes qu'on m'a demandé de construire avaient une localisation en leur centre : où se situe un bien, où un service est rendu, où passe réellement une limite. Ce n'est pas une spécialisation que j'ai choisie au départ ; c'est la forme des problèmes qui revenaient sans cesse.",
      "Je travaille en français (C1) et en anglais (B1), depuis l'UTC+1, qui chevauche l'essentiel de la journée de travail européenne et la matinée aux Amériques. Le travail distribué ne change pas ce qui fait un bon logiciel - ça retire juste l'option de clarifier une décision en allant voir quelqu'un à son bureau, donc j'écris plus et je suppose moins.",
    ],
    facts: [
      { label: "Basé à", value: "Yaoundé, Cameroun" },
      { label: "Fuseau", value: "UTC+1 - compatible Europe et Amériques" },
      { label: "Mode", value: "Remote, partout dans le monde" },
      { label: "Langues", value: "Français (C1), anglais (B1)" },
      {
        label: "Formation",
        value: "Diplôme d'ingénieur & Licence, IAI Yaoundé (mention Bien)",
      },
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
    geospatial: "Géospatial",
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
    kicker:
      "Des systèmes réels livrés pour de vrais clients : d'une plateforme immobilière publique à un déploiement dans un datacenter gouvernemental.",
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
      period: "Durée",
      client: "Client",
      context: "Contexte",
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
    groups: [
      {
        title: "DevOps & Cloud",
        items: [
          {
            name: "HELM MasterClass: Kubernetes Packaging Manager",
            provider: "Udemy",
            date: "Août 2025",
          },
          {
            name: "Introduction to DevOps Tools",
            provider: "SkillUp / Simplilearn",
            date: "Mai 2026",
          },
          {
            name: "Getting Started with Docker",
            provider: "SkillUp / Simplilearn",
            date: "Mai 2026",
          },
          {
            name: "AI for Cloud Infrastructure: Automating AWS with StationOps",
            provider: "Udemy",
            date: "Août 2025",
          },
        ],
      },
      {
        title: "Développement web & logiciel",
        items: [
          {
            name: "Master Django Web Development: Hands-On Projects",
            provider: "Alison",
            date: "Févr. 2025",
          },
          {
            name: "Django Essentials: Build and Deploy Real-World Apps",
            provider: "Udemy",
            date: "Avr. 2025",
          },
          {
            name: "Node.js : Fondamentaux d'API RESTful modernes",
            provider: "Udemy",
            date: "Mars 2025",
          },
          {
            name: "The Complete JavaScript Course: From Zero to Expert",
            provider: "Udemy",
            date: "Avr. 2025",
          },
          {
            name: "Intro to JavaScript for React Developers",
            provider: "CodeSignal",
            date: "Févr. 2025",
          },
          {
            name: "Python Development and Programming Fundamentals",
            provider: "Udemy",
            date: "Avr. 2025",
          },
          {
            name: "Software Architecture & Clean Code Design in OOP",
            provider: "Learn IT University",
            date: "2025",
          },
        ],
      },
      {
        title: "Méthodologie & gestion",
        items: [
          {
            name: "Scrum Fundamentals Certified (SFC)",
            provider: "SCRUMstudy",
            date: "Sept. 2025",
          },
          {
            name: "Marketing Strategy Fundamentals (SCMS-F)",
            provider: "SMstudy",
            date: "Sept. 2025",
          },
        ],
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

  cv: {
    label: "CV",
    title: "Daniel TIOMELA - Ingénieur logiciel",
    kicker:
      "Ingénieur Fullstack & DevOps, Yaoundé, Cameroun. Ouvert aux postes en remote, partout.",
    downloadCta: "Télécharger le PDF",
    skillsTitle: "Compétences",
    skillGroups: [
      {
        title: "Langages",
        items: ["Python", "JavaScript", "TypeScript", "SQL", "C", "C++", "HTML5", "CSS3"],
      },
      {
        title: "Frameworks & bibliothèques",
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
          "AWS (notions)",
        ],
      },
      { title: "Serveurs", items: ["Apache", "NGINX"] },
      { title: "Bases de données", items: ["PostgreSQL", "PostGIS", "MySQL", "MongoDB"] },
      {
        title: "SIG / Géomatique",
        items: ["QGIS", "ArcGIS", "GeoServer", "Google Maps API", "Elasticsearch", "Kibana"],
      },
      { title: "Mobile", items: ["React Native", "Expo"] },
      { title: "Outils IA", items: ["Claude Code", "GitHub Copilot", "Cursor"] },
      { title: "Méthodes & Modélisation", items: ["Agile", "Scrum", "Merise", "UML"] },
    ],
    experienceTitle: "Expérience",
    personalProjectsTitle: "Projets personnels",
    educationTitle: "Formation",
    education: [
      {
        degree: "Diplôme d'Ingénieur des Travaux Informatiques · Analyste Programmeur",
        school: "Institut Africain d'Informatique (IAI), Yaoundé",
        period: "11/2022 - 07/2023",
        note: "Mention Bien",
      },
      {
        degree: "Licence en Génie Logiciel",
        school: "Institut Africain d'Informatique (IAI), Yaoundé",
        period: "11/2020 - 10/2023",
        note: "Mention Bien",
      },
      {
        degree: "Diplôme de Technicien Supérieur (DTS)",
        school: "Institut Africain d'Informatique (IAI), Yaoundé",
        period: "11/2020 - 09/2022",
        note: "Mention Bien",
      },
      {
        degree: "Baccalauréat",
        school: "Lycée du Manengouba",
        period: "09/2019 - 09/2020",
        note: "",
      },
    ],
    priorRole: {
      title: "Développeur Web",
      org: "AL-INFOTECH",
      period: "01/2021 - 11/2022",
      summary:
        "Interfaces web front-end et back-end (PHP, MySQL, WordPress) ; création et maintenance de sites web responsives ; configuration des infrastructures d'hébergement et rédaction de documentation technique ; formation des clients et support, dans une démarche Agile.",
      stack: ["PHP", "MySQL", "WordPress", "HTML", "CSS", "JavaScript"],
    },
  },

  uses: {
    label: "Stack",
    title: "Ce que j'utilise, et pourquoi",
    kicker: "Pas tout ce que j'ai touché  les outils vers lesquels je vais, et la raison.",
    items: [
      {
        name: "Django + Django REST Framework",
        why: "Des API pensées comme des contrats, pas comme des endpoints qui existent par accident : le modèle de données vient d'abord, les routes suivent.",
      },
      {
        name: "PostgreSQL / PostGIS",
        why: "La plupart des systèmes que je construis ont une localisation en leur centre, donc la géographie vit dans la base de données, pas dans le code applicatif.",
      },
      {
        name: "Next.js + TypeScript",
        why: "Un seul framework frontend sur presque tous les projets livrés : moins de surprises, une prise en main plus rapide du code de quelqu'un d'autre.",
      },
      {
        name: "Docker",
        why: "Lancer un service en local et le lancer en production doit être la même opération.",
      },
      {
        name: "Kubernetes + Helm",
        why: "Dès qu'un système a besoin de plusieurs services qui se parlent de façon fiable, l'orchestration cesse d'être optionnelle.",
      },
      {
        name: "GitLab CI/CD",
        why: "Le travail répétitif appartient à un pipeline, pas à l'après-midi de quelqu'un.",
      },
      {
        name: "GeoServer, QGIS & ArcGIS",
        why: "Les outils qui transforment une base de données spatiale en carte réellement interrogeable.",
      },
      {
        name: "Elasticsearch + Kibana",
        why: "Pour les observatoires et systèmes de reporting où la question intéressante est « chercher dans tout ça », pas « récupérer une ligne ».",
      },
      {
        name: "Nginx + Linux",
        why: "La couche peu glamour qui décide si le HTTPS et la disponibilité arrivent vraiment.",
      },
      {
        name: "Claude Code, GitHub Copilot & Cursor",
        why: "Des outils IA que j'utilise au quotidien, pour la même raison que j'automatise n'importe quoi : passer la journée sur la décision, pas sur le code répétitif.",
      },
    ],
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
