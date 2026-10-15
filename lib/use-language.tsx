"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations, type Dict, type Lang } from "./translations";

const STORAGE_KEY = "lang";

interface LanguageContextValue {
  lang: Lang;
  t: Dict;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  t: translations.es,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // El primer render es ES, igual que el HTML del servidor; después manda lo guardado o el idioma del navegador.
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    setLang(saved === "es" || saved === "en" ? saved : navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    const next = lang === "en" ? "es" : "en";
    setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
