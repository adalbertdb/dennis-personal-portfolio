export const translations = {
  en: {
    navbar: {
      links: ["Projects", "About", "Skills", "Contact"],
      cta: "Contact",
    },
    hero: {
      badge: "Available for opportunities",
      heading: "Hello, I'm",
      subtitle: "Vue.js & Mobile Developer",
      description:
        "Recent DAM graduate from Spain passionate about building elegant, performant applications. I specialize in Vue.js, Spring Boot, and Flutter to create seamless experiences across web and mobile.",
      btnWork: "View My Work",
      btnContact: "Get In Touch",
    },
    about: {
      label: "Get To Know Me",
      title: "About Me",
      p1: "I'm a passionate developer who recently graduated from DAM (Desarrollo de Aplicaciones Multiplataforma) in Spain. My journey into programming started with curiosity about how apps work, and it quickly turned into a deep passion for creating elegant solutions.",
      p2: "I specialize in building full-stack web applications using Vue.js and Spring Boot, as well as cross-platform mobile apps with Flutter. I love the entire process of turning ideas into functional, beautiful products.",
      p3: "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or improving my skills through online courses and side projects. I'm actively seeking opportunities where I can grow as a developer and contribute to meaningful projects.",
      cards: [
        {
          title: "DAM Graduate",
          desc: "Recently completed Desarrollo de Aplicaciones Multiplataforma studies",
        },
        {
          title: "Based in Spain",
          desc: "Open to remote opportunities and relocation within Europe",
        },
        {
          title: "Full Stack Focus",
          desc: "Building end-to-end solutions from frontend to backend",
        },
        {
          title: "Always Learning",
          desc: "Continuously exploring new technologies and best practices",
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
      label: "Let's Connect",
      title: "Get In Touch",
      description:
        "I'm currently looking for new opportunities and my inbox is always open. Whether you have a question, a project idea, or just want to say hi, I'll do my best to get back to you!",
      location: "Spain, EU",
      cta: "Say Hello",
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
      badge: "Disponible para oportunidades",
      heading: "Hola, soy",
      subtitle: "Desarrollador Vue.js y Mobile",
      description:
        "Recién graduado en DAM apasionado por crear aplicaciones elegantes y de alto rendimiento. Me especializo en Vue.js, Spring Boot y Flutter para crear experiencias fluidas en web y móvil.",
      btnWork: "Ver mi trabajo",
      btnContact: "Contactar",
    },
    about: {
      label: "Conóceme",
      title: "Sobre mí",
      p1: "Soy un desarrollador apasionado que acaba de graduarse en DAM (Desarrollo de Aplicaciones Multiplataforma) en España. Mi camino en la programación empezó por curiosidad sobre cómo funcionan las apps, y rápidamente se convirtió en una profunda pasión por crear soluciones elegantes.",
      p2: "Me especializo en crear aplicaciones web full-stack con Vue.js y Spring Boot, así como apps móviles multiplataforma con Flutter. Me encanta todo el proceso de convertir ideas en productos funcionales y bonitos.",
      p3: "Cuando no estoy programando, me encuentro explorando nuevas tecnologías, contribuyendo a proyectos open-source o mejorando mis habilidades con cursos online y proyectos personales. Busco activamente oportunidades donde pueda crecer como desarrollador y contribuir a proyectos con impacto.",
      cards: [
        {
          title: "Graduado en DAM",
          desc: "Recientemente completé los estudios de Desarrollo de Aplicaciones Multiplataforma",
        },
        {
          title: "Basado en España",
          desc: "Abierto a trabajo remoto y reubicación dentro de Europa",
        },
        {
          title: "Enfoque Full Stack",
          desc: "Construyendo soluciones de extremo a extremo, del frontend al backend",
        },
        {
          title: "Siempre aprendiendo",
          desc: "Explorando continuamente nuevas tecnologías y buenas prácticas",
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
      label: "Conectemos",
      title: "Contacto",
      description:
        "Actualmente busco nuevas oportunidades y mi bandeja de entrada siempre está abierta. Tanto si tienes una pregunta, una idea de proyecto o simplemente quieres saludar, haré todo lo posible por responderte.",
      location: "España, UE",
      cta: "Escríbeme",
    },
    footer: {
      built: "Desarrollado con Next.js y Tailwind CSS.",
    },
  },
} as const

export type Translations = typeof translations
export type Lang = keyof Translations
