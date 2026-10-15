"use client";
// PROTOTYPE A — «Despiece». El stack es hardware: un módulo de aluminio fresado que se despieza al hacer scroll
// (cristal = frontend, pantalla = móvil, placa = backend, disipador = infra, chasis = herramientas) y se vuelve
// a montar encendiendo el monograma. Trabajo como tarjetas que se apilan; contacto que crece con el scroll.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useLanguage } from "@/lib/use-language";
import type { PinnedRepo } from "@/lib/github";
import { EMAIL, LINKS, clamp, enterProgress, lerp, pad, pinProgress, projectList, rafLoop, smooth, stack } from "./shared";

const W = 3.2;
const D = 2.1;
// Desplazamiento vertical de cada capa con el despiece completo (cristal, pantalla, placa, disipador, chasis).
const LIFT = [2.55, 1.9, 1.22, 0.56, -0.3];

export function Despiece({ repos }: { repos: PinnedRepo[] }) {
  const { lang, t, toggleLang } = useLanguage();
  const layers = stack(t.skills.tools);
  const list = projectList(repos, t);

  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contactRef = useRef<HTMLElement>(null);
  const shoutRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const pin = pinRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(5, 9, 6);
    const rim = new THREE.DirectionalLight(0xbfd4ff, 1.2);
    rim.position.set(-7, 3, -5);
    scene.add(key, rim);

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    const device = buildDevice();
    scene.add(device.group);
    const base = device.parts.map((p) => p.position.y);
    const anchor = new THREE.Vector3();
    const target = new THREE.Vector3();

    let p = 0;
    let px = 0;
    let py = 0;
    let mx = 0;
    let my = 0;
    let w = 0;
    let h = 0;
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onPointer);
    const t0 = performance.now();

    const stopDevice = rafLoop((now) => {
      const rect = pin.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      if (canvas.clientWidth !== w || canvas.clientHeight !== h) {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      const time = (now - t0) / 1000;
      p = lerp(p, pinProgress(pin), 0.14);
      px = lerp(px, mx, 0.05);
      py = lerp(py, my, 0.05);
      const narrow = w < 768;

      const intro = smooth(0, 0.12, p);
      const regroup = smooth(0.8, 0.95, p);
      const boot = smooth(0, 1.6, time); // entrada al cargar

      // En vertical hay alto de sobra y poco ancho: se separan más las capas para que las cotas no se pisen.
      const tall = narrow ? 1.9 : 1;
      device.parts.forEach((part, i) => {
        const e = smooth(0.1 + i * 0.035, 0.44 + i * 0.035, p) * (1 - regroup);
        part.position.y = base[i] + LIFT[i] * e * tall;
      });
      const spread = smooth(0.1, 0.48, p) * (1 - regroup);

      const g = device.group;
      g.scale.setScalar(lerp(0.82, 1, boot));
      // En el héroe va a la derecha del estampado; en el despiece, a la izquierda de las cotas; al final, centrado.
      g.position.x = lerp(lerp(narrow ? 0 : 1.35, narrow ? -0.75 : -1.1, smooth(0.04, 0.3, p)), 0, regroup);
      const idle = -0.55 + Math.sin(time * 0.35) * 0.35 + (1 - boot) * 1.2;
      g.rotation.y = lerp(lerp(idle, -0.62, smooth(0.04, 0.3, p)), 0, regroup) + px * 0.12;
      g.rotation.x = py * 0.05;
      // Pantalla apagada hasta que el módulo vuelve a estar montado.
      const on = smooth(0.88, 1, p);
      device.screen.color.setScalar(lerp(0.12, 1, on));
      device.screen.emissiveIntensity = 1.9 * on;

      // Cámara en un arco: alta al principio, rasante en el despiece, cenital al volver a montar.
      const elev = lerp(lerp(0.58, 0.3, smooth(0.08, 0.4, p)), 1.2, regroup);
      const dist = (narrow ? 15.5 / Math.max(camera.aspect, 0.5) : 12.5) * lerp(1, 0.86, regroup);
      target.set(0, 0.1 + 1.0 * spread * tall + (1 - intro) * (narrow ? 1.6 : 0.6), 0);
      camera.position.set(0, target.y + Math.sin(elev) * dist, Math.cos(elev) * dist);
      camera.lookAt(target);

      renderer.render(scene, camera);

      // Cotas: punto en la esquina de cada capa, línea fina hasta la etiqueta.
      const labelX = narrow ? w * 0.58 : w * 0.63;
      device.parts.forEach((part, i) => {
        const on = smooth(0.3 + i * 0.035, 0.42 + i * 0.035, p) * (1 - smooth(0.76, 0.82, p));
        anchor.set(W / 2, i === 4 ? 0.2 : 0, 0).applyMatrix4(part.matrixWorld).project(camera);
        const sx = ((anchor.x + 1) / 2) * w;
        const sy = ((1 - anchor.y) / 2) * h;
        const reach = sx + (labelX - 14 - sx) * on;
        pathRefs.current[i]?.setAttribute("d", `M${sx},${sy} H${reach}`);
        pathRefs.current[i]?.setAttribute("opacity", String(on));
        dotRefs.current[i]?.setAttribute("cx", String(sx));
        dotRefs.current[i]?.setAttribute("cy", String(sy));
        dotRefs.current[i]?.setAttribute("opacity", String(on));
        const c = calloutRefs.current[i];
        if (c) {
          c.style.transform = `translate(${labelX}px, ${sy}px) translateY(-50%)`;
          c.style.opacity = String(on);
          c.style.maxWidth = `${w - labelX - 16}px`;
        }
      });

      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - intro);
        heroRef.current.style.transform = `translateY(${-intro * 80}px)`;
      }
      if (endRef.current) endRef.current.style.opacity = String(smooth(0.92, 1, p));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (phaseRef.current) phaseRef.current.textContent = p < 0.1 ? "01" : p < 0.8 ? "02" : "03";
    });

    // Tarjetas apiladas: la de debajo se encoge y oscurece cuando la siguiente la tapa.
    const stopCards = rafLoop(() => {
      const wraps = wrapRefs.current;
      cardRefs.current.forEach((card, i) => {
        const next = wraps[i + 1];
        if (!card || !next) return;
        const top = 72 + i * 14;
        const q = clamp((innerHeight - next.getBoundingClientRect().top) / (innerHeight - top));
        card.style.transform = `scale(${1 - 0.06 * q})`;
        card.style.filter = `brightness(${1 - 0.35 * q})`;
      });
      const c = contactRef.current;
      const s = shoutRef.current;
      if (c && s) {
        const q = smooth(0.1, 0.9, enterProgress(c));
        s.style.transform = `scale(${lerp(0.45, 1, q)})`;
        s.style.letterSpacing = `${lerp(0.3, -0.05, q)}em`;
        s.style.opacity = String(lerp(0.2, 1, q));
      }
    });

    return () => {
      stopDevice();
      stopCards();
      removeEventListener("pointermove", onPointer);
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bg-black text-white" style={{ fontVariationSettings: '"wdth" 100' }}>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-white">
        <nav className="mx-auto max-w-[1400px] h-14 px-5 md:px-8 flex items-center justify-between">
          <a href="#top" className="font-semibold text-lg tracking-[-0.04em]">
            dennis adalbert.
          </a>
          <div className="flex items-center gap-6 t-label">
            {t.navbar.links.map((l, i) => (
              <a key={l} href={["#work", "#top", "#contact"][i]} className="hidden sm:block opacity-70 hover:opacity-100">
                {l}
              </a>
            ))}
            <button onClick={toggleLang} className="cursor-pointer opacity-70 hover:opacity-100">
              {lang === "en" ? "ES" : "EN"}
            </button>
          </div>
        </nav>
      </header>

      <section id="top" ref={pinRef} style={{ height: "560vh" }} className="relative bg-[radial-gradient(ellipse_at_50%_40%,#1d1f22_0%,#050506_65%)]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 size-full" />

          <svg className="absolute inset-0 size-full pointer-events-none" aria-hidden="true">
            {layers.map((_, i) => (
              <g key={i}>
                <path ref={(el) => void (pathRefs.current[i] = el)} stroke="rgba(255,255,255,.55)" strokeWidth="1" fill="none" />
                <circle ref={(el) => void (dotRefs.current[i] = el)} r="3.5" fill={i === 2 ? "#f5c400" : "#fff"} />
              </g>
            ))}
          </svg>
          {layers.map(([k, v], i) => (
            <div
              key={k}
              ref={(el) => void (calloutRefs.current[i] = el)}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <div className="t-label text-white/45">
                {pad(i + 1)} — {k}
              </div>
              <div className="text-xs md:text-base text-white leading-snug mt-1">{v}</div>
            </div>
          ))}

          <div ref={heroRef} className="absolute inset-x-0 top-0 pt-24 md:pt-28 px-5 md:px-8 mx-auto max-w-[1400px] pointer-events-none">
            <p className="t-label text-white/50 mb-4">{t.hero.role}</p>
            <h1
              className="font-extrabold uppercase leading-[0.86] tracking-[-0.045em]"
              style={{ fontSize: "clamp(52px, 11vw, 176px)", fontVariationSettings: '"wdth" 112' }}
            >
              Dennis
              <br />
              Adalbert
            </h1>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 md:px-8 pb-8 mx-auto max-w-[1400px] flex items-end justify-between gap-6 pointer-events-none">
            <div className="flex flex-col gap-3">
              <span className="t-label text-white/40">
                fig. <span ref={phaseRef}>01</span> / 03
              </span>
              <div className="w-40 md:w-64 h-px bg-white/15 overflow-hidden">
                <div ref={barRef} className="h-px bg-white origin-left" style={{ transform: "scaleX(0)" }} />
              </div>
            </div>
            <span className="t-label bg-[#f5c400] text-black px-3 py-2 rounded-full">● {t.hero.available}</span>
          </div>

          <div ref={endRef} className="absolute inset-x-0 bottom-24 text-center opacity-0 pointer-events-none px-5">
            <p className="text-white/60 max-w-[44ch] mx-auto text-base md:text-lg">{t.hero.line}</p>
          </div>
        </div>
      </section>

      <section id="work" className="bg-[#efefec] text-[#0b0b0c] rounded-t-[36px] relative z-10 -mt-10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 pt-28 pb-14 flex items-end justify-between gap-6">
          <h2
            className="font-extrabold uppercase leading-[0.85] tracking-[-0.045em]"
            style={{ fontSize: "clamp(56px, 10vw, 150px)", fontVariationSettings: '"wdth" 112' }}
          >
            {t.projects.title}
          </h2>
          <span className="t-label text-black/50 pb-3">{pad(list.length)} uds.</span>
        </div>
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 pb-[18vh]">
          {list.map((p, i) => (
            <div
              key={p.name}
              ref={(el) => void (wrapRefs.current[i] = el)}
              className="sticky h-[82vh]"
              style={{ top: 72 + i * 14 }}
            >
              <a
                ref={(el) => void (cardRefs.current[i] = el)}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group h-[74vh] min-h-[420px] rounded-[32px] p-6 md:p-12 flex flex-col justify-between origin-top will-change-transform ${
                  p.featured ? "bg-[#f5c400] text-black" : i % 2 ? "bg-[#151618] text-white" : "bg-white text-black"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="t-label opacity-60">{p.lang}</span>
                  <span
                    className="font-extrabold leading-[0.8] tracking-[-0.06em] opacity-15 tabular-nums"
                    style={{ fontSize: "clamp(96px, 18vw, 280px)" }}
                  >
                    {pad(i + 1)}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-extrabold leading-[0.88] tracking-[-0.045em] break-words transition-transform duration-500 group-hover:translate-x-3"
                    style={{ fontSize: "clamp(40px, 8.5vw, 132px)", fontVariationSettings: '"wdth" 108' }}
                  >
                    {p.name}
                  </h3>
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                    <p className="max-w-[44ch] text-lg leading-snug opacity-75">{p.desc}</p>
                    <span className="t-label opacity-70">{p.meta} ↗</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" ref={contactRef} className="bg-black min-h-[110vh] flex flex-col justify-center overflow-x-clip py-24">
        <h2
          ref={shoutRef}
          className="font-extrabold uppercase leading-[0.82] text-center whitespace-nowrap will-change-transform"
          style={{ fontSize: "clamp(64px, 17vw, 280px)", fontVariationSettings: '"wdth" 118' }}
        >
          {t.contact.title}
        </h2>
        <div className="mt-14 flex flex-col items-center gap-6 px-5">
          <a
            href={`mailto:${EMAIL}`}
            className="font-semibold text-[clamp(22px,4vw,48px)] tracking-[-0.03em] border-b-2 border-white/25 hover:border-[#f5c400] transition-colors"
          >
            {EMAIL}
          </a>
          <div className="flex gap-3">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label rounded-full border border-white/25 px-4 py-2 hover:bg-white hover:text-black transition-colors"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── El módulo ──────────────────────────────────────────────

function buildDevice() {
  const group = new THREE.Group();
  const alu = new THREE.MeshPhysicalMaterial({ color: 0xcfd2d4, metalness: 1, roughness: 0.3, clearcoat: 0.35, clearcoatRoughness: 0.25 });
  const aluDark = new THREE.MeshPhysicalMaterial({ color: 0x7e8387, metalness: 1, roughness: 0.42 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0b0c0d, roughness: 0.5, metalness: 0.3 });
  const chipMat = new THREE.MeshStandardMaterial({ color: 0x17191b, roughness: 0.3, metalness: 0.4 });
  const yellow = new THREE.MeshStandardMaterial({ color: 0xf5c400, roughness: 0.35, emissive: 0xf5c400, emissiveIntensity: 0.25 });

  // 0 · cristal
  const glass = new THREE.Mesh(
    slab(W + 0.1, D + 0.1, 0.045, 0.17),
    // Vidrio ahumado: transparencia simple. Con `transmission` sale esmerilado y tapa la pantalla.
    new THREE.MeshPhysicalMaterial({
      color: 0xdfe6ea,
      metalness: 0,
      roughness: 0.02,
      transparent: true,
      opacity: 0.16,
      clearcoat: 1,
      envMapIntensity: 3,
      depthWrite: false,
    }),
  );
  glass.position.y = 0.215;

  // 1 · pantalla de puntos (el monograma ᗡB se enciende al final)
  const screenTex = screenTexture();
  const screen = new THREE.MeshStandardMaterial({ map: screenTex, emissiveMap: screenTex, emissive: 0xffffff, roughness: 0.45 });
  const display = new THREE.Mesh(new THREE.BoxGeometry(W - 0.06, 0.03, D - 0.06), [black, black, screen, black, black, black]);
  display.position.y = 0.18;

  // 2 · placa
  const board = new THREE.Group();
  const pcb = new THREE.MeshStandardMaterial({ map: pcbTexture(), roughness: 0.55, metalness: 0.25 });
  board.add(new THREE.Mesh(new THREE.BoxGeometry(W - 0.25, 0.035, D - 0.25), [black, black, pcb, black, black, black]));
  const soc = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.07, 0.66, 2, 0.02), alu);
  soc.position.set(-0.35, 0.05, -0.05);
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.006, 0.09), yellow);
  mark.position.set(-0.12, 0.088, 0.18);
  board.add(soc, mark);
  [
    [0.42, -0.42],
    [0.42, 0.32],
    [0.86, -0.42],
    [0.86, 0.32],
  ].forEach(([x, z]) => {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.2), chipMat);
    chip.position.set(x, 0.035, z);
    board.add(chip);
  });
  const small = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.03, 0.035), aluDark, 48);
  const m = new THREE.Matrix4();
  const r = rng(11);
  for (let i = 0; i < 48; i++) {
    m.makeRotationY(r() > 0.5 ? 0 : Math.PI / 2);
    m.setPosition(-1.3 + r() * 2.6, 0.03, -0.85 + r() * 1.7);
    small.setMatrixAt(i, m);
  }
  board.add(small);
  const port = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.14), chipMat);
  port.position.set(1.25, 0.05, 0.75);
  board.add(port);
  board.position.y = 0.05;

  // 3 · disipador
  const sink = new THREE.Group();
  sink.add(new THREE.Mesh(new THREE.BoxGeometry(W - 0.3, 0.03, D - 0.3), aluDark));
  const fins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.022, 0.17, D - 0.42), alu, 44);
  for (let i = 0; i < 44; i++) {
    m.makeTranslation(-W / 2 + 0.24 + i * ((W - 0.48) / 43), 0.1, 0);
    fins.setMatrixAt(i, m);
  }
  sink.add(fins);
  sink.position.y = -0.12;

  // 4 · chasis unibody
  const chassis = new THREE.Mesh(new RoundedBoxGeometry(W + 0.12, 0.4, D + 0.12, 6, 0.17), alu);
  chassis.position.y = -0.03;

  const parts = [glass, display, board, sink, chassis];
  group.add(...parts);
  return { group, parts, screen };
}

