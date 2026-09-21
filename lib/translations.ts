export const translations = {
  en: {
    navbar: {
      links: ["Work", "Stack", "Contact"],
    },
    hero: {
      role: "Builder · Apps for humans",
      line: "I build apps people enjoy using. Solid code on the inside, clear experience on the outside, from the database to the last detail of the interface. Looking for a team.",
      btnWork: "See work",
      btnContact: "Write to me",
      spec: [
        ["Base", "Gandía · Valencia"],
        ["Stack", "TypeScript · Java · SQL"],
        ["Mode", "Remote / on-site"],
      ],
      status: "Status",
      available: "Available",
    },
    projects: {
      title: "Work",
      featuredTag: "Paused",
      featuredDesc: "Collaborative parking app.",
      waitlist: "100+ on the waitlist",
      empty: "No pinned repositories found.",
      github: "All on GitHub",
    },
    skills: {
      title: "Stack",
      tools: "Tools",
    },
    contact: {
      title: "Let's talk",
      reply: "I reply fast.",
    },
  },
  es: {
    navbar: {
      links: ["Trabajo", "Stack", "Contacto"],
    },
    hero: {
      role: "Builder · Apps para humanos",
      line: "Construyo apps que da gusto usar. Código sólido por dentro, experiencia clara por fuera, de la base de datos al último detalle de la interfaz. Busco equipo.",
      btnWork: "Ver trabajo",
      btnContact: "Escríbeme",
      spec: [
        ["Base", "Gandía · Valencia"],
        ["Stack", "TypeScript · Java · SQL"],
        ["Modo", "Remoto / presencial"],
      ],
      status: "Estado",
      available: "Disponible",
    },
    projects: {
      title: "Trabajo",
      featuredTag: "En pausa",
      featuredDesc: "App colaborativa de aparcamiento.",
      waitlist: "100+ en lista de espera",
      empty: "No se encontraron repositorios destacados.",
      github: "Todo en GitHub",
    },
    skills: {
      title: "Stack",
      tools: "Herramientas",
    },
    contact: {
      title: "Hablemos",
      reply: "Respondo rápido.",
    },
  },
} as const

export type Translations = typeof translations
export type Lang = keyof Translations
