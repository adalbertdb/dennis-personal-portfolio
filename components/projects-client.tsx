"use client";

import { Github, Linkedin, Mail, ExternalLink, Star, GitFork } from "lucide-react";
import { useLanguage } from "@/lib/use-language";
import { useScrollRevealChildren } from "@/hooks/use-scroll-reveal";
import type { PinnedRepo } from "@/lib/github";

interface ProjectsClientProps {
  repos: PinnedRepo[];
}

const ACCENT_PAIRS = [
  { a: "#7DD3FC", b: "#C084FC" },
  { a: "#C084FC", b: "#F472B6" },
  { a: "#67E8F9", b: "#A5B4FC" },
  { a: "#A5B4FC", b: "#F472B6" },
  { a: "#7DD3FC", b: "#67E8F9" },
  { a: "#F472B6", b: "#A5B4FC" },
];

export function ProjectsClient({ repos }: ProjectsClientProps) {
  const { t } = useLanguage();
  const containerRef = useScrollRevealChildren();

  return (
    <section id="projects" className="py-32 px-6 relative overflow-hidden">
      {/* Chapter number background */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 font-heading font-bold select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(12rem, 28vw, 22rem)",
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        02
      </span>

      {/* Decorative shape top-right */}
      <svg
        className="absolute top-0 right-0 pointer-events-none select-none opacity-[0.07]"
        width="260" height="260" viewBox="0 0 260 260" fill="none" aria-hidden="true"
      >
        <defs>
          <linearGradient id="proj-deco" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
        <polygon points="130,8 252,252 8,252" stroke="url(#proj-deco)" strokeWidth="1" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto" ref={containerRef as React.RefObject<HTMLDivElement>}>

        {/* Section header — left aligned, editorial */}
        <div className="reveal mb-16 flex flex-col gap-3">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Chapter 02 — {t.projects.label}
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              className="font-heading font-bold"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.05em", lineHeight: 1.0 }}
            >
              {t.projects.title}
            </h2>
            <a
              href="https://github.com/adalbertdb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-heading font-semibold text-white/30 hover:text-white transition-colors duration-200 cursor-pointer mb-1"
            >
              <Github className="w-3.5 h-3.5" />
              {t.projects.github}
            </a>
          </div>
          {/* Separator line */}
          <div className="h-px w-full mt-2" style={{ background: "linear-gradient(90deg, rgba(125,211,252,0.4), rgba(192,132,252,0.2), transparent)" }} />
        </div>

        {repos.length === 0 ? (
          <p className="text-white/40 text-sm">{t.projects.empty}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, idx) => {
              const { a, b } = ACCENT_PAIRS[idx % ACCENT_PAIRS.length];
              return (
                <div
                  key={repo.name}
                  className={`card-wire p-6 flex flex-col cursor-pointer reveal reveal-delay-${Math.min(idx + 1, 5)}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Geometric icon */}
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                      <defs>
                        <linearGradient id={`p-ic-${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={a} />
                          <stop offset="100%" stopColor={b} />
                        </linearGradient>
                      </defs>
                      <rect x="1.5" y="1.5" width="33" height="33" rx="6"
                        stroke={`url(#p-ic-${idx})`} strokeWidth="1.5" fill="none" />
                      <rect x="10" y="10" width="16" height="16" rx="3"
                        fill={`url(#p-ic-${idx})`} fillOpacity="0.25" />
                    </svg>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${repo.name} on GitHub`}
                      className="text-white/25 hover:text-white transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Title + description */}
                  <h3 className="font-heading font-semibold text-sm text-white mb-2 tracking-tight">
                    {repo.name}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed flex-1 mb-4">
                    {repo.description ?? "No description provided."}
                  </p>

                  {/* Topics */}
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-0.5 rounded-full font-heading"
                          style={{
                            border: `1px solid ${a}30`,
                            color: a,
                            background: `${a}08`,
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-white/25">
                    {repo.primaryLanguage && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: repo.primaryLanguage.color ?? "#888" }}
                        />
                        {repo.primaryLanguage.name}
                      </span>
                    )}
                    {repo.stargazerCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazerCount}
                      </span>
                    )}
                    {repo.forkCount > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forkCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GitHub CTA */}
        <div className="reveal reveal-delay-4 mt-12 flex justify-start">
          <a
            href="https://github.com/adalbertdb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-white/30 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            {t.projects.github} →
          </a>
        </div>
      </div>
    </section>
  );
}
