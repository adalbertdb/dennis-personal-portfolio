"use client";
// «Oblea». Fábrica de semiconductores: el scroll hace zoom desde una oblea entera hasta un único die, cuyo plano de
// planta es el stack (cada bloque se enciende por orden), y sigue hacia dentro del núcleo, donde está el proceso:
// el material es el mismo para todos, el workflow no. El canvas es decoración: el stack también está en el DOM
// (lista sr-only) para lectores de pantalla, Ctrl+F y crawlers.

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/use-language";
import { lerp, pad, pinProgress, rafLoop, smooth } from "@/lib/scroll";
import { STAMP } from "@/lib/site";

const N = 15; // dies por lado de la retícula
const S = 2 / N; // tamaño de die (radio de oblea = 1)
const TARGET = { i: 9, j: 6 };
const T = { x: (TARGET.i - (N - 1) / 2) * S, y: (TARGET.j - (N - 1) / 2) * S };
const Z_DIE = 14;
const Z_CORE = 9;
// Plano de planta en coordenadas del die [0, 1], en el orden en que se encienden. Framework antes que lenguaje.
const BLOCKS = [
  { x: 0.56, y: 0.08, w: 0.36, h: 0.24, fill: "dots", es: "Frontend", en: "Frontend", techs: ["Next.js", "Vue.js", "Tailwind CSS"] },
  { x: 0.34, y: 0.6, w: 0.22, h: 0.32, fill: "dots", es: "Móvil", en: "Mobile", techs: ["Flutter"] },
  { x: 0.08, y: 0.08, w: 0.44, h: 0.48, fill: "dots", es: "Backend", en: "Backend", techs: ["Spring Boot", "Node.js · TypeScript"] },
  { x: 0.08, y: 0.6, w: 0.22, h: 0.32, fill: "grid", es: "Datos", en: "Data", techs: ["Python", "PostgreSQL", "Supabase"] },
  { x: 0.6, y: 0.6, w: 0.32, h: 0.32, fill: "lines", es: "Infra", en: "Infra", techs: ["Linux", "Docker", "Dokploy", "Git", "CI/CD"] },
  { x: 0.56, y: 0.36, w: 0.36, h: 0.2, fill: "grid", es: "Agentes", en: "Agents", techs: ["Claude Code", "Codex"] },
] as const;
const CORE = { x: 0.3, y: 0.32 }; // centro del bloque backend
// El zoom (oblea → die → núcleo) ocupa este tramo del scroll; el resto es el proceso.
const ZOOM_END = 0.7;

const DIES = (() => {
  const out: { x: number; y: number; target: boolean; lit: boolean }[] = [];
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const x = (i - (N - 1) / 2) * S;
      const y = (j - (N - 1) / 2) * S;
      const far = Math.hypot(Math.abs(x) + S / 2, Math.abs(y) + S / 2);
      if (far > 0.985) continue;
      out.push({ x, y, target: i === TARGET.i && j === TARGET.j, lit: (i * 7 + j * 13) % 5 === 0 });
    }
  return out;
})();

