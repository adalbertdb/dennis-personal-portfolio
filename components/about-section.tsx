"use client";

import { useLanguage } from "@/lib/use-language";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function AboutSection() {
  const { t } = useLanguage();
  const headingRef = useScrollReveal();

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
          id="about-heading"
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="reveal mb-16"
        >
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            Chapter 03 — {t.about.label}
          </p>
          <h2
            className="font-heading font-bold"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.05em", lineHeight: 1.0 }}
          >
            {t.about.title}
          </h2>
          <div className="h-px w-full mt-4" style={{ background: "linear-gradient(90deg, rgba(192,132,252,0.4), rgba(244,114,182,0.2), transparent)" }} />
        </div>

        {/* Text — two columns on large screens */}
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-5">
          <p className="text-white/50 leading-relaxed text-sm">{t.about.p1}</p>
          <p className="text-white/50 leading-relaxed text-sm">
            {t.about.p2.split(/(Flutter|Dart|Node\.js|Supabase|Vue\.js|Rust)/).map((part, i) =>
              ["Flutter", "Dart", "Node.js", "Supabase", "Vue.js", "Rust"].includes(part) ? (
                <span key={i} className="font-semibold" style={{ color: "#A5B4FC" }}>
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
          <p className="text-white/50 leading-relaxed text-sm lg:col-span-2 max-w-2xl">{t.about.p3}</p>
        </div>

      </div>
    </section>
  );
}
