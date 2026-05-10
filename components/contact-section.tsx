"use client";

import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/use-language";
import { useScrollReveal, useScrollRevealChildren } from "@/hooks/use-scroll-reveal";

const CONTACT_LINKS = [
  {
    Icon: Mail,
    label: "Email",
    value: "dbadalbert@gmail.com",
    href: "mailto:dbadalbert@gmail.com",
    color: "#F472B6",
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    value: "dennis-adalbert-boghean",
    href: "https://www.linkedin.com/in/dennis-adalbert-boghean-5413582b8/",
    color: "#7DD3FC",
  },
  {
    Icon: Github,
    label: "GitHub",
    value: "adalbertdb",
    href: "https://github.com/adalbertdb",
    color: "#A5B4FC",
  },
];

export function ContactSection() {
  const { t } = useLanguage();
  const headingRef = useScrollReveal();
  const cardsRef = useScrollRevealChildren();

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
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
        05
      </span>

      {/* Decorative */}
      <svg
        className="absolute -left-16 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.06]"
        width="320" height="320" viewBox="0 0 320 320" fill="none" aria-hidden="true"
      >
        <circle cx="160" cy="160" r="158" stroke="#C084FC" strokeWidth="1" fill="none" />
        <polygon points="160,30 300,290 20,290" stroke="#67E8F9" strokeWidth="1" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto">

        {/* Header — left aligned */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="reveal mb-16"
        >
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            Chapter 05 — {t.contact.label}
          </p>
          <h2
            className="font-heading font-bold mb-2"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.05em", lineHeight: 1.0 }}
          >
            {t.contact.title}
          </h2>
          <div className="h-px w-full mt-4" style={{ background: "linear-gradient(90deg, rgba(244,114,182,0.4), rgba(192,132,252,0.2), transparent)" }} />
        </div>

        {/* Two-col: description + links */}
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-start">

          {/* Left — copy */}
          <div className="space-y-6">
            <p className="text-white/45 leading-relaxed text-sm">{t.contact.description}</p>
            <div className="flex items-center gap-2 text-white/25 text-xs font-heading">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t.contact.location}</span>
            </div>
            <a
              href="mailto:dbadalbert@gmail.com"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-heading font-semibold text-sm text-white transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7DD3FC, #C084FC, #F472B6)",
                boxShadow: "0 0 28px rgba(192,132,252,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 44px rgba(192,132,252,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(192,132,252,0.3)";
              }}
            >
              <Mail className="w-4 h-4" />
              {t.contact.cta}
            </a>
          </div>

          {/* Right — contact cards */}
          <div
            ref={cardsRef as React.RefObject<HTMLDivElement>}
            className="space-y-0"
          >
            {CONTACT_LINKS.map((link, i) => {
              const { Icon, label, value, href, color } = link;
              return (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`reveal reveal-delay-${i + 1} flex items-center gap-5 py-5 border-b group cursor-pointer`}
                  style={{ borderColor: "rgba(255,255,255,0.05)", textDecoration: "none" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{ background: `${color}10`, border: `1px solid ${color}28` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-xs text-white mb-0.5">{label}</p>
                    <p className="text-white/30 text-xs truncate group-hover:text-white/60 transition-colors duration-200">{value}</p>
                  </div>
                  <span className="text-white/15 group-hover:text-white/40 transition-colors duration-200 text-sm">→</span>
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
