export const translations = {
  en: {
    navbar: {
      links: ["Work", "Stack", "Contact"],
    },
    hero: {
      role: "Full-stack developer",
      line: "I build apps with the person using them in mind: clear, fast, frictionless interfaces on top of code that holds up. From the backend to the last pixel. Looking for a team.",
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
      role: "Desarrollador full-stack",
      line: "Construyo apps pensando primero en quien las va a usar: interfaces claras, rápidas y sin fricción, sobre un código que aguanta. Del backend al último píxel. Busco equipo.",
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
