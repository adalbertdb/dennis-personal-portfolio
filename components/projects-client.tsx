"use client";

import { useLanguage } from "@/lib/use-language";
import type { PinnedRepo } from "@/lib/github";

export function ProjectsClient({ repos }: { repos: PinnedRepo[] }) {
  const { t } = useLanguage();

  return (
    <section id="work" className="border-b-4 border-edge">
      <div className="wrap py-24 flex flex-col gap-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="t-title">{t.projects.title}</h2>
          <a
            href="https://github.com/adalbertdb"
            target="_blank"
            rel="noopener noreferrer"
            className="t-label text-graphite hover:text-ink transition-colors"
          >
            {t.projects.github} ↗
          </a>
        </div>

        {repos.length === 0 ? (
          <p className="t-data text-graphite">{t.projects.empty}</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <li className="h-full flex flex-col gap-2 p-6 bg-plate-raised border-2 border-edge-soft">
              <span className="t-label text-graphite">{t.projects.featuredTag}</span>
              <h3 className="t-subtitle">Aparcaloo</h3>
              <p className="text-sm leading-5 text-cast flex-1">{t.projects.featuredDesc}</p>
              <span className="t-data text-graphite mt-auto pt-2">Flutter · Supabase · {t.projects.waitlist}</span>
            </li>
            {repos.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-full flex flex-col gap-2 p-6 bg-plate-raised border-2 border-edge-soft hover:border-ink transition-colors"
                >
                  <span className="t-label text-graphite">{repo.primaryLanguage?.name ?? "—"}</span>
                  <h3 className="t-subtitle break-words">{repo.name}</h3>
                  {repo.description && (
                    <p className="text-sm leading-5 text-cast line-clamp-3 flex-1">{repo.description}</p>
                  )}
                  <span className="t-data text-graphite mt-auto pt-2">
                    ★ {repo.stargazerCount} · ⑂ {repo.forkCount} · ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
