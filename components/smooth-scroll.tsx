"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let current: Lenis | undefined;

/** La instancia activa de Lenis (no hay con prefers-reduced-motion), para quien necesite pararla o scrollear con ella. */
export const getLenis = () => current;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    });
    current = lenis;

    let id: number;
    function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    }

    id = requestAnimationFrame(raf);

    // Anchor links: let Lenis handle smooth scroll-to
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.6 });
    };

    document.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      current = undefined;
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <>{children}</>;
}
