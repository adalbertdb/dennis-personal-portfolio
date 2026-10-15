# adalbertdb · portfolio

Portfolio de Dennis Adalbert. Una sola página (Next.js 15 + React 19 + Tailwind v4): el scroll hace zoom desde una oblea de semiconductores hasta un die cuyo plano de planta es el stack, y sigue hasta el proceso de trabajo; después, proyectos y contacto.

```bash
pnpm install
cp .env.local.example .env.local   # GITHUB_TOKEN: sin él la lista de proyectos sale vacía
pnpm dev
pnpm typecheck
pnpm build
```

- Los proyectos salen de los repos fijados en GitHub (GraphQL, `lib/github.ts`) más Aparcaloo, a mano en `lib/projects.ts`.
- Textos ES/EN en `lib/translations.ts`; el idioma se detecta del navegador y se recuerda.
- El CV descargable vive en `public/` (`Dennis-Adalbert-CV-es.pdf`, `-en.pdf`).
- Con `prefers-reduced-motion` no hay scroll por pasos ni deriva de la oblea: scroll nativo.
