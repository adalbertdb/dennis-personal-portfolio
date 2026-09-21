"use client";

import { useLanguage } from "@/lib/use-language";

export function SkillsSection() {
  const { t } = useLanguage();

  const stack = [
    ["Backend", "Node.js · TypeScript · Java · Spring Boot · PostgreSQL"],
    ["Frontend", "Vue.js · Tailwind CSS"],
    ["Mobile", "Flutter · Dart · Supabase"],
    ["Infra", "Linux · Docker · CI/CD · Dokploy"],
    [t.skills.tools, "Git · Claude Code · MCP"],
  ];

  return (
    <section id="stack" className="border-b-4 border-edge">
      <div className="wrap py-24 flex flex-col gap-12">
        <h2 className="t-title">{t.skills.title}</h2>
        <dl className="border-t-4 border-ink">
          {stack.map(([k, v]) => (
            <div key={k} className="grid-12 gap-y-1 py-4 border-b-2 border-edge-soft">
              <dt className="col-span-6 md:col-span-3 t-label text-graphite pt-1">{k}</dt>
              <dd className="col-span-6 md:col-span-9 t-subtitle">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
