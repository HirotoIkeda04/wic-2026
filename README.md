# World Investment Competition 2026

Site for WIC 2026, a university stock-trading competition hosted by the Japan Students Investment Union (JPSI).
This repository is a portfolio mirror served at <https://wic.ihiro.page>; the official site will live on JPSI's domain.

## Stack

- React 19 components (TSX) + [Tailwind CSS v4](https://tailwindcss.com), written to drop into the
  JPSI site (Next.js). See [HANDOFF.md](HANDOFF.md).
- [Astro](https://astro.build) as the static shell for this mirror (head metadata, routing, build)
- Inter, self-hosted through `@fontsource-variable/inter`
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`

## Structure

```
src/
  wic/          everything that moves to the Next.js site
    Landing.tsx, DetailPage.tsx, WicHeader.tsx, WicPage.tsx, Pager.tsx, Callout.tsx
    pages/      Divisions, Rules, Scoring, Schedule, Past (page bodies + meta)
    hero.ts     landing-page WebGL animation (framework-free)
    data.ts     navigation, schedule, organizer details, image paths
    wic.css     tone tokens, article styles, poster layout
  pages/        thin .astro wrappers, one per route
  layouts/      Base.astro (document head)
public/images/wic/2026/   photos and sponsor logos
```

## Develop

```bash
npm install
npm run dev
```
