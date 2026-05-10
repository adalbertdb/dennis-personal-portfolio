"use client";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "./translations";

type Lang = "en" | "es";

interface LanguageContextValue {
  lang: Lang;
  t: (typeof translations)["en"];
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: translations["en"],
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const toggleLang = () => setLang((l) => (l === "en" ? "es" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang] as (typeof translations)["en"], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
