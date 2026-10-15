# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Next.js)
pnpm build      # Production build
pnpm lint       # ESLint check
```

No test suite configured.

## Architecture

Single-page portfolio built with **Next.js 15** + **React 19**. The entire site renders from `app/page.tsx` as a vertical stack of section components.

**Section order in `app/page.tsx`:**
```
Navbar → HeroSection → ProjectsSection → SkillsSection → ContactSection → Footer
```

**Component layers:**
- `components/*.tsx` — portfolio sections (business content)
- `components/ui/` — stock shadcn primitives on Radix UI (React) (do not modify unless you know what you're doing)
- `components/theme-provider.tsx` — `next-themes` wrapper, currently unused: the theme follows `prefers-color-scheme` in `app/globals.css`

## Styling

**Tailwind CSS v4** with the "Taller" tokens from the adalbertdb design system in `app/globals.css` (`--plate`, `--ink`, `--edge`, `--accent-y`, …; light "chapa" by default, dark "acero" via `prefers-color-scheme`). Utilities: `bg-plate`, `text-ink`, `border-edge`, `bg-yellow`, etc. Type/grid/material classes (`t-stamp`, `t-title`, `t-label`, `t-data`, `wrap`, `grid-12`, `mat`) live in `@layer components`. Fonts: Archivo (variable, `wdth` axis) + IBM Plex Mono. No radius, no shadows, no icon set; yellow only as painted planes.

Path alias: `@/` → project root.

## Key Constraints

- **React 19**, standard JSX (`"jsx": "preserve"`). Package manager is **pnpm**.
- Sections are client components because they read copy from `useLanguage()` (`lib/use-language.tsx`, strings in `lib/translations.ts`, ES/EN).
- Projects come from GitHub GraphQL (`lib/github.ts`) and need `GITHUB_TOKEN`; without it the list renders empty.
- Icons: `lucide-react` is only used inside `components/ui/`. The design system has no icon set, so sections use mono glyphs (`↗`, `→`).
- Forms: `react-hook-form` + `zod` are installed (used only by `components/ui/form.tsx`).
- Bootstrapped from **v0.app**; `components/ui/` are shadcn components.
