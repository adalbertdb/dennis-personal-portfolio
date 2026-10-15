import type { Lang } from "./translations";

export const EMAIL = "dbadalbert@gmail.com";

export const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dennis-adalbert-boghean-5413582b8/" },
  { label: "GitHub", href: "https://github.com/adalbertdb" },
];

export const CV: Record<Lang, string> = {
  es: "/Dennis-Adalbert-CV-es.pdf",
  en: "/Dennis-Adalbert-CV-en.pdf",
};

/** Titulares en Archivo ancho (eje wdth), el tono de toda la web. */
export const STAMP = { fontVariationSettings: '"wdth" 118', letterSpacing: "-0.025em" } as const;
