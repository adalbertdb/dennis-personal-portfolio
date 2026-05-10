"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

const navHrefs = ["#projects", "#about", "#skills", "#contact"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, t, toggleLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = t.navbar.links.map((label, i) => ({ label, href: navHrefs[i] }));

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Spacer left (keeps links centered on desktop) */}
        <div className="w-24" />

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-heading text-sm font-medium text-white/40 hover:text-white transition-colors duration-200 cursor-pointer tracking-tight"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-heading font-semibold text-white/40 hover:text-white transition-colors duration-200 cursor-pointer tracking-widest uppercase"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "en" ? "ES" : "EN"}
          </button>

          <a
            href="#contact"
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-heading font-semibold text-white transition-all duration-200 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7DD3FC, #C084FC, #F472B6)",
              boxShadow: "0 0 20px rgba(192,132,252,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(192,132,252,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(192,132,252,0.25)";
            }}
          >
            {t.navbar.cta}
          </a>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs font-heading font-semibold text-white/40 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 py-5 space-y-4 border-t"
          style={{
            background: "rgba(10,10,10,0.97)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block font-heading text-sm font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-heading font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7DD3FC, #C084FC, #F472B6)" }}
            onClick={() => setOpen(false)}
          >
            {t.navbar.cta}
          </a>
        </div>
      )}
    </header>
  );
}
