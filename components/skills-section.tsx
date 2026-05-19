"use client";

import { useLanguage } from "@/lib/use-language";
import { useScrollRevealChildren } from "@/hooks/use-scroll-reveal";

const SKILLS = [
  {
    category: "Frontend",
    color: "#A5B4FC",
    items: ["Vue.js 3", "Composition API", "Pinia", "Vue Router", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    color: "#7DD3FC",
    items: ["Java", "Spring Boot", "Node.js", "REST APIs", "MySQL"],
  },
  {
    category: "Mobile",
    color: "#67E8F9",
    items: ["Flutter", "Dart", "Android", "Cross-Platform"],
  },
  {
    category: "Tools",
    color: "#C084FC",
    items: ["Git", "GitHub", "IntelliJ", "VS Code", "Claude Code"],
  },
];

export function SkillsSection() {
  const { t } = useLanguage();
  const containerRef = useScrollRevealChildren();

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden">
      {/* Chapter number */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 font-heading font-bold select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(12rem, 28vw, 22rem)",
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        04
      </span>

      {/* Decorative rect */}
      <svg
        className="absolute top-0 right-0 pointer-events-none select-none opacity-[0.06]"
        width="280" height="200" viewBox="0 0 280 200" fill="none" aria-hidden="true"
      >
        <defs>
          <linearGradient id="sk-deco" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#67E8F9" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="260" height="180" stroke="url(#sk-deco)" strokeWidth="1" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto" ref={containerRef as React.RefObject<HTMLDivElement>}>

        {/* Header */}
        <div id="skills-heading" className="reveal mb-16">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            Chapter 04 — {t.skills.label}
          </p>
          <h2
            className="font-heading font-bold"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.05em", lineHeight: 1.0 }}
          >
            {t.skills.title}
          </h2>
          <div className="h-px w-full mt-4" style={{ background: "linear-gradient(90deg, rgba(165,180,252,0.4), rgba(103,232,249,0.2), transparent)" }} />
        </div>

        {/* Skills — row layout, each category on its own line */}
        <div className="space-y-0">
          {SKILLS.map((group, i) => (
            <div
              key={group.category}
              className={`reveal reveal-delay-${i + 1} flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b`}
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              {/* Index + category — fixed width column */}
              <div className="flex items-center gap-4 sm:w-48 shrink-0">
                <span
                  className="font-heading font-bold text-xs tabular-nums"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                >
                  0{i + 1}
                </span>
                <span
                  className="font-heading font-bold text-sm uppercase tracking-[0.12em]"
                  style={{ color: group.color }}
                >
                  {group.category}
                </span>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1.5 rounded-full font-heading text-white/50"
                    style={{
                      border: `1px solid ${group.color}22`,
                      background: `${group.color}08`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
