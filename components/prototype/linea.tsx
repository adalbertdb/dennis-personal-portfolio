"use client";
// PROTOTYPE B — «Línea». La página es un plano técnico. El scroll vertical mueve una línea de montaje en
// horizontal: el código entra como glifos sueltos, la prensa lo compila en un bloque, un brazo robot monta
// los módulos, un láser lo inspecciona y la etiquetadora le pone el ᗡB antes de salir hacia «Trabajo».

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/use-language";
import type { PinnedRepo } from "@/lib/github";
import { EMAIL, LINKS, clamp, enterProgress, lerp, pad, pinProgress, projectList, rafLoop, smooth, stack } from "./shared";

const INK = "#111111";
const BODY = "#f7f7f4";
const MID = "#bdbbb4";
const Y = "#f5c400";
const WORLD = 5600;
const H = 560;
const BELT = 420; // cara superior de la cinta
const PW = 150; // producto
const PH = 96;
const ST = [900, 1900, 2900, 3900, 4900];
const NAMES = {
  es: ["Alimentación", "Prensa", "Montaje", "Inspección", "Expedición"],
  en: ["Feed", "Press", "Assembly", "Inspection", "Dispatch"],
};
const GLYPHS = ["{", "}", "<", "/>", ";", "=", "()", "[]", "=>", "&&", "fn", "::"];
// Brazo colgado de un pórtico: todos los objetivos quedan por debajo del hombro y el codo nunca se voltea.
const SHOULDER = { x: ST[2], y: 112 };
const FEED = { x: ST[2] + 195, y: 224 }; // mano sobre la bandeja de módulos
const L1 = 170;
const L2 = 160;