export function Wafer() {
  const { lang, t } = useLanguage();

  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const procRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const pin = pinRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 2);
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ctx.font no resuelve variables CSS: se leen las familias que next/font dejó en <html>.
    const rootStyle = getComputedStyle(document.documentElement);
    const mono = rootStyle.getPropertyValue("--font-plex-mono") || "monospace";
    const sans = rootStyle.getPropertyValue("--font-archivo") || "sans-serif";
    const Y = rootStyle.getPropertyValue("--accent-y").trim() || "#f5c400";
    const { stages } = t.stack;

    const tile = (size: number, paint: (g: CanvasRenderingContext2D, u: number) => void) => {
      const c = document.createElement("canvas");
      c.width = c.height = size * dpr;
      paint(c.getContext("2d")!, dpr);
      const pat = ctx.createPattern(c, "repeat")!;
      pat.setTransform(new DOMMatrix().scale(1 / dpr));
      return pat;
    };
    const dot = (color: string, size: number, r: number) =>
      tile(size, (g, u) => {
        g.fillStyle = color;
        g.beginPath();
        g.arc((size / 2) * u, (size / 2) * u, r * u, 0, Math.PI * 2);
        g.fill();
      });
    const pats = {
      dim: dot("#2b2b2b", 6, 1.1),
      lit: { dots: dot("#ffffff", 6, 1.3), grid: tile(9, (g, u) => ((g.fillStyle = "#fff"), g.fillRect(u, u, 6 * u, 6 * u))), lines: tile(6, (g, u) => ((g.fillStyle = "#fff"), g.fillRect(0, u, 6 * u, 1.5 * u))) },
      die: dot("#3a3a3a", 5, 0.9),
      dieLit: dot("#8a8a8a", 5, 0.9),
    };

    let w = 0;
    let h = 0;
    let raw = pinProgress(pin); // desde la posición real: el efecto se rehace al cambiar de idioma

    return rafLoop((now) => {
      const time = now / 1000;
      const rect = pin.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      if (canvas.clientWidth !== w || canvas.clientHeight !== h) {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      raw = lerp(raw, pinProgress(pin), 0.22);
      const p = Math.min(1, raw / ZOOM_END);
      const proc = smooth(ZOOM_END, ZOOM_END + 0.04, raw);
      const a = smooth(0.06, 0.45, p);
      const deep = smooth(0.78, 1, p);
      const rot = (1 - smooth(0, 0.7, a)) * (0.5 + (calm ? 0 : Math.sin(time * 0.15) * 0.3));
      // En vertical el die llena el ancho (si no, sus etiquetas quedan diminutas).
      const zDie = Z_DIE * (w < h ? 1.25 : 1);
      const z = Math.exp(a * Math.log(zDie)) * Math.exp(deep * Math.log(Z_CORE));
      const k = 0.42 * Math.min(w, h) * z;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const coreX = T.x - S / 2 + CORE.x * S;
      const coreY = T.y - S / 2 + CORE.y * S;
      const cx = lerp(lerp(0, T.x * cos - T.y * sin, a), coreX, deep);
      const cy = lerp(lerp(0, T.x * sin + T.y * cos, a), coreY, deep);
      // En el héroe la oblea se aparta del titular: a la derecha en horizontal, abajo en vertical.
      const offX = (1 - a) * (w > h ? 0.2 * w : 0);
      const offY = (1 - a) * (w > h ? 0.04 * h : -0.02 * h);
      const sx = (x: number, y: number) => (x * cos - y * sin - cx) * k + w / 2 + offX;
      const sy = (x: number, y: number) => (x * sin + y * cos - cy) * k + h / 2 + offY;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Borde de la oblea y muesca
      const ox = sx(0, 0);
      const oy = sy(0, 0);
      if (k < 6 * Math.max(w, h)) {
        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ox, oy, k, 0, Math.PI * 2);
        ctx.stroke();
        const na = Math.PI / 2 + rot;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(ox + Math.cos(na) * k, oy + Math.sin(na) * k, 0.025 * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Dies
      const half = (S / 2) * 0.94;
      for (const d of DIES) {
        const dx = sx(d.x, d.y);
        const dy = sy(d.x, d.y);
        const r = half * k * 1.5;
        if (dx < -r || dx > w + r || dy < -r || dy > h + r) continue;
        ctx.beginPath();
        for (const [ux, uy] of [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ])
          ctx.lineTo(sx(d.x + ux * half, d.y + uy * half), sy(d.x + ux * half, d.y + uy * half));
        ctx.closePath();
        ctx.fillStyle = d.lit ? pats.dieLit : pats.die;
        ctx.globalAlpha = d.target ? 1 - smooth(0.6, 0.9, a) : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = d.target ? Y : "rgba(255,255,255,.16)";
        ctx.lineWidth = d.target ? 1.5 : 1;
        if (d.target) {
          ctx.shadowColor = Y;
          ctx.shadowBlur = 14 * (1 - a);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Plano de planta del die objetivo
      const f = smooth(0.7, 0.95, a);
      if (f > 0) {
        const D = half * 2 * k;
        const x0 = sx(T.x - half, T.y - half);
        const y0 = sy(T.x - half, T.y - half);
        ctx.globalAlpha = f;
        ctx.strokeStyle = "rgba(255,255,255,.4)";
        for (let n = 0; n < 16; n++) {
          const o = 0.06 + (n / 15) * 0.88;
          const pz = D * 0.022;
          for (const [px, py] of [
            [o, 0.02],
            [o, 0.98],
            [0.02, o],
            [0.98, o],
          ])
            ctx.strokeRect(x0 + px * D - pz / 2, y0 + py * D - pz / 2, pz, pz);
        }
        // Etiqueta: título y un material por línea, diseñada a escala 1. Todas comparten la mayor
        // escala que cabe en todos los bloques (con tope), así ninguna se sale del suyo y tienen el mismo cuerpo.
        const sizes = BLOCKS.map((b) => {
          ctx.font = `800 18px ${sans}`;
          const titleW = ctx.measureText(b[lang].toUpperCase()).width;
          ctx.font = `400 12px ${mono}`;
          return { w: Math.max(titleW, ...b.techs.map((s) => ctx.measureText(s).width)) + 20, h: 42 + b.techs.length * 16 };
        });
        const ls = Math.min(1.2, ...BLOCKS.map((b, i) => Math.min((b.w * D - 16) / sizes[i].w, (b.h * D - 16) / sizes[i].h)));
        BLOCKS.forEach((b, i) => {
          const on = smooth(0.42 + i * 0.045, 0.52 + i * 0.045, p);
          const bx = x0 + b.x * D;
          const by = y0 + b.y * D;
          const bw = b.w * D;
          const bh = b.h * D;
          ctx.fillStyle = pats.dim;
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = pats.lit[b.fill];
          ctx.fillRect(bx, by + bh * (1 - on), bw, bh * on);
          ctx.strokeStyle = on > 0.02 && on < 0.98 ? Y : "rgba(255,255,255,.55)";
          ctx.lineWidth = on > 0.02 && on < 0.98 ? 2 : 1;
          ctx.strokeRect(bx, by, bw, bh);
          if (on > 0.05 && deep < 0.15) {
            ctx.globalAlpha = f * Math.min(1, on * 2) * (1 - smooth(0, 0.15, deep));
            ctx.save();
            ctx.translate(bx + 8, by + 8);
            ctx.scale(ls, ls);
            ctx.textBaseline = "top";
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, sizes[i].w, sizes[i].h);
            ctx.font = `800 18px ${sans}`;
            ctx.fillStyle = "#fff";
            ctx.fillText(b[lang].toUpperCase(), 10, 10);
            ctx.font = `400 12px ${mono}`;
            ctx.fillStyle = "rgba(255,255,255,.7)";
            b.techs.forEach((s, li) => ctx.fillText(s, 10, 36 + li * 16));
            ctx.restore();
            ctx.globalAlpha = f;
          }
        });
        ctx.globalAlpha = 1;
      }

      // Dentro del núcleo, el material queda de fondo para que se lea el proceso.
      if (proc > 0) {
        ctx.fillStyle = `rgba(0,0,0,${proc * 0.92})`;
        ctx.fillRect(0, 0, w, h);
      }

      if (heroRef.current) {
        const out = smooth(0, 0.16, p);
        heroRef.current.style.opacity = String(1 - out);
        heroRef.current.style.transform = `scale(${1 + out * 0.08})`;
      }
      if (hudRef.current) hudRef.current.style.opacity = String(smooth(0.1, 0.2, p));
      if (zoomRef.current) zoomRef.current.textContent = z.toFixed(1);
      if (stageRef.current) stageRef.current.textContent = stages[deep > 0.3 ? 2 : a > 0.8 ? 1 : 0];
      if (procRef.current) procRef.current.style.opacity = String(proc);
      if (fadeRef.current) fadeRef.current.style.opacity = String(smooth(0.95, 1, raw));
    });
  }, [lang]);

  return (
    <section id="top" ref={pinRef} className="relative" style={{ height: "530vh" }}>
      {/* Paradas del scroll (raw = top · 530 / 430): stack con todos los bloques encendidos (p ≈ 0.76) y proceso. */}
      <span id="stack" className="absolute left-0" style={{ top: "43%" }} />
      <span id="proceso" className="absolute left-0" style={{ top: "69%" }} />
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />

        <div ref={heroRef} className="absolute inset-0 pointer-events-none origin-center">
          <div className="absolute left-5 md:left-8 top-24 md:top-28 right-5">
            <h1 className="font-extrabold uppercase leading-[0.84]" style={{ ...STAMP, fontSize: "clamp(52px, 10.5vw, 168px)" }}>
              Dennis <br />
              Adalbert
            </h1>
          </div>
          <div className="absolute inset-x-5 md:inset-x-8 bottom-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[40ch]">
              <p className="t-label text-white/55">{t.hero.role}</p>
              <p className="t-label text-white/40 mb-3">{t.hero.where}</p>
              <p className="text-white/70 text-base leading-relaxed">{t.hero.line}</p>
            </div>
            <span className="t-label flex items-center gap-2 border border-white/25 rounded-full px-4 py-2">
              <span className="rec size-2 rounded-full bg-yellow" />
              {t.hero.available}
            </span>
          </div>
        </div>

        <div ref={hudRef} className="absolute inset-x-5 md:inset-x-8 bottom-10 flex justify-between items-end pointer-events-none opacity-0" aria-hidden="true">
          <span className="t-label text-white/50">
            zoom × <span ref={zoomRef}>1.0</span>
          </span>
          <span ref={stageRef} className="font-extrabold uppercase text-3xl md:text-5xl" style={STAMP} />
        </div>

        <div ref={procRef} className="absolute inset-x-5 md:inset-x-8 top-20 bottom-28 flex flex-col justify-center gap-8 md:gap-12 pointer-events-none opacity-0">
          <p className="pointer-events-auto font-extrabold uppercase leading-[0.95] max-w-[28ch]" style={{ ...STAMP, fontSize: "clamp(24px, 3.5vw, 54px)" }}>
            <span className="text-white/55">{t.process.claim[0]}</span>{" "}
            {/* Cada pregunta se enciende en amarillo al pasar por encima. */}
            {t.process.claim[1].split(/(?<=\?) /).map((q) => (
              <span key={q} className="transition-colors duration-200 hover:text-yellow">
                {q}{" "}
              </span>
            ))}
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3">
            {t.process.steps.map(([name, detail, fab], i) => (
              <li key={name} className="flex flex-col gap-1 md:gap-3 rounded-[14px] border border-white/55 bg-black px-4 py-3 md:p-5">
                <span className="t-label text-white/45">
                  {pad(i + 1)} · {fab}
                </span>
                <span className="font-extrabold uppercase leading-none" style={{ ...STAMP, fontSize: "clamp(18px, 1.7vw, 26px)" }}>
                  {name}
                </span>
                {/* En móvil bajito no cabe: el nombre del paso basta. */}
                <span className="hidden md:block [@media(min-height:760px)]:block text-sm text-white/60 leading-snug">{detail}</span>
              </li>
            ))}
          </ol>
        </div>
        <div ref={fadeRef} className="absolute inset-0 bg-black opacity-0 pointer-events-none" />
      </div>

      <div className="sr-only">
        <h2>{t.stack.title}</h2>
        <ul>
          {BLOCKS.map((b) => (
            <li key={b.en}>
              {b[lang]}: {b.techs.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
