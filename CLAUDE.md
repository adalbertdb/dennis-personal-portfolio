# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Next.js); needs GITHUB_TOKEN for the project list
pnpm build      # Production build (type errors fail the build)
pnpm typecheck  # tsc --noEmit
```

No test suite configured, no ESLint.

## Architecture

Single-page portfolio built with **Next.js 15** + **React 19**. `app/page.tsx` fetches the pinned repos and renders the sections in a vertical stack on a black background.

**Section order in `app/page.tsx`:**
```
StepScroll (no UI) · Navbar · ProgressGlyphs → Wafer → WorkSection → ContactSection
```

- `components/wafer.tsx` — pinned 530vh section: Canvas 2D wafer → die → core zoom driven by scroll (hero, stack, process). The stack is canvas-only, so it is duplicated as an `sr-only` list in the DOM; keep both in sync (`BLOCKS`).
- `components/step-scroll.tsx` — one gesture = one stop (wheel/touch/keys); stops are found by element id (`stack`, `proceso`, `work`, `contact`). Disabled with `prefers-reduced-motion`. `scrollToY()` is how other components move the page.
- `components/work-section.tsx` — Aparcaloo + GitHub pinned repos (`lib/projects.ts`).
- `components/contact-section.tsx` — PASS/FAIL test, then the full-screen email (`#email`, the navbar's "Contact" target) and links/CV.
- `components/smooth-scroll.tsx` — Lenis; stopped while step scroll is active.
- `components/ui/` — stock shadcn primitives on Radix UI (React), unused by the site (do not modify unless you know what you're doing).
- `components/theme-provider.tsx` — `next-themes` wrapper, currently unused.
- `app/opengraph-image.tsx` — generated OG image.

## Styling

**Tailwind CSS v4**. The site is always dark ("Oblea" direction): `bg-black text-white`, yellow `bg-yellow` / `text-yellow` (`--accent-y`) as the only accent, rounded pills and tiles, headings in Archivo wide (`STAMP` in `lib/site.ts`, `wdth` 118), labels in IBM Plex Mono (`t-label`). The "Taller" tokens and classes in `app/globals.css` (from the adalbertdb design system, light "chapa" / dark "acero") are still defined for `components/ui`; the site itself only uses `t-label`, `yellow` and the `rec` blink.

Path alias: `@/` → project root.

## Key Constraints

- **React 19**, standard JSX (`"jsx": "preserve"`). Package manager is **pnpm**.
- Sections are client components because they read copy from `useLanguage()` (`lib/use-language.tsx`, strings in `lib/translations.ts`, ES/EN; starts in ES, then localStorage or `navigator.language`).
- Projects come from GitHub GraphQL (`lib/github.ts`) and need `GITHUB_TOKEN`; without it the list renders only Aparcaloo.
- Icons: `lucide-react` is only used inside `components/ui/`. Sections use mono glyphs (`↗`, `↓`).
- Forms: `react-hook-form` + `zod` are installed (used only by `components/ui/form.tsx`).
- Public data: no street or town in copy or CVs (only "Valencia · Remoto / presencial"); the CVs in `public/` are deliberately minimal.
- Bootstrapped from **v0.app**; `components/ui/` are shadcn components.