export function Linea({ repos }: { repos: PinnedRepo[] }) {
  const { lang, t, toggleLang } = useLanguage();
  const list = projectList(repos, t);
  const bom = stack(t.skills.tools);
  const names = NAMES[lang];

  const r = useRef<Record<string, Element | null>>({}).current;
  const set = (k: string) => (el: Element | null) => void (r[k] = el);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const streamRefs = useRef<(SVGTextElement | null)[]>([]);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const bomRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const pin = r.pin as HTMLElement;
    const attr = (k: string, a: string, v: string | number) => r[k]?.setAttribute(a, String(v));
    let p = 0;
    let lastU = 0;
    let lastT = 0;
    let speed = 0;
    const arm = { x: ST[2] + 120, y: 190 };

    return rafLoop((now) => {
      const time = now / 1000;
      (r.rulerTicks as HTMLElement).style.backgroundPositionY = `${-scrollY}px`;
      (r.rulerY as HTMLElement).textContent = String(Math.round(scrollY)).padStart(5, "0");

      // Expedición y lista de materiales: entran con el scroll.
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const q = smooth(0, 0.55, enterProgress(row));
        row.style.transform = `translateX(${(1 - q) * (i % 2 ? -45 : 45)}vw)`;
      });
      const table = r.bom as HTMLElement;
      const scan = smooth(0.25, 0.85, enterProgress(table));
      (r.bomScan as HTMLElement).style.top = `${scan * 100}%`;
      bomRefs.current.forEach((row, i) => {
        if (row) row.style.opacity = scan * bom.length > i + 0.5 ? "1" : "0.25";
      });

      const rect = pin.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      p = lerp(p, pinProgress(pin), 0.2);
      const vw = innerWidth;
      const vh = innerHeight;
      const s = Math.min(1, (vh - 180) / H, vw < 640 ? 0.72 : 1);
      const u = lerp(260, WORLD - 260, p);
      const top = (vh - H * s) / 2 + 40;
      (r.world as HTMLElement).style.transform = `translate(${vw * 0.42 - u * s}px, ${top}px) scale(${s})`;

      const dt = Math.max(time - lastT, 1 / 120);
      speed = lerp(speed, Math.abs(u - lastU) / dt / 1000, 0.1);
      lastU = u;
      lastT = time;
      (r.speed as HTMLElement).textContent = speed.toFixed(2);
      (r.pos as HTMLElement).textContent = String(Math.round(u)).padStart(4, "0");

      const local = ST.map((x) => (u - x) / 260);
      const current = local.reduce((best, l, i) => (Math.abs(l) < Math.abs(local[best]) ? i : best), 0);
      (r.station as HTMLElement).textContent = names[current];
      (r.stationNo as HTMLElement).textContent = `E-${pad(current + 1)}`;
      for (let i = 0; i < 5; i++) {
        (r[`map${i}`] as HTMLElement).style.background = i === current ? Y : i < current ? INK : "transparent";
      }

      // Cinta: las marcas viajan con el producto.
      attr("beltPattern", "patternTransform", `translate(${u % 40} 0)`);
      attr("product", "transform", `translate(${u - PW / 2} ${BELT - PH})`);

      // E-01 · tolva: glifos cayendo cuando el producto pasa por debajo.
      const pour = 1 - smooth(50, 95, Math.abs(u - ST[0]));
      attr("stream", "opacity", pour);
      streamRefs.current.forEach((g, i) => {
        if (!g) return;
        const fall = (time * 140 + i * 37) % 110;
        g.setAttribute("y", String(228 + fall));
      });
      const compiled = u > ST[1];
      const fill = smooth(ST[0] - 80, ST[0] + 80, u);
      glyphRefs.current.forEach((g, i) => g?.setAttribute("opacity", !compiled && i < fill * GLYPHS.length ? "1" : "0"));
      attr("tray", "opacity", compiled ? 0 : 1);

      // E-02 · prensa
      const press = smooth(-0.55, -0.12, local[1]) * (1 - smooth(0.12, 0.5, local[1]));
      attr("ram", "transform", `translate(0 ${press * 108})`);
      attr("flash", "opacity", press > 0.96 ? 1 : 0);
      attr("block", "opacity", compiled ? 1 : 0);

      // E-03 · brazo: tres ciclos de coger y colocar siguiendo al producto en marcha.
      const q = clamp((local[2] + 0.55) / 1.1);
      const cycles = q * 3;
      const k = Math.min(2, Math.floor(cycles));
      const phi = q >= 1 ? 1 : cycles - k;
      const active = local[2] > -0.55 && local[2] < 0.55;
      const placed = local[2] <= -0.55 ? 0 : local[2] >= 0.55 ? 3 : k + (phi >= 0.4 ? 1 : 0);
      const place = { x: u - PW / 2 + 18 + k * 42 + 15, y: BELT - PH - 26 };
      const want = active ? pickPlace(phi, place) : { x: ST[2] + 120, y: 190 };
      arm.x = lerp(arm.x, want.x, 0.35);
      arm.y = lerp(arm.y, want.y, 0.35);
      const elbow = ik(SHOULDER, arm);
      for (const part of ["a", "b"]) {
        attr(`l1${part}`, "x2", elbow.x);
        attr(`l1${part}`, "y2", elbow.y);
        attr(`l2${part}`, "x1", elbow.x);
        attr(`l2${part}`, "y1", elbow.y);
        attr(`l2${part}`, "x2", arm.x);
        attr(`l2${part}`, "y2", arm.y);
      }
      attr("elbow", "cx", elbow.x);
      attr("elbow", "cy", elbow.y);
      attr("hand", "transform", `translate(${arm.x} ${arm.y})`);
      attr("carry", "opacity", active && (phi < 0.4 || phi >= 0.9) ? 1 : 0);
      for (let i = 0; i < 3; i++) attr(`chip${i}`, "opacity", i < placed ? 1 : 0);

      // E-04 · inspección: el haz recorre el bloque y los cinco pilotos se encienden.
      const inspected = clamp((u - (ST[3] - PW / 2)) / PW);
      attr("scanBar", "width", PW * inspected);
      attr("beam", "opacity", Math.abs(local[3]) < 0.6 ? 0.55 + 0.45 * Math.sin(time * 30) : 0.15);
      const leds = Math.floor(clamp((local[3] + 0.6) / 1.2) * 5.999);
      for (let i = 0; i < 5; i++) attr(`led${i}`, "fill", i < leds ? INK : "none");
      attr("ok", "opacity", leds >= 5 ? 1 : 0);

      // E-05 · etiquetadora
      const stamp = smooth(-0.5, -0.1, local[4]) * (1 - smooth(0.1, 0.45, local[4]));
      attr("labeler", "transform", `translate(0 ${stamp * 112})`);
      attr("labelerTag", "opacity", u > ST[4] && Math.abs(local[4]) < 0.45 ? 0 : 1);
      attr("tag", "opacity", u > ST[4] ? 1 : 0);
    });
  }, [names, bom.length]);

  return (
    <div className="bg-[#ecebe6] text-[#111] overflow-x-clip" style={{ fontVariationSettings: '"wdth" 100' }}>
      <style>{`
        @keyframes lineaSweep { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
        @keyframes lineaLaser { from { left: 0 } to { left: 100% } }
        @keyframes lineaBlink { 50% { opacity: 0 } }
        @keyframes lineaOut { to { opacity: 0 } }
      `}</style>

      {/* Regla fija: el scroll se mide en píxeles, como en un plano. */}
      <div className="fixed left-0 top-0 bottom-0 w-7 z-40 border-r border-[#111]/20 bg-[#ecebe6] hidden md:block">
        <div
          ref={set("rulerTicks")}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, #111 0 1px, transparent 1px 10px), repeating-linear-gradient(180deg, #111 0 1px, transparent 1px 100px)",
            backgroundSize: "8px 100%, 16px 100%",
            backgroundRepeat: "repeat-y",
            opacity: 0.45,
          }}
        />
        <span
          ref={set("rulerY")}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 t-label text-[10px] [writing-mode:vertical-rl] rotate-180 bg-[#ecebe6] py-1"
        >
          00000
        </span>
      </div>

      <header className="md:pl-7 border-b border-[#111]">
        <nav className="mx-auto max-w-[1400px] px-5 md:px-10 h-14 flex items-center justify-between">
          <a href="#top" className="font-semibold text-xl tracking-[-0.05em]">
            dennis adalbert<span className="text-[#f5c400] [text-shadow:0_0_0_#111]">.</span>
          </a>
          <div className="flex items-center gap-6 t-label">
            {t.navbar.links.map((l, i) => (
              <a key={l} href={["#work", "#stack", "#contact"][i]} className="hidden sm:block text-[#111]/60 hover:text-[#111]">
                {l}
              </a>
            ))}
            <button onClick={toggleLang} className="cursor-pointer border border-[#111] px-2 py-1 hover:bg-[#111] hover:text-[#ecebe6]">
              {lang === "en" ? "ES" : "EN"}
            </button>
          </div>
        </nav>
      </header>

      <section id="top" className="relative md:pl-7 border-b border-[#111]">
        {/* Retícula a la vista */}
        <div className="absolute inset-0 md:left-7 pointer-events-none">
          <div className="mx-auto max-w-[1400px] h-full px-5 md:px-10 grid grid-cols-6 md:grid-cols-12 gap-5">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={`border-x border-[#111]/[0.07] ${i >= 6 ? "hidden md:block" : ""}`} />
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 pt-14 pb-16">
          <div className="flex justify-between t-label text-[#111]/50 mb-6">
            <span>{t.hero.role}</span>
            <span>1 : 1</span>
          </div>
          <h1 className="relative font-extrabold uppercase leading-[0.84] tracking-[-0.03em]" style={{ fontSize: "clamp(48px, 13.4vw, 212px)", fontVariationSettings: '"wdth" 120' }}>
            <span className="block" style={{ animation: "lineaSweep 1.6s cubic-bezier(.7,0,.2,1) .2s both" }}>
              Dennis
              <br />
              Adalbert
            </span>
            <span className="absolute top-0 bottom-0 w-[3px] bg-[#f5c400] shadow-[0_0_24px_#f5c400]" style={{ animation: "lineaLaser 1.6s cubic-bezier(.7,0,.2,1) .2s both, lineaOut .5s 1.8s both" }} />
          </h1>

          <div className="mt-14 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-5 flex flex-col gap-6">
              <p className="text-lg leading-7 text-[#111]/75 max-w-[44ch]">{t.hero.line}</p>
              <div className="flex gap-3">
                <a href="#line" className="t-label bg-[#111] text-[#ecebe6] px-5 py-4 hover:bg-[#f5c400] hover:text-[#111]">
                  {t.hero.btnWork} ↓
                </a>
                <a href="#contact" className="t-label border border-[#111] px-5 py-4 hover:bg-[#111] hover:text-[#ecebe6]">
                  {t.hero.btnContact}
                </a>
              </div>
            </div>
            {/* Cajetín del plano */}
            <dl className="md:col-start-8 md:col-span-5 border-2 border-[#111] t-label grid grid-cols-[auto_1fr] bg-[#ecebe6]">
              {t.hero.spec.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="px-3 py-2 border-b border-r border-[#111] text-[#111]/50">{k}</dt>
                  <dd className="px-3 py-2 border-b border-[#111] normal-case tracking-normal t-data">{v}</dd>
                </div>
              ))}
              <dt className="px-3 py-2 border-r border-[#111] text-[#111]/50">{t.hero.status}</dt>
              <dd className="px-3 py-2 bg-[#f5c400] flex items-center gap-2">
                <span className="size-2 bg-[#111]" style={{ animation: "lineaBlink 1.2s steps(1) infinite" }} /> {t.hero.available}
              </dd>
            </dl>
          </div>
        </div>
      </section>

      {/* La línea: 700vh de scroll fijados, recorrido horizontal */}
      <section id="line" ref={set("pin")} className="relative bg-[#ecebe6] border-b border-[#111]" style={{ height: "700vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden md:pl-7">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: "radial-gradient(#111 0.8px, transparent 0.8px)", backgroundSize: "24px 24px", maskImage: "linear-gradient(transparent, #000 20%, #000 80%, transparent)", opacity: 0.18 }}
          />
          <div ref={set("world")} className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ width: WORLD, height: H }}>
            <svg width={WORLD} height={H} viewBox={`0 0 ${WORLD} ${H}`} fill="none" style={{ overflow: "visible" }}>
              <defs>
                <pattern id="lineaBelt" ref={set("beltPattern")} width="40" height="14" patternUnits="userSpaceOnUse">
                  <rect width="40" height="14" fill={INK} />
                  <path d="M8 2 L16 7 L8 12" stroke="#3a3a3a" strokeWidth="2" />
                </pattern>
                <pattern id="lineaHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line y2="10" stroke={INK} strokeWidth="1" opacity=".25" />
                </pattern>
              </defs>

              {/* Suelo, patas y cinta */}
              <line x1="0" x2={WORLD + 1600} y1="540" y2="540" stroke={INK} strokeWidth="1.5" />
              {Array.from({ length: Math.floor((WORLD + 1600) / 50) }, (_, i) => (
                <line key={i} x1={i * 50} x2={i * 50 - 10} y1="540" y2="552" stroke={INK} opacity=".35" />
              ))}
              {Array.from({ length: Math.floor((WORLD + 1600) / 320) }, (_, i) => (
                <rect key={i} x={140 + i * 320} y={BELT + 22} width="10" height={540 - BELT - 22} fill={BODY} stroke={INK} strokeWidth="1.5" />
              ))}
              <rect x="0" y={BELT} width={WORLD + 1600} height="14" fill="url(#lineaBelt)" />
              <line x1="0" x2={WORLD + 1600} y1={BELT + 22} y2={BELT + 22} stroke={INK} strokeWidth="1.5" />
              {Array.from({ length: Math.floor((WORLD + 1600) / 40) }, (_, i) => (
                <circle key={i} cx={20 + i * 40} cy={BELT + 18} r="3" fill={BODY} stroke={INK} />
              ))}

              {/* Rótulos de estación y cotas */}
              {ST.map((x, i) => (
                <g key={x} fontFamily="var(--font-plex-mono)" fill={INK}>
                  <text x={x - 130} y="18" fontSize="13" fontWeight="500" letterSpacing="2">
                    E-{pad(i + 1)}
                  </text>
                  <text x={x - 130} y="36" fontSize="11" letterSpacing="2" opacity=".55">
                    {names[i].toUpperCase()}
                  </text>
                  <line x1={x - 130} x2={x + 130} y1="48" y2="48" stroke={INK} opacity=".25" />
                  <line x1={x} x2={x} y1="44" y2="52" stroke={INK} opacity=".5" />
                </g>
              ))}

              {/* E-01 · tolva */}
              <g>
                <line x1={ST[0] - 120} x2={ST[0] - 120} y1="90" y2="540" stroke={INK} strokeWidth="1.5" />
                <line x1={ST[0] + 120} x2={ST[0] + 120} y1="90" y2="540" stroke={INK} strokeWidth="1.5" />
                <line x1={ST[0] - 128} x2={ST[0] + 128} y1="90" y2="90" stroke={INK} strokeWidth="3" />
                <path d={`M${ST[0] - 95} 70 H${ST[0] + 95} L${ST[0] + 26} 196 H${ST[0] - 26} Z`} fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[0] - 15} y="196" width="30" height="30" fill={BODY} stroke={INK} strokeWidth="1.5" />
                {GLYPHS.slice(0, 9).map((g, i) => (
                  <text key={i} x={ST[0] - 60 + (i % 5) * 26} y={100 + Math.floor(i / 5) * 26} fontSize="15" fontFamily="var(--font-plex-mono)" fill={INK} opacity=".45">
                    {g}
                  </text>
                ))}
                <g ref={set("stream")} opacity="0">
                  {GLYPHS.map((g, i) => (
                    <text
                      key={i}
                      ref={(el) => void (streamRefs.current[i] = el)}
                      x={ST[0] - 10 + ((i * 7) % 20)}
                      y="230"
                      fontSize="13"
                      fontFamily="var(--font-plex-mono)"
                      fill={INK}
                    >
                      {g}
                    </text>
                  ))}
                </g>
              </g>

              {/* E-02 · prensa */}
              <g>
                <rect x={ST[1] - 120} y="70" width="20" height={BELT - 70 + 120} fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[1] + 100} y="70" width="20" height={BELT - 70 + 120} fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[1] - 130} y="62" width="260" height="34" fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[1] - 26} y="96" width="52" height="64" fill={MID} stroke={INK} strokeWidth="1.5" />
                <g ref={set("ram")}>
                  <rect x={ST[1] - 8} y="160" width="16" height="20" fill={BODY} stroke={INK} strokeWidth="1.5" />
                  <rect x={ST[1] - 86} y="180" width="172" height="28" fill={BODY} stroke={INK} strokeWidth="1.5" />
                  <rect x={ST[1] - 86} y="208" width="172" height="8" fill="url(#lineaHatch)" stroke={INK} />
                  <rect ref={set("flash")} x={ST[1] - 92} y="214" width="184" height="3" fill={Y} opacity="0" />
                </g>
              </g>

              {/* E-03 · brazo robot (IK de dos eslabones) */}
              <g>
                <rect x={ST[2] - 170} y="70" width="18" height="470" fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[2] + 262} y="70" width="18" height="470" fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[2] - 180} y="64" width="470" height="30" fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={SHOULDER.x - 26} y="94" width="52" height="16" fill={MID} stroke={INK} strokeWidth="1.5" />
                <rect x={FEED.x - 55} y={FEED.y + 26} width="117" height="10" fill={BODY} stroke={INK} strokeWidth="1.5" />
                {[-1, 0, 1].map((i) => (
                  <rect key={i} x={FEED.x - 15 + i * 34} y={FEED.y + 14} width="30" height="12" fill={BODY} stroke={INK} />
                ))}
                <line ref={set("l1a")} x1={SHOULDER.x} y1={SHOULDER.y} stroke={INK} strokeWidth="26" strokeLinecap="round" />
                <line ref={set("l1b")} x1={SHOULDER.x} y1={SHOULDER.y} stroke={BODY} strokeWidth="22" strokeLinecap="round" />
                <line ref={set("l2a")} stroke={INK} strokeWidth="20" strokeLinecap="round" />
                <line ref={set("l2b")} stroke={BODY} strokeWidth="16" strokeLinecap="round" />
                <circle cx={SHOULDER.x} cy={SHOULDER.y} r="17" fill={MID} stroke={INK} strokeWidth="1.5" />
                <circle cx={SHOULDER.x} cy={SHOULDER.y} r="4" fill={Y} />
                <circle ref={set("elbow")} r="13" fill={MID} stroke={INK} strokeWidth="1.5" />
                <g ref={set("hand")}>
                  <circle r="8" fill={BODY} stroke={INK} strokeWidth="1.5" />
                  <path d="M-10 6 V18 M10 6 V18" stroke={INK} strokeWidth="3" />
                  <rect ref={set("carry")} x="-15" y="14" width="30" height="12" fill={BODY} stroke={INK} opacity="0" />
                </g>
              </g>

              {/* E-04 · arco de inspección */}
              <g>
                <rect x={ST[3] - 110} y="150" width="18" height={BELT - 150 + 120} fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[3] + 92} y="150" width="18" height={BELT - 150 + 120} fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[3] - 120} y="124" width="240" height="32" fill={BODY} stroke={INK} strokeWidth="1.5" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle key={i} ref={set(`led${i}`)} cx={ST[3] - 60 + i * 30} cy="140" r="6" stroke={INK} strokeWidth="1.5" />
                ))}
                <rect x={ST[3] - 16} y="156" width="32" height="14" fill={MID} stroke={INK} strokeWidth="1.5" />
                <g ref={set("beam")} opacity=".15">
                  <path d={`M${ST[3] - 3} 170 L${ST[3] - 40} ${BELT} H${ST[3] + 40} L${ST[3] + 3} 170 Z`} fill={Y} opacity=".25" />
                  <line x1={ST[3]} x2={ST[3]} y1="170" y2={BELT} stroke={Y} strokeWidth="2" />
                </g>
                <g ref={set("ok")} opacity="0">
                  <rect x={ST[3] + 128} y="124" width="52" height="32" fill={Y} stroke={INK} strokeWidth="1.5" />
                  <text x={ST[3] + 154} y="145" textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="var(--font-plex-mono)" fill={INK}>
                    OK
                  </text>
                </g>
              </g>

              {/* E-05 · etiquetadora y muelle */}
              <g>
                <rect x={ST[4] - 140} y="70" width="20" height={BELT - 70 + 120} fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[4] - 140} y="62" width="200" height="30" fill={BODY} stroke={INK} strokeWidth="1.5" />
                <rect x={ST[4] - 18} y="92" width="36" height="60" fill={MID} stroke={INK} strokeWidth="1.5" />
                <g ref={set("labeler")}>
                  <rect x={ST[4] - 6} y="152" width="12" height="38" fill={BODY} stroke={INK} strokeWidth="1.5" />
                  <rect x={ST[4] - 44} y="190" width="88" height="14" fill={BODY} stroke={INK} strokeWidth="1.5" />
                  <rect ref={set("labelerTag")} x={ST[4] - 35} y="204" width="70" height="8" fill={Y} stroke={INK} />
                </g>
                <rect x={ST[4] + 300} y="120" width="170" height={BELT - 120} fill="url(#lineaHatch)" stroke={INK} strokeWidth="1.5" />
                <rect x={ST[4] + 290} y="108" width="190" height="16" fill={BODY} stroke={INK} strokeWidth="1.5" />
                <text x={ST[4] + 385} y="290" textAnchor="middle" fontSize="40" fontFamily="var(--font-plex-mono)" fill={INK} opacity=".5">
                  →
                </text>
              </g>

              {/* El producto */}
              <g ref={set("product")}>
                <rect ref={set("tray")} width={PW} height={PH} stroke={INK} strokeWidth="1.5" strokeDasharray="5 5" fill={BODY} />
                {GLYPHS.map((g, i) => (
                  <text
                    key={i}
                    ref={(el) => void (glyphRefs.current[i] = el)}
                    x={14 + (i % 4) * 34}
                    y={PH - 12 - Math.floor(i / 4) * 26}
                    fontSize="17"
                    fontFamily="var(--font-plex-mono)"
                    fill={INK}
                    opacity="0"
                  >
                    {g}
                  </text>
                ))}
                <g ref={set("block")} opacity="0">
                  <rect width={PW} height={PH} fill={INK} />
                  <line x1="10" x2={PW - 10} y1="22" y2="22" stroke="#3a3a3a" />
                  <line x1="10" x2={PW - 10} y1="74" y2="74" stroke="#3a3a3a" />
                  <rect ref={set("scanBar")} x="0" y={PH - 5} width="0" height="5" fill={Y} />
                </g>
                {[0, 1, 2].map((i) => (
                  <g key={i} ref={set(`chip${i}`)} opacity="0">
                    <rect x={18 + i * 42} y="-12" width="30" height="12" fill={BODY} stroke={INK} />
                    <path d={`M${22 + i * 42} -12 v-3 M${28 + i * 42} -12 v-3 M${34 + i * 42} -12 v-3 M${40 + i * 42} -12 v-3`} stroke={INK} />
                  </g>
                ))}
                <g ref={set("tag")} opacity="0">
                  <rect x="38" y="30" width="74" height="36" fill={Y} />
                  <g fontSize="20" fontWeight="800" fill={INK} fontFamily="var(--font-archivo)">
                    <text transform="translate(74 56) scale(-1 1)">D</text>
                    <text x="76" y="56">B</text>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          {/* HUD */}
          <div className="absolute inset-x-0 top-0 md:left-7 px-5 md:px-10 pt-8 flex justify-between items-start gap-6 pointer-events-none">
            <div>
              <div className="t-label text-[#111]/55 flex items-center gap-2">
                <span className="size-2 bg-[#f5c400] outline outline-1 outline-[#111]" style={{ animation: "lineaBlink 1s steps(1) infinite" }} />
                <span ref={set("stationNo")}>E-01</span>
              </div>
              <div ref={set("station")} className="font-extrabold uppercase leading-none mt-2" style={{ fontSize: "clamp(32px, 6vw, 84px)", fontVariationSettings: '"wdth" 118' }}>
                —
              </div>
            </div>
            <div className="flex gap-1 pt-1">
              {ST.map((_, i) => (
                <span key={i} ref={set(`map${i}`)} className="w-6 md:w-10 h-2 border border-[#111]" />
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 md:left-7 px-5 md:px-10 pb-8 flex justify-between t-label text-[#111]/55 pointer-events-none">
            <span>
              x = <span ref={set("pos")}>0000</span> mm
            </span>
            <span>
              v = <span ref={set("speed")}>0.00</span> m/s
            </span>
          </div>
        </div>
      </section>

      {/* Expedición: cada proyecto sale de la línea como una unidad terminada */}
      <section id="work" className="md:pl-7 border-b border-[#111]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-24">
          <div className="flex items-end justify-between border-b-2 border-[#111] pb-4">
            <h2 className="font-extrabold uppercase leading-none" style={{ fontSize: "clamp(40px, 7vw, 96px)", fontVariationSettings: '"wdth" 118' }}>
              {t.projects.title}
            </h2>
            <span className="t-label text-[#111]/55">{pad(list.length)} uds.</span>
          </div>
          {list.map((p, i) => (
            <a
              key={p.name}
              ref={(el) => void (rowRefs.current[i] = el)}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[72px_1fr] md:grid-cols-[120px_1.2fr_1fr_auto] gap-x-6 gap-y-2 items-center py-6 border-b border-[#111]/25 hover:bg-[#111] hover:text-[#ecebe6] transition-colors will-change-transform"
            >
              <svg viewBox="-4 -18 158 118" className="w-[72px] md:w-[110px] row-span-2 md:row-span-1">
                <rect width={PW} height={PH} fill="currentColor" />
                {[0, 1, 2].map((k) => (
                  <rect key={k} x={18 + k * 42} y="-12" width="30" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
                ))}
                <rect x="38" y="30" width="74" height="36" fill={p.featured ? Y : "#8a8a85"} />
              </svg>
              <div>
                <span className="t-label opacity-55">
                  {pad(i + 1)} · {p.lang}
                </span>
                <h3 className="font-bold leading-tight break-words" style={{ fontSize: "clamp(24px, 3.4vw, 44px)", fontVariationSettings: '"wdth" 108' }}>
                  {p.name}
                </h3>
              </div>
              <p className="text-base leading-6 opacity-70 max-w-[46ch]">{p.desc}</p>
              <span className="t-label opacity-70 md:text-right col-start-2 md:col-start-auto">{p.meta} ↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* Lista de materiales con línea de inspección */}
      <section id="stack" className="md:pl-7 border-b border-[#111]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-24">
          <h2 className="font-extrabold uppercase leading-none mb-10" style={{ fontSize: "clamp(40px, 7vw, 96px)", fontVariationSettings: '"wdth" 118' }}>
            {t.skills.title}
          </h2>
          <div ref={set("bom")} className="relative border-2 border-[#111]">
            <div ref={set("bomScan")} className="absolute inset-x-0 h-[2px] bg-[#f5c400] shadow-[0_0_16px_#f5c400] z-10" />
            <div className="grid grid-cols-[48px_1fr_56px] md:grid-cols-[72px_200px_1fr_80px] t-label bg-[#111] text-[#ecebe6]">
              <span className="px-3 py-2">Pos</span>
              <span className="px-3 py-2 hidden md:block">Pieza</span>
              <span className="px-3 py-2">Material</span>
              <span className="px-3 py-2 text-right">Cant</span>
            </div>
            {bom.map(([k, v], i) => (
              <div
                key={k}
                ref={(el) => void (bomRefs.current[i] = el)}
                className="grid grid-cols-[48px_1fr_56px] md:grid-cols-[72px_200px_1fr_80px] items-baseline border-t border-[#111] transition-opacity duration-300"
              >
                <span className="px-3 py-4 t-data">{pad(i + 1)}</span>
                <span className="px-3 py-4 t-label hidden md:block">{k}</span>
                <span className="px-3 py-4 font-semibold text-lg md:text-xl leading-snug">
                  <span className="t-label block md:hidden opacity-55 mb-1">{k}</span>
                  {v}
                </span>
                <span className="px-3 py-4 t-data text-right">{pad(v.split("·").length)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto: una tecla de verdad */}
      <section id="contact" className="md:pl-7 bg-[#111] text-[#ecebe6]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-28 grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 items-center">
          <a
            href={`mailto:${EMAIL}`}
            aria-label={`Email ${EMAIL}`}
            className="group relative size-48 md:size-60 rounded-[28px] bg-[#f5c400] text-[#111] p-5 flex flex-col justify-between shadow-[0_10px_0_#8a6f00,0_24px_40px_rgba(0,0,0,.5)] active:translate-y-[8px] active:shadow-[0_2px_0_#8a6f00,0_8px_16px_rgba(0,0,0,.5)] transition-[transform,box-shadow] duration-75"
          >
            <span className="t-label">↗ mail</span>
            <span className="font-extrabold uppercase text-3xl md:text-4xl leading-none" style={{ fontVariationSettings: '"wdth" 118' }}>
              {t.hero.btnContact}
            </span>
          </a>
          <div className="flex flex-col gap-6">
            <h2 className="font-extrabold uppercase leading-[0.85]" style={{ fontSize: "clamp(56px, 10vw, 150px)", fontVariationSettings: '"wdth" 120' }}>
              {t.contact.title}
            </h2>
            <a href={`mailto:${EMAIL}`} className="font-semibold text-[clamp(20px,3vw,36px)] hover:text-[#f5c400] break-all">
              {EMAIL}
            </a>
            <div className="flex flex-wrap gap-3 items-center">
              {LINKS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="t-label border border-[#ecebe6] px-3 py-2 hover:bg-[#f5c400] hover:text-[#111] hover:border-[#f5c400]">
                  {label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#ecebe6]/20 t-data text-[#ecebe6]/50">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-5 flex justify-between">
            <span>© {new Date().getFullYear()} adalbertdb</span>
            <span>hoja 05 / 05</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Trayectoria de un ciclo coger→colocar, φ ∈ [0, 1). */
function pickPlace(phi: number, place: { x: number; y: number }) {
  const up = 70;
  const seg = (a: number, b: number) => smooth(a, b, phi);
  if (phi < 0.3) return { x: lerp(FEED.x, place.x, seg(0, 0.3)), y: lerp(FEED.y - up, place.y - up, seg(0, 0.3)) - Math.sin(seg(0, 0.3) * Math.PI) * 30 };
  if (phi < 0.4) return { x: place.x, y: lerp(place.y - up, place.y, seg(0.3, 0.4)) };
  if (phi < 0.5) return { x: place.x, y: lerp(place.y, place.y - up, seg(0.4, 0.5)) };
  if (phi < 0.8) return { x: lerp(place.x, FEED.x, seg(0.5, 0.8)), y: lerp(place.y - up, FEED.y - up, seg(0.5, 0.8)) - Math.sin(seg(0.5, 0.8) * Math.PI) * 30 };
  if (phi < 0.9) return { x: FEED.x, y: lerp(FEED.y - up, FEED.y, seg(0.8, 0.9)) };
  return { x: FEED.x, y: lerp(FEED.y, FEED.y - up, seg(0.9, 1)) };
}

/** Cinemática inversa analítica de dos eslabones; el codo siempre del mismo lado. */
function ik(s: { x: number; y: number }, t: { x: number; y: number }) {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const d = clamp(Math.hypot(dx, dy), Math.abs(L1 - L2) + 1, L1 + L2 - 1);
  const a = Math.atan2(dy, dx);
  const b = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const th = a + b;
  return { x: s.x + L1 * Math.cos(th), y: s.y + L1 * Math.sin(th) };
}
