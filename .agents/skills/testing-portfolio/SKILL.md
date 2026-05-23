---
name: testing-portfolio
description: Test the Siam IT portfolio site end-to-end. Use when verifying UI changes, i18n, or responsive layout.
---

# Testing the Siam IT Portfolio

## Prerequisites

- Node.js >= 22.12.0
- No external credentials or secrets required (static Astro site)

## Setup

```bash
cd /home/ubuntu/repos/portfolio
npm install
npm run dev -- --host 0.0.0.0
```

The dev server starts on port 4321 by default. If that port is in use, Astro will auto-increment (e.g., 4322). Check the terminal output for the actual port.

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:4321) |
| `npm run build` | Production build to `./dist/` |
| `npm test` | Run Vitest unit tests |

## Bilingual Routing

- German (default): `/` — no prefix
- English: `/en/` — prefixed
- Translation files: `src/i18n/de.ts` and `src/i18n/en.ts`
- The `useTranslations(lang)` function returns a `t(key)` lookup
- Language toggle in the header persists preference via `localStorage`
- Note: `localStorage` preference may cause automatic redirects when testing — clear localStorage or use incognito if locale switching seems broken

## Testing Approach

### What to Verify for UI Components

1. **Content correctness**: Check exact translated strings on both `/` (DE) and `/en/` (EN)
2. **Responsive layout**: Test at 1280px (desktop) and 375px (mobile) viewports
3. **No overflow**: Ensure no horizontal scrollbar at any viewport width
4. **Anchor links**: Verify `href="#section"` links scroll to the correct section and update URL hash

### Responsive Testing via DevTools

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set width to 375px for mobile testing
4. Navigate to the page under test and verify layout

### Component Architecture

- Pages are in `src/pages/` (DE) and `src/pages/en/` (EN)
- Components are in `src/components/`
- Shared layout: `src/layouts/Layout.astro` — wraps content in `<main>` with Header and Footer
- Styles: Tailwind CSS v4 via `@import "tailwindcss"` in `src/styles/global.css`

## Devin Secrets Needed

None — this is a static site with no external API dependencies.
