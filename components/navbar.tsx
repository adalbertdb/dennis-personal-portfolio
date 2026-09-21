"use client";

import { useLanguage } from "@/lib/use-language";

const navHrefs = ["#work", "#stack", "#contact"];

export function Navbar() {
  const { lang, t, toggleLang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-plate border-b-4 border-edge">
      <nav className="wrap h-16 flex items-center justify-between gap-6">
        <a href="#top" className="text-ink font-semibold text-xl leading-none tracking-[-0.052em]">
          dennis adalbert<span className="text-mark">.</span>
        </a>

        <div className="flex items-center gap-6">
          <ul className="hidden sm:flex items-center gap-6">
            {t.navbar.links.map((label, i) => (
              <li key={label}>
                <a href={navHrefs[i]} className="t-label text-graphite hover:text-ink transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={toggleLang}
            className="t-label text-ink border-2 border-ink px-2 py-1 hover:bg-yellow hover:text-on-accent hover:border-on-accent transition-colors cursor-pointer"
            aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
        </div>
      </nav>
    </header>
  );
}
