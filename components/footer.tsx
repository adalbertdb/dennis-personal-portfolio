"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-6 py-8 relative"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left — logo + copyright */}
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-sm gradient-text tracking-tight">DA</span>
          <span className="text-white/15 text-xs">·</span>
          <p className="text-white/25 text-xs font-heading">
            {year} Dennis Adalbert · {t.footer.built}
          </p>
        </div>

        {/* Right — socials */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/adalbertdb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white/25 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/dennis-adalbert-boghean-5413582b8/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/25 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:dbadalbert@gmail.com"
            aria-label="Email"
            className="text-white/25 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  );
}
