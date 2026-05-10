"use client";

import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

/* ─── Brand Icon SVGs ─────────────────────────────────────── */
function IconCircle() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="ic-circle" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="55%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#F472B6" />
        </radialGradient>
      </defs>
      <circle cx="26" cy="26" r="26" fill="url(#ic-circle)" />
    </svg>
  );
}

function IconSquare() {
  return (
    <svg width="40" height="40" viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ic-square" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <rect width="46" height="46" rx="3" fill="url(#ic-square)" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="40" height="40" viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ic-play" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
      <polygon points="42,23 10,5 10,41" fill="url(#ic-play)" />
    </svg>
  );
}

/* ─── Component ───────────────────────────────────────────── */
export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 overflow-hidden"
    >
      {/* Chapter number — background decoration */}
      <span
        className="absolute right-8 top-1/2 -translate-y-1/2 font-heading font-bold select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(12rem, 28vw, 22rem)",
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        01
      </span>

      {/* Wireframe decorations — top-right quadrant */}
      <svg
        className="absolute top-0 right-0 pointer-events-none select-none"
        width="480"
        height="480"
        viewBox="0 0 480 480"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sh-tr-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="sh-tr-t" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="380" cy="100" r="240" stroke="url(#sh-tr-c)" strokeWidth="1" fill="none" />
        <polygon points="420,60 480,400 360,400" stroke="url(#sh-tr-t)" strokeWidth="1" fill="none" />
      </svg>

      {/* Bottom-left corner */}
      <svg
        className="absolute bottom-0 left-0 pointer-events-none select-none"
        width="220"
        height="160"
        viewBox="0 0 220 160"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sh-bl2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="190" height="130" stroke="url(#sh-bl2)" strokeWidth="1" fill="none" />
      </svg>

      {/* ─── Main content — offset left ─────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="max-w-2xl">

          {/* Icons row */}
          <div className="hero-anim hero-anim-1 flex items-center gap-3 mb-10">
            <IconCircle />
            <IconSquare />
            <IconPlay />
          </div>

          {/* Chapter label */}
          <p
            className="hero-anim hero-anim-1 font-heading text-xs font-semibold uppercase tracking-[0.25em] mb-6"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Chapter 01 — Introduction
          </p>

          {/* Heading */}
          <h1
            className="hero-anim hero-anim-2 font-heading font-bold leading-[1.02] mb-6"
            style={{
              fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
              letterSpacing: "-0.05em",
            }}
          >
            <span className="text-white">{t.hero.heading}</span>
            <br />
            <span className="gradient-text">Dennis</span>
            <span className="text-white">.</span>
          </h1>

          {/* Role */}
          <p
            className="hero-anim hero-anim-3 font-heading font-medium mb-4"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "-0.01em",
            }}
          >
            {t.hero.subtitle}
          </p>

          {/* Description */}
          <p
            className="hero-anim hero-anim-3 text-white/40 leading-relaxed mb-10 max-w-lg"
            style={{ fontSize: "clamp(0.875rem, 1.3vw, 0.95rem)" }}
          >
            {t.hero.description}
          </p>

          {/* CTAs */}
          <div className="hero-anim hero-anim-4 flex flex-wrap items-center gap-4 mb-12">
            <a
              href="#projects"
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
              {t.hero.btnWork}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#contact"
              className="font-heading font-medium text-sm text-white/40 hover:text-white transition-colors duration-200 cursor-pointer tracking-tight"
            >
              {t.hero.btnContact} →
            </a>
          </div>

          {/* Social links */}
          <div className="hero-anim hero-anim-5 flex items-center gap-6">
            <a
              href="https://github.com/adalbertdb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-white/25 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/dennis-adalbert-boghean-5413582b8/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/25 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href="mailto:dbadalbert@gmail.com"
              aria-label="Email"
              className="text-white/25 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>

        </div>
      </div>

      {/* Scroll hint — bottom center */}
      <div
        className="hero-anim hero-anim-5 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <div
          className="w-px h-12 rounded-full"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%)",
          }}
        />
        <span
          className="font-heading font-semibold uppercase tracking-[0.2em] text-white/20"
          style={{ fontSize: "9px" }}
        >
          scroll
        </span>
      </div>
    </section>
  );
}
