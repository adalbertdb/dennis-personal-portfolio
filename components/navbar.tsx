"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/use-language";
import { onScrollFrame } from "@/lib/scroll";

// Contacto va al email, no al test: es lo único que un recruiter busca. En móvil solo cabe ese enlace.
const TARGETS = ["#work", "#proceso", "#email"];

export function Navbar() {
  const { lang, t, toggleLang } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
      <nav className="mx-auto max-w-[1400px] h-16 px-5 md:px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 t-label text-white">
          <span className="rec size-2.5 rounded-full bg-yellow" />
          adalbertdb
        </a>
        <div className="flex items-center gap-6 t-label">
          {t.navbar.links.map((label, i) => (
            <a
              key={TARGETS[i]}
              href={TARGETS[i]}
              className={`text-white/55 hover:text-white ${i === 2 ? "" : "hidden sm:block"}`}
            >
              {label}
            </a>
          ))}
          <button
            onClick={toggleLang}
            aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
            className="cursor-pointer rounded-full border border-white/30 px-3 py-1 hover:bg-white hover:text-black"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
        </div>
      </nav>
    </header>
  );
}

const GLYPHS = 28;

/** Barra de glifos: progreso de toda la página. */
export function ProgressGlyphs() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(
    () =>
      onScrollFrame(() => {
        const total = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
        refs.current.forEach((g, i) => {
          if (!g) return;
          const at = i / (GLYPHS - 1);
          const here = Math.abs(at - total) < 0.5 / GLYPHS;
          g.style.background = here ? "#f5c400" : at < total ? "#fff" : "#262626";
          g.style.boxShadow = here ? "0 0 10px #f5c400" : "none";
        });
      }),
    [],
  );

  return (
    <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-[5px]" aria-hidden="true">
      {Array.from({ length: GLYPHS }, (_, i) => (
        <span key={i} ref={(el) => void (refs.current[i] = el)} className="block w-[3px] h-[9px] rounded-full bg-[#262626]" />
      ))}
    </div>
  );
}
