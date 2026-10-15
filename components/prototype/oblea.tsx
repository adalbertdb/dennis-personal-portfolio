"use client";
// PROTOTYPE C — «Oblea». Fábrica de semiconductores: el scroll hace zoom desde una oblea entera hasta un
// único die, cuyo plano de planta es el stack (cada bloque se enciende por orden), y sigue hacia dentro del
// núcleo, donde está el proceso: el material es el mismo para todos, el workflow no. Trabajo como mapa de
// dies; el contacto empieza con un test PASS/FAIL que acaba en el email.

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/use-language";
import { getLenis } from "@/components/smooth-scroll";
import type { PinnedRepo } from "@/lib/github";
import { EMAIL, LINKS, enterProgress, lerp, pad, pinProgress, projectList, rafLoop, smooth } from "./shared";

// Titulares en Archivo ancho, como t-stamp de la web actual (sin su color: aquí el fondo es negro).
const STAMP = { fontVariationSettings: '"wdth" 118', letterSpacing: "-0.025em" } as const;

const Y = "#f5c400";
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
// El zoom (oblea → die → núcleo) ocupa este tramo del scroll con el ritmo de antes; el resto es el proceso.
const ZOOM_END = 0.7;

// PROTOTYPE: si gana C, este copy pasa a lib/translations.ts.
const COPY = {
  es: {
    line: "Tengo la manía de convertir cualquier problema en una idea de app. Casi todas se quedan en mi cabeza. Las que salen, las construyo enteras, del backend al último píxel.",
    nav: "Proceso",
    stages: ["", "Stack", "Proceso"],
    projects: "proyectos",
    claim: ["Con IA, cualquiera hace algo.", "Pero ¿sirve? ¿Funciona\u00a0bien? ¿Es\u00a0fácil\u00a0de\u00a0usar?"],
    steps: [
      ["Entender", "A quien lo va a usar y qué necesita de verdad.", "¿para quién?"],
      ["Especificar", "Qué se construye y cómo sabremos que funciona.", "¿qué y por qué?"],
      ["Prototipar", "Varias versiones baratas; se elige una con criterio.", "¿cómo se usa?"],
      ["Construir", "Con agentes: Claude Code · Codex.", "¿cómo se hace?"],
      ["Verificar", "En la app real, no solo en los tests.", "¿funciona?"],
    ],
    test: {
      title: "¿Este portfolio pasa el test?",
      body: "El último paso del proceso es verificar en la app real. La app real es esta, y el test eres tú.",
      idle: "Contacto",
      pass: "¡Genial! Hablemos",
      fail: "Abre un ticket, porfi",
    },
  },
  en: {
    line: "I have a habit of turning every problem into an app idea. Most never leave my head. The ones that do, I build end to end, from the backend to the last pixel.",
    nav: "Process",
    stages: ["", "Stack", "Process"],
    projects: "projects",
    claim: ["Anyone can build something with AI.", "But does it solve anything? Does it\u00a0work? Is\u00a0it\u00a0easy\u00a0to\u00a0use?"],
    steps: [
      ["Understand", "Who's going to use it and what they really need.", "who for?"],
      ["Spec", "What gets built and how we'll know it works.", "what and why?"],
      ["Prototype", "Several cheap versions; pick one on purpose.", "how does it feel?"],
      ["Build", "With agents: Claude Code · Codex.", "how is it built?"],
      ["Verify", "In the real app, not just in the tests.", "does it work?"],
    ],
    test: {
      title: "Does this portfolio pass the test?",
      body: "The last step of the process is verifying in the real app. This is the real app, and you're the test.",
      idle: "Contact",
      pass: "Great! Let's talk",
      fail: "Open a ticket plz",
    },
  },
} as const;

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

