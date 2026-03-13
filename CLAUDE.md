# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite configured.

## Architecture

Single-page portfolio built with **Next.js** + **Vue 19** (JSX: `vue-jsx`). The entire site renders from `app/page.tsx` as a vertical stack of section components.

**Section order in `app/page.tsx`:**
```
Navbar → HeroSection → AboutSection → SkillsSection → ProjectsSection → ContactSection → Footer
```

**Component layers:**
- `components/*.tsx` — portfolio sections (business content)
- `components/ui/` — shadcn-based primitives built on Radix UI Vue bindings (do not modify unless you know what you're doing)
- `components/theme-provider.tsx` — wraps `next-themes` for dark/light mode

## Styling

**Tailwind CSS v4** with OKLch CSS variables defined in `app/globals.css`. Colors are referenced via Tailwind utilities mapped to CSS vars (`--background`, `--primary`, `--accent`, etc.). Dark mode is driven by the `.dark` class (next-themes).

Path alias: `@/` → project root.

## Key Constraints

- **Vue JSX**, not React JSX. `tsconfig.json` sets `"jsx": "vue-jsx"`. Imports use Vue hooks and primitives, not React ones.
- Icons: **Lucide Vue** (`lucide-vue-next`)
- Forms: **Vue Hook Form** + **Zod**
- This project was bootstrapped from **v0.app** — the UI components in `components/ui/` follow shadcn patterns but adapted for Vue.
