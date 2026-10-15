import type { PinnedRepo } from "@/lib/github";
import type { Dict } from "@/lib/translations";

export type Project = { name: string; desc: string; url: string; lang: string; meta: string; featured?: boolean };

export function projectList(repos: PinnedRepo[], t: Dict): Project[] {
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
