"use client";
// Un gesto de scroll (rueda, trackpad, dedo, teclado) = una parada. El paso se anima hasta la siguiente parada y lo
// que quede de ese gesto, inercia incluida, se ignora: hace falta un gesto nuevo (otro toque, o la rueda tras un
// respiro de GAP ms) para el siguiente. Los enlaces del menú van a su parada. Con prefers-reduced-motion no se
// monta nada: scroll nativo.

import { useEffect } from "react";
import { getLenis } from "@/components/smooth-scroll";

const GAP = 200;
const maxY = () => document.documentElement.scrollHeight - innerHeight;
const jump = (y: number) => scrollTo({ top: Math.max(0, Math.min(maxY(), y)), behavior: "instant" });

let go = jump;

/** Lleva el scroll a `y` con el paso animado (o de golpe si no está activo). Infinity = el final. */
export const scrollToY = (y: number) => go(y);

const at = (id: string, offset = 0) => {
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().top + scrollY - offset : 0;
};

// Héroe, stack encendido, proceso, trabajo (en pasos de pantalla, que los proyectos son altos), test y email.
function stops() {
  const work = at("work", 80);
  const test = at("contact");
  const inWork: number[] = [];
  for (let y = work + innerHeight * 0.85; y < test - innerHeight * 0.5; y += innerHeight * 0.85) inWork.push(y);
  return [0, at("stack"), at("proceso"), work, ...inWork, test, Infinity];
}

export function StepScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let busyUntil = 0;
    let lastWheel = 0;
    let touchY: number | null = null;

    go = (target) => {
      getLenis()?.stop(); // Lenis suaviza la rueda a su manera; aquí manda el paso
      cancelAnimationFrame(raf);
      const from = scrollY;
      const to = Math.max(0, Math.min(maxY(), target));
      const dur = Math.min(1400, 500 + Math.abs(to - from) * 0.25);
      const t0 = performance.now();
      busyUntil = t0 + dur;
      const frame = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        jump(from + (to - from) * (1 - (1 - k) ** 3));
        if (k < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const step = (dir: number) => {
      if (performance.now() < busyUntil) return;
      const y = scrollY;
      const list = stops().map((s) => Math.min(s, maxY()));
      const next = dir > 0 ? list.find((s) => s > y + 4) : list.findLast((s) => s < y - 4);
      if (next !== undefined) go(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // zoom
      e.preventDefault();
      getLenis()?.stop(); // Lenis se crea después de este efecto (el layout monta tras sus hijos)
      const now = performance.now();
      const fresh = now - lastWheel > GAP;
      lastWheel = now;
      if (fresh && Math.abs(e.deltaY) > 2) step(Math.sign(e.deltaY));
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY !== null) e.preventDefault(); // un dedo: el paso lo hace el gesto, no el scroll nativo
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(dy) > 30) step(Math.sign(dy));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = (e.target as Element).closest("input, textarea, select, button, a");
      const dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, " ": typing ? 0 : e.shiftKey ? -1 : 1 }[e.key];
      if (dir) {
        e.preventDefault();
        step(dir);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        go(e.key === "Home" ? 0 : Infinity);
      }
    };
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element).closest("a[href^='#']")?.getAttribute("href");
      const el = href && document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation(); // el de Lenis (parado) no haría nada
      go(el.id === "top" ? 0 : el.getBoundingClientRect().top + scrollY - (el.id === "work" ? 80 : 0));
    };

    getLenis()?.stop();
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onTouchEnd);
    addEventListener("keydown", onKey);
    addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      go = jump;
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onTouchEnd);
      removeEventListener("keydown", onKey);
      removeEventListener("click", onClick, true);
      getLenis()?.start();
    };
  }, []);

  return null;
}
