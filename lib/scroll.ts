export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 0 cuando el borde superior de `el` toca el techo del viewport; 1 cuando su borde inferior toca el suelo. */
export function pinProgress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight));
}

/** 0 cuando `el` asoma por abajo; 1 cuando su borde superior llega arriba. */
export function enterProgress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return clamp(1 - r.top / innerHeight);
}

export function rafLoop(fn: (t: number) => void) {
  let id = requestAnimationFrame(function frame(t) {
    fn(t);
    id = requestAnimationFrame(frame);
  });
  return () => cancelAnimationFrame(id);
}

/** Ejecuta `fn` una vez y después en cada frame en que haya scroll o resize. Devuelve cómo parar. */
export function onScrollFrame(fn: () => void) {
  let id = 0;
  const run = () => {
    cancelAnimationFrame(id);
    id = requestAnimationFrame(fn);
  };
  fn();
  addEventListener("scroll", run, { passive: true });
  addEventListener("resize", run);
  return () => {
    cancelAnimationFrame(id);
    removeEventListener("scroll", run);
    removeEventListener("resize", run);
  };
}

export const pad = (n: number) => String(n).padStart(2, "0");
