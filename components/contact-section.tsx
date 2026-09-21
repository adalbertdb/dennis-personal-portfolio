"use client";

import { useLanguage } from "@/lib/use-language";

const EMAIL = "dbadalbert@gmail.com";

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dennis-adalbert-boghean-5413582b8/" },
  { label: "GitHub", href: "https://github.com/adalbertdb" },
];

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="mat bg-steel text-on-steel">
      <div className="wrap py-24 flex flex-col gap-12">
        {/* Las doce columnas de la retícula, una en acento */}
        <div className="grid-12 gap-y-3" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={`h-3 ${i === 7 ? "bg-yellow" : "bg-on-steel-muted/40"} ${i >= 6 ? "hidden md:block" : ""}`} />
          ))}
        </div>

        <h2 className="t-stamp text-on-steel" style={{ fontSize: "clamp(48px, 11vw, 136px)" }}>
          {t.contact.title}
        </h2>

        <div className="flex flex-col gap-6">
          <a
            href={`mailto:${EMAIL}`}
            className="self-start text-on-steel font-bold break-all hover:bg-yellow hover:text-on-accent transition-colors"
            style={{ fontSize: "clamp(22px, 4vw, 44px)", lineHeight: 1.1, fontVariationSettings: '"wdth" 110' }}
          >
            {EMAIL}
          </a>
          <div className="flex flex-wrap items-center gap-6">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label text-on-steel border-2 border-on-steel px-3 py-2 hover:bg-yellow hover:text-on-accent hover:border-yellow transition-colors"
              >
                {label} ↗
              </a>
            ))}
            <span className="t-data text-on-steel-muted">{t.contact.reply}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
