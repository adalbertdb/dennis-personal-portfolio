"use client";

import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "hero",     label: "Intro" },
  { id: "projects", label: "Work" },
  { id: "about",    label: "About" },
  { id: "skills",   label: "Stack" },
  { id: "contact",  label: "Contact" },
];

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      // Overall page progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);

      // Active chapter
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          setActive(CHAPTERS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {/* Progress track */}
      <div
        className="relative w-px bg-white/8 rounded-full"
        style={{ height: "120px" }}
      >
        <div
          className="absolute top-0 left-0 w-full rounded-full transition-all duration-150"
          style={{
            height: `${progress * 100}%`,
            background: "linear-gradient(180deg, #7DD3FC, #C084FC, #F472B6)",
          }}
        />
      </div>

      {/* Chapter dots */}
      <div className="flex flex-col items-center gap-4">
        {CHAPTERS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            className="group relative flex items-center"
          >
            <div
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{
                background: active === id ? "#C084FC" : "rgba(255,255,255,0.2)",
                transform: active === id ? "scale(2)" : "scale(1)",
              }}
            />
            {/* Tooltip */}
            <span
              className="absolute left-4 font-heading text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
