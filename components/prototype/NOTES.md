# Prototipo: dirección visual del portfolio

**Pregunta:** ¿qué dirección da dinamismo al scroll y representa la «fábrica de software» (sin escribirlo) con estética de alta ingeniería tipo Apple / Nothing?

**Cómo verlo:** `GITHUB_TOKEN=$(gh auth token) pnpm dev` → http://localhost:3000, y se cambia con la barra rosa o con ← / →. La barra y `?variant=` solo existen en desarrollo.

| Clave | Variante | Idea | Técnica |
|---|---|---|---|
| `actual` | Actual | La web publicada, como referencia | — |
| `despiece` | A — Despiece | El stack es hardware: un módulo de aluminio se despieza con el scroll (cristal = frontend, pantalla = móvil, placa = backend, disipador = infra, chasis = herramientas) y se vuelve a montar encendiendo ᗡB. Trabajo en tarjetas que se apilan. | Three.js (`three` añadido a dependencias) |
| `linea` | B — Línea | La página es un plano técnico. Una línea de montaje horizontal: tolva de glifos → prensa → brazo robot con IK → láser de inspección → etiquetadora. Trabajo «sale» de la línea; el stack es una lista de materiales. | SVG + rAF, sin dependencias |
| `oblea` | C — Oblea | Fab de semiconductores: zoom desde la oblea hasta un die cuyo plano de planta es el stack; trabajo como mapa de dies; contacto: un test PASS/FAIL y el email a pantalla completa al final. Scroll por pasos: cada gesto lleva a la siguiente parada (héroe, stack, proceso, trabajo, test, email). | Canvas 2D |
| `grua` | D — Grúa | Solo el héroe (el resto es la web actual). Un pórtico trae un contenedor de 20' con el nombre pintado; péndulo simulado, caída y golpe (sacudida, aplastamiento, polvo, onda); zoom frontal hasta que el nombre pintado coincide con el `<h1>` original, relevo al DOM y salen los detalles. `#t=4.5` en la URL congela el guion. | Three.js |

**Sin hacer a propósito (prototipo):** `prefers-reduced-motion`, fallback sin WebGL, pausa con la pestaña oculta y la parada de emergencia. Hay que hacerlo al reescribir la ganadora.

**Veredicto:** _pendiente_. Al decidir: anotar aquí la ganadora y qué se roba de las otras, reescribirla limpia en `components/`, y borrar esta carpeta, el mapa `PROTOTYPES` de `app/page.tsx` y (si no gana A) la dependencia `three`.
