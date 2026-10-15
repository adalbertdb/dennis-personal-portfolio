"use client";
// El paso 05 del proceso (¿funciona?), hecho llamada a la acción: quien visita es el test y la respuesta es el
// email, que ocupa la última pantalla (en amarillo si pasa). Tras contestar hay una pausa y la página baja a él.

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/use-language";
import { CV, EMAIL, LINKS, STAMP } from "@/lib/site";
import { scrollToY } from "@/components/step-scroll";

// Tecla con recorrido: la cara flota sobre una base de color sólido (sin sombras) y se hunde al pulsar.
const KEY = "group flex-1 md:flex-none md:w-[230px] mt-3 cursor-pointer select-none rounded-[18px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-white";
const FACE =
  "block rounded-[18px] px-8 py-5 md:py-7 text-center font-extrabold uppercase -translate-y-2.5 transition-transform duration-200 ease-[cubic-bezier(.3,.7,.4,1.5)] group-hover:-translate-y-3.5 group-active:-translate-y-0.5 group-active:duration-[40ms]";
const KEY_TEXT = { ...STAMP, fontSize: "clamp(30px, 3.4vw, 48px)" } as const;
const PILL = "t-label rounded-full border border-white/30 px-4 py-2 hover:bg-white hover:text-black";

export function ContactSection() {
  const { lang, t } = useLanguage();
  const { test } = t;
  const [state, setState] = useState<"idle" | "pass" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const respond = (pass: boolean) => {
    navigator.vibrate?.(15);
    setState(pass ? "pass" : "fail");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => scrollToY(Infinity), 1300);
  };
  const answer = state === "pass" ? test.pass : state === "fail" ? test.fail : "";

  return (
    <section id="contact" className="relative border-t border-white/10">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="min-h-[100svh] py-24 flex flex-col justify-center md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <p className="t-label text-white/45 flex items-center gap-2">
              <span
                className={`size-2.5 rounded-full ${state === "pass" ? "bg-yellow rec-fast" : state === "idle" ? "bg-white/25" : "bg-white"}`}
              />
              05 · {t.process.steps[4][2]}
            </p>
            <h2 className="mt-4 font-extrabold uppercase leading-[0.95]" style={{ ...STAMP, fontSize: "clamp(32px, 5vw, 76px)" }}>
              {test.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-base text-white/60 leading-relaxed">{test.body}</p>
          </div>

          <div className="md:shrink-0">
            <div className="flex gap-4">
              <button onClick={() => respond(true)} className={`${KEY} bg-[#9a7b00]`}>
                <span className={`${FACE} bg-yellow text-black`} style={KEY_TEXT}>
                  Pass
                </span>
              </button>
              <button onClick={() => respond(false)} className={`${KEY} bg-[#8a8a8a]`}>
                <span className={`${FACE} bg-[#ececec] text-black`} style={KEY_TEXT}>
                  Fail
                </span>
              </button>
            </div>
            <p aria-live="polite" className={`mt-5 min-h-[1.5em] font-extrabold uppercase ${state === "pass" ? "text-yellow" : "text-white"}`} style={STAMP}>
              {answer && `${answer} ↓`}
            </p>
          </div>
        </div>

        {/* Última pantalla: el email llena el ancho (≈13 em de largo) y no hay nada debajo. */}
        <div id="email" className="min-h-[100svh] border-t border-white/10 flex flex-col justify-center gap-6 md:gap-10">
          <p
            className={`font-extrabold uppercase transition-colors duration-500 ${state === "pass" ? "text-yellow" : state === "fail" ? "text-white" : "text-white/40"}`}
            style={{ ...STAMP, fontSize: "clamp(20px, 2.6vw, 40px)" }}
          >
            {answer || test.idle}
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className={`break-all leading-[0.9] transition-colors duration-500 hover:text-yellow ${state === "pass" ? "text-yellow" : ""}`}
            style={{ ...STAMP, fontWeight: 800, fontSize: "clamp(20px, calc((min(100vw, 1400px) - 48px) / 13.5), 132px)" }}
          >
            {EMAIL}
          </a>
          <div className="flex flex-wrap gap-3 items-center">
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={PILL}>
                {label} ↗
              </a>
            ))}
            <a href={CV[lang]} download className={PILL}>
              CV ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
