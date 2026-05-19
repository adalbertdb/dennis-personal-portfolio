export const translations = {
  en: {
    navbar: {
      links: ["Projects", "About", "Skills", "Contact"],
      cta: "Contact",
    },
    hero: {
      badge: "Open to work",
      heading: "Hello, I'm",
      subtitle: "Mobile & Fullstack Developer · Flutter & Node.js",
      description:
        "Software developer based in the Valencia region (Spain). I build mobile apps and backend services, and I've spent the last year working on my own projects alongside my studies.",
      btnWork: "See my work",
      btnContact: "Get in touch",
    },
    about: {
      label: "About",
      title: "About Me",
      p1: "I'm based in the Valencia region and just finished a higher technical degree in software development. While studying, I built Aparcaloo — a collaborative parking app in Flutter and Supabase that already has 75 people signed up before launch.",
      p2: "My main stack is Flutter and Dart for mobile, Node.js for the backend, and PostgreSQL as my go-to data layer. I've also worked with Vue.js and picked up Rust on a small personal project. I choose tools based on what the project needs.",
      p3: "What drives me is trying to solve real problems — not just building things for the sake of it. I'm looking for a team where I can contribute from day one, ideally on mobile or full-stack projects.",
      cards: [
        {
          title: "Software Developer",
          desc: "Higher technical degree in multiplatform app development + networking (Spain)",
        },
        {
          title: "Valencia region, Spain",
          desc: "Available remote or on-site in the Valencia region",
        },
        {
          title: "Flutter-first",
          desc: "Mobile development with AI integration when it fits the problem",
        },
        {
          title: "Aparcaloo",
          desc: "Collaborative parking app — 75 sign-ups before launch",
        },
      ],
    },
    skills: {
      label: "What I Work With",
      title: "Technical Skills",
    },
    projects: {
      label: "My Work",
      title: "Featured Projects",
      empty: "No pinned repositories found.",
      github: "See More on GitHub",
    },
    contact: {
      label: "Contact",
      title: "Let's talk",
      description:
        "If you're looking for a junior developer with real projects to show, feel free to reach out. I reply quickly.",
      location: "Valencia region, Spain",
      cta: "Send me a message",
    },
    footer: {
      built: "Built with Next.js & Tailwind CSS.",
    },
  },
  es: {
    navbar: {
      links: ["Proyectos", "Sobre mí", "Habilidades", "Contacto"],
      cta: "Contacto",
    },
    hero: {
      badge: "Disponible para trabajar",
      heading: "Hola, soy",
      subtitle: "Desarrollador Mobile & Fullstack · Flutter & Node.js",
      description:
        "Técnico Superior en DAM, de la provincia de Valencia. Construyo apps móviles y servicios de backend, y llevo el último año trabajando en proyectos propios mientras terminaba los estudios.",
      btnWork: "Ver mi trabajo",
      btnContact: "Contactar",
    },
    about: {
      label: "Sobre mí",
      title: "Sobre mí",
      p1: "Vivo en la provincia de Valencia y acabo de terminar el CFGS de DAM. Mientras estudiaba, construí Aparcaloo — una app colaborativa de aparcamiento en Flutter y PostgreSQL que ya tiene 75 personas apuntadas antes de lanzar.",
      p2: "Mi stack principal es Flutter y Dart para mobile, Node.js para el backend, y PostgreSQL como capa de datos. También he trabajado con Vue.js y tocado Rust en un proyecto personal. Elijo las herramientas según lo que necesita el proyecto.",
      p3: "Lo que me mueve es intentar resolver problemas reales, no construir cosas por construirlas. Busco un equipo donde pueda aportar desde el primer día, idealmente en proyectos mobile o full-stack.",
      cards: [
        {
          title: "Técnico Superior en DAM",
          desc: "CFGS Desarrollo de Aplicaciones Multiplataforma + Sistemas y Redes",
        },
        {
          title: "Provincia de Valencia",
          desc: "Disponible en remoto o presencial en la Comunitat Valenciana",
        },
        {
          title: "Flutter primero",
          desc: "Desarrollo mobile con integración de IA cuando encaja en el problema",
        },
        {
          title: "Aparcaloo",
          desc: "App colaborativa de aparcamiento — 75 registros antes de lanzar",
        },
      ],
    },
    skills: {
      label: "Con qué trabajo",
      title: "Habilidades técnicas",
    },
    projects: {
      label: "Mi trabajo",
      title: "Proyectos destacados",
      empty: "No se encontraron repositorios destacados.",
      github: "Ver más en GitHub",
    },
    contact: {
      label: "Contacto",
      title: "Hablemos",
      description:
        "Si buscas un desarrollador junior con proyectos reales que mostrar, puedes escribirme. Respondo rápido.",
      location: "Provincia de Valencia (España)",
      cta: "Escríbeme",
    },
    footer: {
      built: "Desarrollado con Next.js y Tailwind CSS.",
    },
  },
} as const

export type Translations = typeof translations
export type Lang = keyof Translations
