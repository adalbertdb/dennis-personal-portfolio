"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/use-language";
import { enterProgress, onScrollFrame, pad, smooth } from "@/lib/scroll";
import { projectList } from "@/lib/projects";
import { STAMP } from "@/lib/site";
import type { PinnedRepo } from "@/lib/github";

export function WorkSection({ repos }: { repos: PinnedRepo[] }) {
  const { t } = useLanguage();
  const list = projectList(repos, t);
  const tiles = useRef<(HTMLAnchorElement | null)[]>([]);

  // Cada tarjeta sube y se enciende al entrar; el fade acaba pronto para que las paradas del scroll no
  // se queden sobre tarjetas a medio encender.
  useEffect(
    () =>
      onScrollFrame(() => {
        tiles.current.forEach((el, i) => {
          if (!el) return;
          const q = smooth(0.02 + (i % 3) * 0.03, 0.26 + (i % 3) * 0.03, enterProgress(el));
          el.style.opacity = String(q);
          el.style.transform = `translateY(${(1 - q) * 60}px)`;
        });
      }),
    [list.length],
  );

  return (
    <section id="work" className="relative px-5 md:px-8 pb-32 scroll-mt-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between border-b border-white/15 pb-5 mb-6">
          <h2 className="font-extrabold uppercase leading-none" style={{ ...STAMP, fontSize: "clamp(44px, 8vw, 120px)" }}>
            {t.projects.title}
          </h2>
          <span className="t-label text-white/45">
            {pad(list.length)} {t.projects.count}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {list.map((p, i) => (
            <a
              key={p.name}
              ref={(el) => void (tiles.current[i] = el)}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col justify-between gap-10 p-5 md:p-6 min-h-[300px] rounded-[20px] border will-change-transform transition-colors ${
                p.featured ? "md:col-span-2 border-yellow/70" : "border-white/12 hover:border-white/40"
              }`}
              style={{
                backgroundImage: `radial-gradient(circle, ${p.featured ? "rgba(245,196,0,.32)" : "rgba(255,255,255,.1)"} 1px, transparent 1.5px)`,
                backgroundSize: "9px 9px",
              }}
            >
              <div className="flex justify-between t-label text-white/50">
                <span>{pad(i + 1)}</span>
                <span>{p.lang}</span>
              </div>
              <div className="bg-black/80 -mx-2 px-2 py-2 rounded-lg">
                <h3
                  className="font-extrabold uppercase leading-[0.95] break-words group-hover:text-yellow transition-colors"
                  style={{ ...STAMP, fontSize: p.featured ? "clamp(40px, 6vw, 88px)" : "clamp(28px, 3vw, 44px)" }}
                >
                  {p.name}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mt-3 max-w-[48ch]">{p.desc}</p>
                <span className="t-label text-white/50 mt-4 block">{p.meta} ↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