export function Oblea({ repos }: { repos: PinnedRepo[] }) {
  const { lang, t, toggleLang } = useLanguage();
  const list = projectList(repos, t);
  const copy = COPY[lang];

  const stackRef = useRef<HTMLSpanElement>(null);
  const processRef = useRef<HTMLSpanElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  // Paradas del scroll, una por gesto: héroe, stack encendido, proceso, trabajo (en pasos de pantalla, que los
  // proyectos son altos), test y email.
  const goTo = useStepScroll(() => {
    const at = (el: Element | null, offset = 0) => (el ? el.getBoundingClientRect().top + scrollY - offset : 0);
    const work = at(workRef.current, 80);
    const test = at(contactRef.current);
    const inWork = [];
    for (let y = work + innerHeight * 0.85; y < test - innerHeight * 0.5; y += innerHeight * 0.85) inWork.push(y);
    return [0, at(stackRef.current), at(processRef.current), work, ...inWork, test, Infinity];
  });
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const procRef = useRef<HTMLDivElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const pin = pinRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 2);
    // ctx.font no resuelve variables CSS: se leen las familias que next/font dejó en <html>.
    const rootStyle = getComputedStyle(document.documentElement);
    const mono = rootStyle.getPropertyValue("--font-plex-mono") || "monospace";
    const sans = rootStyle.getPropertyValue("--font-archivo") || "sans-serif";
    const { stages } = COPY[lang];

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

    const stop = rafLoop((now) => {
      const time = now / 1000;
      const doc = document.documentElement;
      const total = scrollY / (doc.scrollHeight - innerHeight);
      glyphRefs.current.forEach((g, i, all) => {
        if (!g) return;
        const at = i / (all.length - 1);
        g.style.background = Math.abs(at - total) < 0.5 / all.length ? Y : at < total ? "#fff" : "#262626";
        g.style.boxShadow = Math.abs(at - total) < 0.5 / all.length ? `0 0 10px ${Y}` : "none";
      });

      tileRefs.current.forEach((tileEl, i) => {
        if (!tileEl) return;
        const q = smooth(0.05 + (i % 3) * 0.06, 0.45 + (i % 3) * 0.06, enterProgress(tileEl));
        tileEl.style.opacity = String(q);
        tileEl.style.transform = `translateY(${(1 - q) * 60}px)`;
      });


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
      const rot = (1 - smooth(0, 0.7, a)) * (0.5 + Math.sin(time * 0.15) * 0.3);
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
          return { w: Math.max(titleW, ...b.techs.map((t) => ctx.measureText(t).width)) + 20, h: 42 + b.techs.length * 16 };
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
            b.techs.forEach((t, li) => ctx.fillText(t, 10, 36 + li * 16));
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

    return stop;
  }, [lang]);

  return (
    <div className="bg-black text-white overflow-x-clip">
      <style>{`@keyframes obleaRec { 50% { opacity: .15 } }`}</style>
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <nav className="mx-auto max-w-[1400px] h-16 px-5 md:px-8 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 t-label text-white">
            <span className="size-2.5 rounded-full bg-[#f5c400]" style={{ animation: "obleaRec 1.4s steps(1) infinite" }} />
            adalbertdb
          </a>
          <div className="flex items-center gap-6 t-label">
            {[t.navbar.links[0], copy.nav, t.navbar.links[2]].map((l, i) => (
              <a key={l} href={["#work", "#proceso", "#contact"][i]} className="hidden sm:block text-white/55 hover:text-white">
                {l}
              </a>
            ))}
            <button onClick={toggleLang} className="cursor-pointer rounded-full border border-white/30 px-3 py-1 hover:bg-white hover:text-black">
              {lang === "en" ? "ES" : "EN"}
            </button>
          </div>
        </nav>
      </header>

      {/* Barra de glifos: progreso de toda la página */}
      <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-[5px]" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} ref={(el) => void (glyphRefs.current[i] = el)} className="block w-[3px] h-[9px] rounded-full bg-[#262626]" />
        ))}
      </div>

      <section id="top" ref={pinRef} className="relative" style={{ height: "530vh" }}>
        {/* Paradas del scroll (raw = top · 530 / 430): stack con todos los bloques encendidos (p ≈ 0.76) y proceso. */}
        <span ref={stackRef} className="absolute left-0" style={{ top: "43%" }} />
        <span id="proceso" ref={processRef} className="absolute left-0" style={{ top: "69%" }} />
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 size-full" />

          <div ref={heroRef} className="absolute inset-0 pointer-events-none origin-center">
            <div className="absolute left-5 md:left-8 top-24 md:top-28 right-5">
              <h1 className="font-extrabold uppercase leading-[0.84]" style={{ ...STAMP, fontSize: "clamp(52px, 10.5vw, 168px)" }}>
                Dennis
                <br />
                Adalbert
              </h1>
            </div>
            <div className="absolute inset-x-5 md:inset-x-8 bottom-10 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[40ch]">
                <p className="t-label text-white/45 mb-3">{t.hero.role}</p>
                <p className="text-white/70 text-base leading-relaxed">{copy.line}</p>
              </div>
              <span className="t-label flex items-center gap-2 border border-white/25 rounded-full px-4 py-2">
                <span className="size-2 rounded-full bg-[#f5c400]" style={{ animation: "obleaRec 1.4s steps(1) infinite" }} />
                {t.hero.available}
              </span>
            </div>
          </div>

          <div ref={hudRef} className="absolute inset-x-5 md:inset-x-8 bottom-10 flex justify-between items-end pointer-events-none opacity-0">
            <span className="t-label text-white/50">
              zoom × <span ref={zoomRef}>1.0</span>
            </span>
            <span ref={stageRef} className="font-extrabold uppercase text-3xl md:text-5xl" style={STAMP} />
          </div>
          <div ref={procRef} className="absolute inset-x-5 md:inset-x-8 top-20 bottom-28 flex flex-col justify-center gap-8 md:gap-12 pointer-events-none opacity-0">
            <p className="pointer-events-auto font-extrabold uppercase leading-[0.95] max-w-[28ch]" style={{ ...STAMP, fontSize: "clamp(24px, 3.5vw, 54px)" }}>
              <span className="text-white/55">{copy.claim[0]}</span>{" "}
              {/* Cada pregunta se enciende en amarillo al pasar por encima. */}
              {copy.claim[1].split(/(?<=\?) /).map((q) => (
                <span key={q} className="transition-colors duration-200 hover:text-[#f5c400]">
                  {q}{" "}
                </span>
              ))}
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3">
              {copy.steps.map(([name, detail, fab], i) => (
                <li key={i} className="flex flex-col gap-1 md:gap-3 rounded-[14px] border border-white/55 bg-black px-4 py-3 md:p-5">
                  <span className="t-label text-white/45">
                    {pad(i + 1)} · {fab}
                  </span>
                  <span className="font-extrabold uppercase leading-none" style={{ ...STAMP, fontSize: "clamp(18px, 1.7vw, 26px)" }}>
                    {name}
                  </span>
                  <span className="hidden md:block text-sm text-white/60 leading-snug">{detail}</span>
                </li>
              ))}
            </ol>
          </div>
          <div ref={fadeRef} className="absolute inset-0 bg-black opacity-0 pointer-events-none" />
        </div>
      </section>

      <section id="work" ref={workRef} className="relative px-5 md:px-8 pb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between border-b border-white/15 pb-5 mb-6">
            <h2 className="font-extrabold uppercase leading-none" style={{ ...STAMP, fontSize: "clamp(44px, 8vw, 120px)" }}>
              {t.projects.title}
            </h2>
            <span className="t-label text-white/45">
              {pad(list.length)} {copy.projects}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {list.map((p, i) => (
              <a
                key={p.name}
                ref={(el) => void (tileRefs.current[i] = el)}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col justify-between gap-10 p-5 md:p-6 min-h-[300px] rounded-[20px] border will-change-transform transition-colors ${
                  p.featured ? "md:col-span-2 border-[#f5c400]/70" : "border-white/12 hover:border-white/40"
                }`}
                style={{
                  backgroundImage: `radial-gradient(circle, ${p.featured ? "rgba(245,196,0,.32)" : "rgba(255,255,255,.1)"} 1px, transparent 1.5px)`,
                  backgroundSize: "9px 9px",
                }}
              >
                <div className="flex justify-between t-label text-white/50">
                  <span>{pad(i + 1)}</span>
                  <span>{p.lang}</span>
                </div>
                <div className="bg-black/80 -mx-2 px-2 py-2 rounded-lg">
                  <h3
                    className="font-extrabold uppercase leading-[0.95] break-words group-hover:text-[#f5c400] transition-colors"
                    style={{ ...STAMP, fontSize: p.featured ? "clamp(40px, 6vw, 88px)" : "clamp(28px, 3vw, 44px)" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed mt-3 max-w-[48ch]">{p.desc}</p>
                  <span className="t-label text-white/50 mt-4 block">{p.meta} ↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" ref={contactRef} className="relative border-t border-white/10">
        <Contact lang={lang} toEnd={() => goTo(Infinity)} />
      </section>
    </div>
  );
}

// Tecla con recorrido: la cara flota sobre una base de color sólido (sin sombras) y se hunde al pulsar.
const KEY = "group flex-1 md:flex-none md:w-[230px] mt-3 cursor-pointer select-none rounded-[18px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-white";
const FACE =
  "block rounded-[18px] px-8 py-5 md:py-7 text-center font-extrabold uppercase -translate-y-2.5 transition-transform duration-200 ease-[cubic-bezier(.3,.7,.4,1.5)] group-hover:-translate-y-3.5 group-active:-translate-y-0.5 group-active:duration-[40ms]";
const KEY_TEXT = { ...STAMP, fontSize: "clamp(30px, 3.4vw, 48px)" } as const;

// Un gesto de scroll (rueda, trackpad, dedo, teclado) = una parada. El paso se anima hasta la siguiente parada y lo
// que quede de ese gesto, inercia incluida, se ignora: hace falta un gesto nuevo (otro toque, o la rueda tras un
// respiro de GAP ms) para el siguiente. Los enlaces del menú van a su parada. Devuelve cómo ir a una posición.
function useStepScroll(stops: () => number[]) {
  const go = useRef((y: number) => void y);
  const latest = useRef(stops);
  latest.current = stops;
  useEffect(() => {
    const GAP = 200;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let busyUntil = 0;
    let lastWheel = 0;
    let touchY: number | null = null;
    const max = () => document.documentElement.scrollHeight - innerHeight;

    go.current = (target) => {
      getLenis()?.stop(); // Lenis suaviza la rueda a su manera; aquí manda el paso
      cancelAnimationFrame(raf);
      const from = scrollY;
      const to = Math.max(0, Math.min(max(), target));
      const dur = reduce ? 0 : Math.min(1400, 500 + Math.abs(to - from) * 0.25);
      const t0 = performance.now();
      busyUntil = t0 + dur;
      const frame = (now: number) => {
        const k = dur ? Math.min(1, (now - t0) / dur) : 1;
        scrollTo({ top: from + (to - from) * (1 - (1 - k) ** 3), behavior: "instant" });
        if (k < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const step = (dir: number) => {
      if (performance.now() < busyUntil) return;
      const y = scrollY;
      const list = latest.current().map((s) => Math.min(s, max()));
      const next = dir > 0 ? list.find((s) => s > y + 4) : list.findLast((s) => s < y - 4);
      if (next !== undefined) go.current(next);
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
      const typing = (e.target as Element).closest("input, textarea, select, button, a");
      const dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, " ": typing ? 0 : e.shiftKey ? -1 : 1 }[e.key];
      if (dir) {
        e.preventDefault();
        step(dir);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        go.current(e.key === "Home" ? 0 : Infinity);
      }
    };
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element).closest("a[href^='#']")?.getAttribute("href");
      const el = href && document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation(); // el de Lenis (parado) no haría nada
      go.current(el.id === "top" ? 0 : el.getBoundingClientRect().top + scrollY - (el.id === "work" ? 80 : 0));
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
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onTouchEnd);
      removeEventListener("keydown", onKey);
      removeEventListener("click", onClick, true);
      getLenis()?.start();
    };
  }, []);
  return (y: number) => go.current(y);
}

// El paso 05 del proceso (¿funciona?), hecho llamada a la acción: quien visita es el test y la respuesta es el
// email, que ocupa la última pantalla (en amarillo si pasa). Tras contestar hay una pausa y la página baja a él.
// Sin contador a la vista.
function Contact({ lang, toEnd }: { lang: keyof typeof COPY; toEnd: () => void }) {
  const { test, steps } = COPY[lang];
  const [state, setState] = useState<"idle" | "pass" | "fail">("idle");

  const respond = (pass: boolean) => {
    navigator.vibrate?.(15);
    setState(pass ? "pass" : "fail");
    setTimeout(toEnd, 1300);
  };
  const answer = state === "pass" ? test.pass : state === "fail" ? test.fail : "";

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-8">
      <div className="min-h-[100svh] py-24 flex flex-col justify-center md:flex-row md:items-center md:justify-between gap-10">
        <div>
          <p className="t-label text-white/45 flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${state === "pass" ? "bg-[#f5c400]" : state === "idle" ? "bg-white/25" : "bg-white"}`}
              style={state === "pass" ? { animation: "obleaRec .25s steps(1) 6" } : undefined}
            />
            05 · {steps[4][2]}
          </p>
          <h2 className="mt-4 font-extrabold uppercase leading-[0.95]" style={{ ...STAMP, fontSize: "clamp(32px, 5vw, 76px)" }}>
            {test.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-base text-white/60 leading-relaxed">{test.body}</p>
        </div>

        <div className="md:shrink-0">
          <div className="flex gap-4">
            <button onClick={() => respond(true)} className={`${KEY} bg-[#9a7b00]`}>
              <span className={`${FACE} bg-[#f5c400] text-black`} style={KEY_TEXT}>
                Pass
              </span>
            </button>
            <button onClick={() => respond(false)} className={`${KEY} bg-[#8a8a8a]`}>
              <span className={`${FACE} bg-[#ececec] text-black`} style={KEY_TEXT}>
                Fail
              </span>
            </button>
          </div>
          <p aria-live="polite" className={`mt-5 min-h-[1.5em] font-extrabold uppercase ${state === "pass" ? "text-[#f5c400]" : "text-white"}`} style={STAMP}>
            {answer && `${answer} ↓`}
          </p>
        </div>
      </div>

      {/* Última pantalla: el email llena el ancho (≈13 em de largo) y no hay nada debajo. */}
      <div className="min-h-[100svh] border-t border-white/10 flex flex-col justify-center gap-6 md:gap-10">
        <p
          className={`font-extrabold uppercase transition-colors duration-500 ${state === "pass" ? "text-[#f5c400]" : state === "fail" ? "text-white" : "text-white/40"}`}
          style={{ ...STAMP, fontSize: "clamp(20px, 2.6vw, 40px)" }}
        >
          {answer || test.idle}
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className={`break-all leading-[0.9] transition-colors duration-500 hover:text-[#f5c400] ${state === "pass" ? "text-[#f5c400]" : ""}`}
          style={{ ...STAMP, fontWeight: 800, fontSize: "clamp(20px, calc((min(100vw, 1400px) - 48px) / 13.5), 132px)" }}
        >
          {EMAIL}
        </a>
        <div className="flex flex-wrap gap-3 items-center">
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="t-label rounded-full border border-white/30 px-4 py-2 hover:bg-white hover:text-black">
              {label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
