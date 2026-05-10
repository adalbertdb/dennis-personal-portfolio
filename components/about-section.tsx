"use client";

import { GraduationCap, MapPin, Code2, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/use-language";
import { useScrollReveal, useScrollRevealChildren } from "@/hooks/use-scroll-reveal";

const CARD_ACCENTS = [
  { color: "#7DD3FC", Icon: GraduationCap },
  { color: "#67E8F9", Icon: MapPin },
  { color: "#A5B4FC", Icon: Code2 },
  { color: "#C084FC", Icon: Rocket },
];

export function AboutSection() {
  const { t } = useLanguage();
  const headingRef = useScrollReveal();
  const cardsRef = useScrollRevealChildren();

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      {/* Chapter number */}
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 font-heading font-bold select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(12rem, 28vw, 22rem)",
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        03
      </span>

      {/* Decorative circles */}
      <svg
        className="absolute -top-20 -left-20 pointer-events-none select-none opacity-[0.06]"
        width="400" height="400" viewBox="0 0 400 400" fill="none" aria-hidden="true"
      >
        <circle cx="200" cy="200" r="198" stroke="#67E8F9" strokeWidth="1" fill="none" />
        <circle cx="200" cy="200" r="140" stroke="#C084FC" strokeWidth="1" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="reveal mb-16"
        >
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            Chapter 03 — {t.about.label}
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              className="font-heading font-bold"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.05em", lineHeight: 1.0 }}
            >
              {t.about.title}
            </h2>
          </div>
          <div className="h-px w-full mt-4" style={{ background: "linear-gradient(90deg, rgba(192,132,252,0.4), rgba(244,114,182,0.2), transparent)" }} />
        </div>

        {/* Two-column layout: text (40%) + cards (60%) */}
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-start">

          {/* Left — text */}
          <div className="space-y-5">
            <p className="text-white/50 leading-relaxed text-sm">{t.about.p1}</p>
            <p className="text-white/50 leading-relaxed text-sm">
              {t.about.p2.split(/(Vue\.js|Spring Boot|Flutter)/).map((part, i) =>
                ["Vue.js", "Spring Boot", "Flutter"].includes(part) ? (
                  <span key={i} className="font-semibold" style={{ color: "#A5B4FC" }}>
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </p>
            <p className="text-white/50 leading-relaxed text-sm">{t.about.p3}</p>
          </div>

          {/* Right — info cards */}
          <div
            ref={cardsRef as React.RefObject<HTMLDivElement>}
            className="grid grid-cols-2 gap-3"
          >
            {t.about.cards.map((card, i) => {
              const { color, Icon } = CARD_ACCENTS[i];
              return (
                <div key={card.title} className={`card-wire p-5 reveal reveal-delay-${i + 1}`}>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <h3 className="font-heading font-semibold text-xs text-white mb-1.5 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/35 text-xs leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
