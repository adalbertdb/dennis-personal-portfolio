export const translations = {
  en: {
    navbar: {
      links: ["Work", "Process", "Contact"],
    },
    hero: {
      role: "Full-stack developer",
      where: "Valencia · Remote / on-site",
      line: "I have a habit of turning every problem into an app idea. Most never leave my head. The ones that do, I build end to end, from the backend to the last pixel.",
      available: "Available",
    },
    stack: {
      title: "Stack",
      stages: ["", "Stack", "Process"],
    },
    process: {
      claim: ["Anyone can build something with AI.", "But does it solve anything? Does it work? Is it easy to use?"],
      steps: [
        ["Understand", "Who's going to use it and what they really need.", "who for?"],
        ["Spec", "What gets built and how we'll know it works.", "what and why?"],
        ["Prototype", "Several cheap versions; pick one on purpose.", "how does it feel?"],
        ["Build", "With agents: Claude Code · Codex.", "how is it built?"],
        ["Verify", "In the real app, not just in the tests.", "does it work?"],
      ],
    },
    projects: {
      title: "Work",
      count: "projects",
      featuredDesc: "Collaborative parking app.",
      waitlist: "100+ on the waitlist",
    },
    test: {
      title: "Does this portfolio pass the test?",
      body: "The last step of the process is verifying in the real app. This is the real app, and you're the test.",
      idle: "Contact",
      pass: "Great! Let's talk",
      fail: "Open a ticket plz",
    },
  },
  es: {
    navbar: {
      links: ["Trabajo", "Proceso", "Contacto"],
    },
    hero: {
      role: "Desarrollador full-stack",
      where: "Valencia · Remoto / presencial",
      line: "Tengo la manía de convertir cualquier problema en una idea de app. Casi todas se quedan en mi cabeza. Las que salen, las construyo enteras, del backend al último píxel.",
      available: "Disponible",
    },
    stack: {
      title: "Stack",
      stages: ["", "Stack", "Proceso"],
    },
    process: {
      claim: ["Con IA, cualquiera hace algo.", "Pero ¿sirve? ¿Funciona bien? ¿Es fácil de usar?"],
      steps: [
        ["Entender", "A quien lo va a usar y qué necesita de verdad.", "¿para quién?"],
        ["Especificar", "Qué se construye y cómo sabremos que funciona.", "¿qué y por qué?"],
        ["Prototipar", "Varias versiones baratas; se elige una con criterio.", "¿cómo se usa?"],
        ["Construir", "Con agentes: Claude Code · Codex.", "¿cómo se hace?"],
        ["Verificar", "En la app real, no solo en los tests.", "¿funciona?"],
      ],
    },
    projects: {
      title: "Trabajo",
      count: "proyectos",
      featuredDesc: "App colaborativa de aparcamiento.",
      waitlist: "100+ en lista de espera",
    },
    test: {
      title: "¿Este portfolio pasa el test?",
      body: "El último paso del proceso es verificar en la app real. La app real es esta, y el test eres tú.",
      idle: "Contacto",
      pass: "¡Genial! Hablemos",
      fail: "Abre un ticket, porfi",
    },
  },
}

export type Translations = typeof translations
export type Lang = keyof Translations
export type Dict = Translations["en"]
