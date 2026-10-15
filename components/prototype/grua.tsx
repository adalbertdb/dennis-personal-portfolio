"use client";
// PROTOTYPE D — «Grúa». Solo el héroe: al abrir la web un pórtico trae un contenedor de 20' amarillo con el
// nombre pintado, la carga oscila (péndulo simulado), cae y aterriza en seco (sacudida, aplastamiento, polvo,
// onda). Luego la cámara se acerca de frente hasta que el nombre pintado cae exactamente sobre el <h1> del
// héroe original; ahí el <h1> real toma el relevo, el 3D se disuelve y salen los detalles. El resto es la web actual.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useLanguage } from "@/lib/use-language";
import { lerp, rafLoop, smooth } from "./shared";

// Contenedor ISO 20' (m). El cuerpo pintado es algo menor: los postes y largueros sobresalen.
const CL = 6.06;
const CH = 2.59;
const CW = 2.44;
const BL = CL - 0.12;
const BH = CH - 0.16;
const FACE_Z = (CW - 0.1) / 2;
const TEX_W = 2048;
const TEX_H = Math.round((TEX_W * BH) / BL);
// Pórtico
const LEG_X = 7.4;
const GIRDER_Y = 10.4;
const PIVOT_Y = 9.7; // amarre de los cables en el carro
const SPREADER_H = 0.6;
// Guion (s)
const TRAVEL = [0.25, 1.75];
const DROP = [1.8, 2.5];
const IMPACT = DROP[1];
const LIFT = [3.0, 3.9];
const RETREAT = [3.6, 4.9];
const ZOOM = [3.05, 4.45];
const HANDOFF = 4.5;
const END = 7;
const X_START = -5.6;
const X_PARK = 5.4;
const L_HANG = PIVOT_Y - (4.6 + CH + SPREADER_H); // colgando con la base a 4,6 m
const L_LAND = PIVOT_Y - (CH + SPREADER_H);

const ease = (t: number) => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, t)))) / 2;

function trolleyX(t: number) {
  if (t < RETREAT[0]) return lerp(X_START, 0, ease((t - TRAVEL[0]) / (TRAVEL[1] - TRAVEL[0])));
  return lerp(0, X_PARK, ease((t - RETREAT[0]) / (RETREAT[1] - RETREAT[0])));
}

function cableL(t: number) {
  if (t < LIFT[0]) {
    const d = Math.min(1, Math.max(0, (t - DROP[0]) / (DROP[1] - DROP[0])));
    return lerp(L_HANG, L_LAND, Math.pow(d, 2.1)); // acelera hasta el golpe
  }
  return lerp(L_LAND, L_HANG, ease((t - LIFT[0]) / (LIFT[1] - LIFT[0])));
}

