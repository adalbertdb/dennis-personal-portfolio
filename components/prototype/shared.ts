// PROTOTYPE — datos y utilidades compartidas por las variantes de components/prototype/. Borrar con la carpeta.
import type { PinnedRepo } from "@/lib/github";
import type { Translations } from "@/lib/translations";

export const EMAIL = "dbadalbert@gmail.com";

export const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dennis-adalbert-boghean-5413582b8/" },
  { label: "GitHub", href: "https://github.com/adalbertdb" },
];

// De la capa más visible a la más profunda: así se apilan en las variantes que lo dibujan como hardware.
export const stack = (tools: string) =>
  [
    ["Frontend", "Vue.js · Tailwind CSS"],
    ["Mobile", "Flutter · Dart · Supabase"],
    ["Backend", "Node.js · TypeScript · Java · Spring Boot · PostgreSQL"],
    ["Infra", "Linux · Docker · CI/CD · Dokploy"],
    [tools, "Git · Claude Code · MCP"],
  ] as const;

export type Project = { name: string; desc: string; url: string; lang: string; meta: string; featured?: boolean };

export function projectList(repos: PinnedRepo[], t: Translations["es"] | Translations["en"]): Project[] {
  return [
    {
      name: "Aparcaloo",
      desc: t.projects.featuredDesc,
      url: "https://aparcaloo.com",
      lang: "Flutter · Supabase",
      meta: t.projects.waitlist,
      featured: true,
    },
    ...repos.map((r) => ({
      name: r.name,
      desc: r.description ?? "",
      url: r.url,
      lang: r.primaryLanguage?.name ?? "—",
      meta: `★ ${r.stargazerCount} · ⑂ ${r.forkCount}`,
    })),
  ];
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 0 cuando el borde superior de `el` toca el techo del viewport; 1 cuando su borde inferior toca el suelo. */
export function pinProgress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight));
}

/** 0 cuando `el` asoma por abajo; 1 cuando su borde superior llega arriba. */
export function enterProgress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return clamp(1 - r.top / innerHeight);
}

export function rafLoop(fn: (t: number) => void) {
  let id = requestAnimationFrame(function frame(t) {
    fn(t);
    id = requestAnimationFrame(frame);
  });
  return () => cancelAnimationFrame(id);
}

export const pad = (n: number) => String(n).padStart(2, "0");
