"use client";

import { useLanguage } from "@/lib/use-language";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="top" className="mat border-b-4 border-edge">
      <div className="wrap pt-12 pb-24 md:pt-24">
        <p className="t-cond text-graphite mb-6">{t.hero.role}</p>

        <h1 className="t-stamp" style={{ fontSize: "clamp(48px, 14vw, 176px)" }}>
          Dennis
          <span className="block">Adalbert</span>
        </h1>

        <div className="grid-12 gap-y-12 mt-12 md:mt-24 items-end">
          <div className="col-span-6 flex flex-col gap-6">
            <p className="max-w-[40ch] text-lg leading-7 text-cast">{t.hero.line}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="t-label bg-ink text-plate px-6 py-4 hover:bg-yellow hover:text-on-accent transition-colors"
              >
                {t.hero.btnWork} →
              </a>
              <a
                href="#contact"
                className="t-label text-ink border-4 border-ink px-5 py-3 hover:bg-ink hover:text-plate transition-colors"
              >
                {t.hero.btnContact}
              </a>
            </div>
          </div>

          <dl className="col-span-6 md:col-start-8 md:col-span-5 bg-plate-raised border-4 border-edge">
            {t.hero.spec.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3 border-b-2 border-edge-soft">
                <dt className="t-label text-graphite">{k}</dt>
                <dd className="t-data text-ink text-right">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between items-stretch">
              <dt className="t-label text-graphite px-4 py-3">{t.hero.status}</dt>
              <dd className="t-label bg-yellow text-on-accent px-4 py-3 flex items-center">{t.hero.available}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