/** Losa de planta redondeada, como el cristal de un dispositivo. */
function slab(w: number, d: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 12 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -h / 2, 0);
  return g;
}

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

function pcbTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 680;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0d0f11";
  g.fillRect(0, 0, c.width, c.height);
  const r = rng(7);
  g.lineCap = "round";
  g.lineJoin = "round";
  for (let i = 0; i < 160; i++) {
    let x = Math.round(r() * 64) * 16;
    let y = Math.round(r() * 42) * 16;
    g.strokeStyle = r() > 0.85 ? "#3b4046" : "#20252a";
    g.lineWidth = r() > 0.8 ? 5 : 2.5;
    g.beginPath();
    g.moveTo(x, y);
    for (let s = 0; s < 3; s++) {
      const run = (r() - 0.5) * 360;
      const diag = (r() - 0.5) * 120;
      x += run;
      g.lineTo(x, y);
      x += diag;
      y += Math.abs(diag) * (r() > 0.5 ? 1 : -1);
      g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = "#2f353b";
    g.beginPath();
    g.arc(x, y, 5, 0, Math.PI * 2);
    g.fill();
  }
  g.strokeStyle = "#2b3036";
  g.lineWidth = 3;
  g.strokeRect(14, 14, c.width - 28, c.height - 28);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function screenTexture() {
  const cols = 64;
  const rows = 42;
  const glyph = document.createElement("canvas");
  glyph.width = cols;
  glyph.height = rows;
  const gg = glyph.getContext("2d")!;
  gg.fillStyle = "#fff";
  gg.font = "900 30px Arial, sans-serif";
  gg.textAlign = "center";
  gg.textBaseline = "middle";
  // Monograma con la D invertida: los astiles se encuentran en el centro.
  gg.save();
  gg.translate(21, 0);
  gg.scale(-1, 1);
  gg.fillText("D", 0, 22);
  gg.restore();
  gg.fillText("B", 43, 22);
  const px = gg.getImageData(0, 0, cols, rows).data;

  const c = document.createElement("canvas");
  c.width = cols * 16;
  c.height = rows * 16;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, c.width, c.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const lit = px[(y * cols + x) * 4 + 3] > 120;
      g.fillStyle = lit ? "#ffffff" : "#161616";
      g.beginPath();
      g.arc(x * 16 + 8, y * 16 + 8, lit ? 5.5 : 3.5, 0, Math.PI * 2);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