export function Grua() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const base1Ref = useRef<HTMLSpanElement>(null);
  const base2Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDListElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => new THREE.Color(css.getPropertyValue(name).trim());
    const plate = token("--plate");
    const ink = token("--ink");
    const graphite = token("--graphite");
    const yellow = token("--accent-y");

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = plate;
    scene.fog = new THREE.Fog(plate, 34, 80);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.add(new THREE.HemisphereLight(0xffffff, plate, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(9, 18, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 50 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    // Suelo: retícula pintada y marcas de la bahía de aterrizaje
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ color: plate, roughness: 0.92 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const grid = new THREE.GridHelper(120, 60, ink, ink);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.08;
    grid.position.y = 0.002;
    scene.add(grid);
    const markMat = new THREE.MeshBasicMaterial({ color: ink });
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) {
        const cx = sx * (CL / 2 + 0.35);
        const cz = sz * (CW / 2 + 0.35);
        const a = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.09), markMat);
        a.rotation.x = -Math.PI / 2;
        a.position.set(cx - sx * 0.45, 0.004, cz);
        const b = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.9), markMat);
        b.rotation.x = -Math.PI / 2;
        b.position.set(cx, 0.004, cz - sz * 0.45);
        scene.add(a, b);
      }

    // Pórtico
    const steel = new THREE.MeshPhysicalMaterial({ color: 0x3a3f46, metalness: 0.55, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.3 });
    const alu = new THREE.MeshPhysicalMaterial({ color: 0xc9cdd0, metalness: 1, roughness: 0.3 });
    const crane = new THREE.Group();
    for (const sx of [-1, 1]) {
      const x = sx * LEG_X;
      for (const sz of [-1, 1]) {
        crane.add(beam(new THREE.Vector3(x, 0.55, sz * 2.7), new THREE.Vector3(x, GIRDER_Y, sz * 0.55), 0.3, 0.3, steel));
        const bogie = box(0.9, 0.5, 1.5, steel);
        bogie.position.set(x, 0.3, sz * 2.7);
        crane.add(bogie);
      }
      const sill = box(0.5, 0.35, 5.8, steel);
      sill.position.set(x, 0.72, 0);
      const rail = box(0.16, 0.08, 120, alu);
      rail.position.set(x, 0.04, 0);
      crane.add(sill, rail);
    }
    const girder = box(2 * LEG_X + 2.2, 1.0, 1.2, steel);
    girder.position.set(0, GIRDER_Y + 0.5, 0);
    const girderRail = box(2 * LEG_X, 0.08, 0.9, alu);
    girderRail.position.set(0, GIRDER_Y - 0.04, 0);
    crane.add(girder, girderRail);
    scene.add(crane);

    const trolley = new THREE.Group();
    const tBody = box(1.9, 0.55, 1.5, new THREE.MeshPhysicalMaterial({ color: 0xaab0b5, metalness: 0.9, roughness: 0.32 }));
    tBody.position.y = PIVOT_Y + 0.3;
    const tDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.3, 24), steel);
    tDrum.rotation.x = Math.PI / 2;
    tDrum.position.set(0, PIVOT_Y + 0.05, 0);
    trolley.add(tBody, tDrum);
    scene.add(trolley);

    // Spreader (origen en su base)
    const spreader = new THREE.Group();
    for (const sz of [-1, 1]) {
      const m = box(CL, 0.24, 0.2, steel);
      m.position.set(0, 0.12, sz * (CW / 2 - 0.12));
      spreader.add(m);
    }
    for (const x of [-CL / 2 + 0.12, 0, CL / 2 - 0.12]) {
      const c = box(0.2, 0.24, CW, steel);
      c.position.set(x, 0.12, 0);
      spreader.add(c);
    }
    const head = box(1.3, 0.36, 1.0, alu);
    head.position.y = 0.42;
    spreader.add(head);
    scene.add(spreader);

    const cableMat = new THREE.MeshStandardMaterial({ color: 0x2a2d31, metalness: 0.8, roughness: 0.35 });
    const cables = [0, 1, 2, 3].map(() => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1, 6), cableMat);
      c.castShadow = true;
      scene.add(c);
      return c;
    });
    const cableTop = [-1, 1].flatMap((sx) => [-1, 1].map((sz) => new THREE.Vector3(sx * 0.6, 0, sz * 0.45)));
    const cableLow = cableTop.map((v) => new THREE.Vector3(v.x * 0.75, SPREADER_H, v.z * 0.75));

    // Contenedor (origen en la base, para aplastarlo contra el suelo)
    const side = sideTexture(yellow, ink);
    const container = buildContainer(yellow, ink, side.tex);
    scene.add(container);

    // Sombra de contacto: la direccional cae detrás del contenedor y sin esto parece flotar.
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(CL * 1.5, CW * 2.2),
      new THREE.MeshBasicMaterial({ map: puff(), color: 0x000000, transparent: true, opacity: 0, depthWrite: false }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.006;
    scene.add(contact);

    // Polvo y onda
    const DUST = 320;
    const dustPos = new Float32Array(DUST * 3);
    const dustVel = new Float32Array(DUST * 3);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: plate.clone().lerp(graphite, 0.45), size: 0.6, map: puff(), transparent: true, depthWrite: false, opacity: 0 });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);
    const seedDust = () => {
      for (let i = 0; i < DUST; i++) {
        // Nace en el perímetro de la base y sale despedido hacia fuera
        const s = Math.random() * 4;
        const u = Math.random() * 2 - 1;
        const [x, z] = s < 1 ? [(u * CL) / 2, CW / 2] : s < 2 ? [(u * CL) / 2, -CW / 2] : s < 3 ? [CL / 2, (u * CW) / 2] : [-CL / 2, (u * CW) / 2];
        const out = new THREE.Vector2(x / (CL / 2), z / (CW / 2)).normalize();
        const v = 2.5 + Math.random() * 5.5;
        dustPos.set([x, 0.05 + Math.random() * 0.25, z], i * 3);
        dustVel.set([out.x * v, 0.6 + Math.random() * 2.2, out.y * v], i * 3);
      }
      dustGeo.attributes.position.needsUpdate = true;
    };
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // Encaje con el <h1>: se mide su pen origin y sus líneas base en el DOM y se pinta el nombre en la textura
    // con esas mismas proporciones; con eso se despeja dónde poner la cámara para que coincidan píxel a píxel.
    let match: { k: number; tx: number; tb: number; hx: number; b1: number } | null = null;
    const measure = () => {
      const cr = canvas.getBoundingClientRect();
      const F = parseFloat(getComputedStyle(h1Ref.current!).fontSize);
      const hx = h1Ref.current!.getBoundingClientRect().left - cr.left;
      const b1 = base1Ref.current!.getBoundingClientRect().bottom - cr.top;
      const b2 = base2Ref.current!.getBoundingClientRect().bottom - cr.top;
      const k = (0.66 * TEX_W) / line2Ref.current!.getBoundingClientRect().width; // px de textura por px de pantalla
      const { tx, tb } = side.paint(F * k, (b2 - b1) * k);
      match = { k, tx, tb, hx, b1 };
    };
    document.fonts.ready.then(measure);
    addEventListener("resize", measure);

    // Estado
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frozen = parseFloat(new URLSearchParams(location.hash.slice(1)).get("t") ?? ""); // #t=2.6 congela el guion
    let t0 = performance.now() - (reduce ? END * 1000 : 0);
    let last = 0;
    let th = 0;
    let om = 0;
    let landed = false;
    let swept = false;
    let mx = 0;
    let my = 0;
    let w = 0;
    let h = 0;
    const camPos = new THREE.Vector3();
    const camTarget = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    const replay = () => {
      t0 = performance.now();
      last = 0;
      th = om = 0;
      landed = swept = false;
    };
    replayRef.current?.addEventListener("click", replay);
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onPointer);
    const reveal = (el: HTMLElement | null, from: number, to: number, time: number) => {
      if (!el) return;
      const q = smooth(from, to, time);
      el.style.opacity = String(q);
      el.style.transform = q < 1 ? `translateY(${(1 - q) * 16}px)` : "";
    };

    const stop = rafLoop((now) => {
      const time = Number.isNaN(frozen) ? (now - t0) / 1000 : frozen;
      const dt = Number.isNaN(frozen) ? Math.min(0.05, Math.max(0, time - last)) : 0;
      last = time;

      // Relevo y detalles (DOM): primero el nombre, luego rol, descripción y ficha.
      const fade = smooth(HANDOFF + 0.05, HANDOFF + 0.6, time);
      canvas.style.opacity = String(1 - fade);
      if (h1Ref.current) h1Ref.current.style.opacity = String(smooth(HANDOFF - 0.05, HANDOFF + 0.08, time));
      reveal(roleRef.current, HANDOFF + 0.25, HANDOFF + 0.65, time);
      reveal(leadRef.current, HANDOFF + 0.4, HANDOFF + 0.85, time);
      reveal(specRef.current, HANDOFF + 0.55, HANDOFF + 1.0, time);
      reveal(replayRef.current, HANDOFF + 1, HANDOFF + 1.4, time);
      if (!swept && time > HANDOFF + 0.3 && Number.isNaN(frozen)) {
        swept = true;
        section.animate([{ backgroundPosition: "100% 0" }, { backgroundPosition: "0 0" }], { duration: 1500, easing: "ease-out" });
      }
      if (fade >= 1) return;

      if (canvas.clientWidth !== w || canvas.clientHeight !== h) {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      // Péndulo: lo excita la aceleración del carro; el control antibalanceo lo amortigua (más o menos).
      const xt = trolleyX(time);
      const L = cableL(time);
      const attached = time < LIFT[0];
      const Lp = L + SPREADER_H + (attached ? CH / 2 : 0.1);
      for (let s = 0; s < 8; s++) {
        const ts = time - dt + ((s + 1) * dt) / 8;
        const hh = 1 / 120;
        const at = (trolleyX(ts + hh) - 2 * trolleyX(ts) + trolleyX(ts - hh)) / (hh * hh);
        const damp = ts > DROP[0] && ts < IMPACT ? 5 : 0.55;
        om += (-(9.8 / Lp) * Math.sin(th) - ((0.32 * at) / Lp) * Math.cos(th) - damp * om) * (dt / 8);
        th += om * (dt / 8);
      }
      if (reduce || time > END) th = om = 0;
      const angle = attached ? th * (1 - smooth(DROP[0] + 0.25, IMPACT - 0.05, time)) : th;

      trolley.position.x = xt;
      const reach = L + SPREADER_H;
      const sb = new THREE.Vector3(xt + Math.sin(angle) * reach, PIVOT_Y - Math.cos(angle) * reach, 0);

      // Golpe
      if (!landed && time >= IMPACT && Number.isNaN(frozen)) {
        landed = true;
        th = om = 0;
        seedDust();
      }
      const since = time - IMPACT;
      const hit = since >= 0 ? Math.exp(-since * 9) : 0;
      const squash = since >= 0 ? Math.exp(-since * 9) * Math.cos(since * 30) : 0;
      container.scale.set(1 + 0.022 * squash, 1 - 0.055 * squash, 1 + 0.022 * squash);
      const height = attached && time < IMPACT ? Math.max(0, sb.y - CH) : 0;
      contact.material.opacity = 0.42 * Math.max(0, 1 - height / 5);
      contact.position.x = attached && time < IMPACT ? sb.x : 0;
      contact.scale.setScalar(1 + height * 0.12);

      if (attached && time < IMPACT) {
        container.position.set(sb.x + Math.sin(angle) * CH, sb.y - Math.cos(angle) * CH, 0);
        container.rotation.z = angle;
      } else {
        container.position.set(0, 0, 0);
        container.rotation.z = 0;
      }
      if (attached && time >= IMPACT) sb.y = CH * container.scale.y;
      spreader.position.copy(sb);
      spreader.rotation.z = angle;
      spreader.updateMatrixWorld();
      cables.forEach((c, i) => {
        a.copy(cableTop[i]).add(trolley.position).setY(PIVOT_Y);
        b.copy(cableLow[i]).applyMatrix4(spreader.matrixWorld);
        c.position.copy(a).add(b).multiplyScalar(0.5);
        c.scale.y = a.distanceTo(b);
        c.quaternion.setFromUnitVectors(up, b.sub(a).normalize());
      });

      if (since >= 0 && since < 3) {
        const step = Math.min(dt, 1 / 30);
        for (let i = 0; i < DUST; i++) {
          const k = i * 3;
          dustVel[k] *= 1 - 2.8 * step;
          dustVel[k + 2] *= 1 - 2.8 * step;
          dustVel[k + 1] = dustVel[k + 1] * (1 - 1.5 * step) - 0.6 * step;
          dustPos[k] += dustVel[k] * step;
          dustPos[k + 1] = Math.max(0.03, dustPos[k + 1] + dustVel[k + 1] * step);
          dustPos[k + 2] += dustVel[k + 2] * step;
        }
        dustGeo.attributes.position.needsUpdate = true;
        dustMat.opacity = 0.4 * (1 - smooth(0.1, 2.6, since));
        dustMat.size = 0.6 + since * 1.4;
        ring.scale.setScalar(3.4 + smooth(0, 0.9, since) * 9);
        ring.material.opacity = 0.55 * (1 - smooth(0, 0.9, since));
      } else {
        dustMat.opacity = 0;
        ring.material.opacity = 0;
      }

      // Cámara: sigue la carga en lo alto, baja con la caída, tiembla al golpe y se acerca de frente al nombre.
      const narrow = w / h < 1;
      const c1 = ease(time / TRAVEL[1]);
      const c2 = Math.pow(smooth(DROP[0] - 0.1, IMPACT, time), 1.6);
      const c3 = smooth(ZOOM[0], ZOOM[1], time);
      camPos.set(-7, 10.5, 25).lerp(new THREE.Vector3(2.5, 9, 25), c1).lerp(new THREE.Vector3(6, 5.2, 25.5), c2);
      camTarget.set(-4.5, 6.8, 0).lerp(new THREE.Vector3(0, 6, 0), c1).lerp(new THREE.Vector3(0.4, 4.2, 0), c2);
      const fit = Math.max(1, 11 / (2 * Math.tan(THREE.MathUtils.degToRad(15)) * camera.aspect) / camPos.distanceTo(camTarget));
      camPos.sub(camTarget).multiplyScalar(narrow ? fit : 1).add(camTarget);
      const loose = 1 - c3;
      camPos.x += mx * 0.6 * loose + (Math.random() - 0.5) * 0.5 * hit;
      camPos.y += (-my * 0.35 + Math.max(0, -section.getBoundingClientRect().top) * 0.004) * loose + (Math.random() - 0.5) * 0.5 * hit;
      if (match && c3 > 0) {
        // Plano frontal: px de pantalla por metro en la cara, distancia que lo produce y centro que lleva el
        // origen del texto pintado (tx, tb) al origen del <h1> (hx, b1).
        const P = TEX_W / (match.k * BL);
        const d = h / 2 / (P * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
        const X = -BL / 2 + (match.tx / TEX_W) * BL;
        const Y = CH / 2 + BH / 2 - (match.tb / TEX_H) * BH;
        const cx = X - (match.hx - w / 2) / P;
        const cy = Y + (match.b1 - h / 2) / P;
        camPos.lerp(a.set(cx, cy, FACE_Z + d), c3);
        camTarget.lerp(b.set(cx, cy, FACE_Z), c3);
      }
      camera.position.copy(camPos);
      camera.lookAt(camTarget);
      renderer.render(scene, camera);
    });

    return () => {
      stop();
      removeEventListener("resize", measure);
      removeEventListener("pointermove", onPointer);
      replayRef.current?.removeEventListener("click", replay);
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  // Mismo marcado que components/hero-section.tsx, para que el nombre aterrice donde ya estaba.
  return (
    <section id="top" ref={sectionRef} className="mat hero-metal relative border-b-4 border-edge overflow-hidden min-h-[calc(100svh-68px)]">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="wrap relative pt-12 pb-24 md:pt-24">
        <p ref={roleRef} className="t-cond text-graphite mb-6 opacity-0">
          {t.hero.role}
        </p>

        {/* El canvas solo admite anchos por palabra clave; «semi-expanded» (112,5) es el más cercano al 118 del
            original y el <h1> usa el mismo para que el relevo no se note. */}
        <h1 ref={h1Ref} className="t-stamp opacity-0" style={{ fontSize: "clamp(48px, 14vw, 176px)", fontVariationSettings: '"wdth" 112.5' }}>
          <span ref={base1Ref} className="inline-block" />
          Dennis
          <span ref={line2Ref} className="block w-fit">
            <span ref={base2Ref} className="inline-block" />
            Adalbert
          </span>
        </h1>

        <div className="grid-12 gap-y-12 mt-12 md:mt-24 items-end">
          <div ref={leadRef} className="col-span-6 flex flex-col gap-6 opacity-0">
            <p className="max-w-[40ch] text-lg leading-7 text-cast">{t.hero.line}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#work" className="t-label bg-ink text-plate px-6 py-4 hover:bg-yellow hover:text-on-accent transition-colors">
                {t.hero.btnWork} →
              </a>
              <a href="#contact" className="t-label text-ink border-4 border-ink px-5 py-3 hover:bg-ink hover:text-plate transition-colors">
                {t.hero.btnContact}
              </a>
            </div>
          </div>

          <dl ref={specRef} className="col-span-6 md:col-start-8 md:col-span-5 bg-plate-raised border-4 border-edge opacity-0">
            {t.hero.spec.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3 border-b-2 border-edge-soft">
                <dt className="t-label text-graphite">{k}</dt>
                <dd className="t-data text-ink text-right">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between items-stretch">
              <dt className="t-label text-graphite px-4 py-3">{t.hero.status}</dt>
              <dd className="t-label bg-yellow text-on-accent px-4 py-3 flex items-center">{t.hero.available}</dd>
            </div>
          </dl>
        </div>
      </div>
      <button ref={replayRef} className="absolute right-4 md:right-8 top-4 t-label text-graphite hover:text-ink cursor-pointer opacity-0">
        ↻ repetir
      </button>
    </section>
  );
}

// ─── Piezas ─────────────────────────────────────────────────

function box(w: number, h: number, d: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}

function beam(from: THREE.Vector3, to: THREE.Vector3, w: number, d: number, mat: THREE.Material) {
  const dir = to.clone().sub(from);
  const m = box(w, dir.length(), d, mat);
  m.position.copy(from).add(to).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

function buildContainer(yellow: THREE.Color, ink: THREE.Color, side: THREE.Texture) {
  const group = new THREE.Group();
  const corr = corrugation();
  const ribs = (n: number) => {
    const tex = corr.clone();
    tex.repeat.set(n, 1);
    tex.needsUpdate = true;
    return tex;
  };
  const paint = (map: THREE.Texture | null, normal: THREE.Texture | null) =>
    new THREE.MeshPhysicalMaterial({
      color: map ? 0xffffff : yellow,
      map,
      normalMap: normal,
      normalScale: new THREE.Vector2(1.4, 1.4),
      roughness: 0.5,
      metalness: 0.15,
      clearcoat: 0.3,
      clearcoatRoughness: 0.45,
    });
  const mats = [
    paint(doorTexture(yellow, ink), ribs(6)),
    paint(null, ribs(10)),
    paint(null, ribs(28)),
    new THREE.MeshStandardMaterial({ color: 0x1c1f23 }),
    paint(side, ribs(34)),
    paint(side, ribs(34)),
  ];
  const body = new THREE.Mesh(new THREE.BoxGeometry(BL, BH, CW - 0.1), mats);
  body.position.y = CH / 2;
  body.castShadow = body.receiveShadow = true;
  group.add(body);

  const frame = new THREE.MeshPhysicalMaterial({ color: yellow.clone().multiplyScalar(0.86), roughness: 0.45, metalness: 0.2, clearcoat: 0.3 });
  const cast = new THREE.MeshStandardMaterial({ color: 0x24272b, roughness: 0.5, metalness: 0.4 });
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const post = box(0.16, CH, 0.16, frame);
      post.position.set(sx * (CL / 2 - 0.08), CH / 2, sz * (CW / 2 - 0.08));
      group.add(post);
      for (const y of [0.07, CH - 0.07]) {
        const c = box(0.19, 0.14, 0.19, cast);
        c.position.set(sx * (CL / 2 - 0.09), y, sz * (CW / 2 - 0.09));
        group.add(c);
      }
    }
  for (const y of [0.09, CH - 0.07])
    for (const sz of [-1, 1]) {
      const rail = box(CL - 0.3, y < 1 ? 0.18 : 0.12, 0.13, frame);
      rail.position.set(0, y, sz * (CW / 2 - 0.065));
      group.add(rail);
    }
  return group;
}

function corrugation() {
  // Mapa de normales de la chapa trapezoidal: plano, rampa, plano, rampa.
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 4;
  const g = c.getContext("2d")!;
  for (let x = 0; x < 64; x++) {
    const u = x / 64;
    const slope = u < 0.3 ? 0 : u < 0.45 ? 0.75 : u < 0.8 ? 0 : -0.75;
    const n = new THREE.Vector3(slope, 0, 1).normalize();
    g.fillStyle = `rgb(${(n.x * 0.5 + 0.5) * 255},${(n.y * 0.5 + 0.5) * 255},${(n.z * 0.5 + 0.5) * 255})`;
    g.fillRect(x, 0, 1, 4);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Costado del contenedor. `paint` recibe el cuerpo y el interlineado del <h1> en px de textura y devuelve
 *  dónde quedó el origen de la primera línea, para que la cámara lo haga coincidir con el del <h1>. */
function sideTexture(yellow: THREE.Color, ink: THREE.Color) {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const g = c.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const sans = css.getPropertyValue("--font-archivo") || "sans-serif";
  const mono = css.getPropertyValue("--font-plex-mono") || "monospace";

  const paint = (size: number, gap: number) => {
    g.fillStyle = `#${yellow.getHexString()}`;
    g.fillRect(0, 0, TEX_W, TEX_H);
    for (let x = 0; x < TEX_W; x += TEX_W / 34) {
      g.fillStyle = "rgba(0,0,0,.035)";
      g.fillRect(x + (TEX_W / 34) * 0.3, 0, (TEX_W / 34) * 0.15, TEX_H);
    }
    const tx = TEX_W * 0.06;
    const tb = TEX_H / 2 - gap / 2 + size * 0.36; // bloque de dos líneas centrado en vertical
    g.fillStyle = `#${ink.getHexString()}`;
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
    g.font = `800 semi-expanded ${size}px ${sans}`;
    g.fontStretch = "semi-expanded";
    g.letterSpacing = `${-0.025 * size}px`; // .t-stamp
    g.fillText("DENNIS", tx, tb);
    g.fillText("ADALBERT", tx, tb + gap);
    g.fontStretch = "normal";
    g.letterSpacing = "0px";
    g.font = `500 ${TEX_H * 0.055}px ${mono}`;
    g.textAlign = "right";
    g.fillText("ADBU 000001 7", TEX_W * 0.955, TEX_H * 0.13);
    g.fillText("22G1", TEX_W * 0.955, TEX_H * 0.21);
    g.font = `400 ${TEX_H * 0.035}px ${mono}`;
    ["MAX. GROSS  30480 KG", "TARE         2230 KG", "NET         28250 KG"].forEach((l, i) => g.fillText(l, TEX_W * 0.955, TEX_H * (0.8 + i * 0.05)));
    tex.needsUpdate = true;
    return { tx, tb };
  };
  paint(TEX_H * 0.3, TEX_H * 0.27);
  return { tex, paint };
}

function doorTexture(yellow: THREE.Color, ink: THREE.Color) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = Math.round((1024 * CH) / CW);
  const g = c.getContext("2d")!;
  g.fillStyle = `#${yellow.getHexString()}`;
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = "rgba(0,0,0,.35)";
  g.lineWidth = 6;
  g.strokeRect(24, 24, c.width / 2 - 30, c.height - 48);
  g.strokeRect(c.width / 2 + 6, 24, c.width / 2 - 30, c.height - 48);
  g.fillStyle = `#${ink.getHexString()}`;
  for (const x of [0.16, 0.36, 0.64, 0.84]) {
    g.fillRect(c.width * x - 7, 40, 14, c.height - 80);
    g.fillRect(c.width * x - 26, c.height * 0.55, 52, 22);
    for (const y of [0.12, 0.88]) g.fillRect(c.width * x - 20, c.height * y, 40, 30);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function puff() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
