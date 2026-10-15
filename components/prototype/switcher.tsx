"use client";
// PROTOTYPE — barra flotante para alternar variantes con ?variant=. Solo se monta en desarrollo (ver app/page.tsx).

import { useEffect } from "react";

export const VARIANTS = [
  ["actual", "Actual"],
  ["despiece", "A — Despiece"],
  ["linea", "B — Línea"],
  ["oblea", "C — Oblea"],
  ["grua", "D — Grúa"],
] as const;

export function PrototypeSwitcher({ current }: { current: string }) {
  const i = Math.max(0, VARIANTS.findIndex(([k]) => k === current));

  // Recarga completa: cada variante monta su propio WebGL/canvas y Lenis; así no arrastran estado entre sí.
  const go = (d: number) => {
    const [k] = VARIANTS[(i + d + VARIANTS.length) % VARIANTS.length];
    window.location.assign(k === "actual" ? "/" : `/?variant=${k}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1 rounded-full bg-[#ff2d78] text-white px-1 py-1 shadow-[0_8px_30px_rgba(0,0,0,.45)]"
      style={{ fontFamily: "system-ui, sans-serif", fontSize: 13 }}
    >
      <button onClick={() => go(-1)} className="size-8 rounded-full hover:bg-white/20 cursor-pointer" aria-label="Variante anterior">
        ←
      </button>
      <span className="px-2 font-semibold whitespace-nowrap">
        {VARIANTS[i][1]} <span className="opacity-60 font-normal">· {i + 1}/{VARIANTS.length}</span>
      </span>
      <button onClick={() => go(1)} className="size-8 rounded-full hover:bg-white/20 cursor-pointer" aria-label="Variante siguiente">
        →
      </button>
    </div>
  );
}
