# World Investment Competition 2026

Site for WIC 2026, a university stock-trading competition hosted by the Japan Students Investment Union (JPSI).
This repository is a portfolio mirror served at <https://wic.ihiro.page>; the official site will live on JPSI's domain.

## Stack

- React 19 components (TSX) + [Tailwind CSS v4](https://tailwindcss.com), copied from the JPSI site
  (jpsi-web `components/wic/`), which is the source of truth for <https://jpsi-association.com/wic>
- [Astro](https://astro.build) as the static shell for this mirror (head metadata, routing, build)
- Inter, self-hosted through `@fontsource-variable/inter`
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`

## Structure

```
src/
  wic/          WIC page components (React + Tailwind, no Astro or Next APIs)
    Landing.tsx   the landing page; its sections live in landing/
    landing/      Hero, Prize (SlotNumber), LastYear (Globe), Divisions, RulesGlance, ScheduleSection
    DetailPage.tsx, pages/   the five detail pages (bodies copied from jpsi-web)
    routes.tsx  mirror-only: page trees and head copy without Next's metadata API
    data.ts     JPSI_URL, contact address and root-level wicHref are mirror edits
  pages/        index.astro and [page].astro (one route per NAV slug)
  layouts/      Base.astro (document head; canonical points to jpsi-association.com/wic)
public/images/  the images the WIC pages use, copied from jpsi-web
```

The landing page is being redesigned here first (plain scrolling sections, with
a rolling $10,000 in the prize heading and a Three.js globe of the WIC2025 universities), to be carried back to jpsi-web.
`scripts/land-dots.mjs` regenerates the globe's land dots (`src/wic/landing/land-dots.json`);
`scripts/images.mjs` regenerates the derived images (the photo helix's 900px WebP textures and the favicon).
The poster WebPs and 480px logos in `public/images/wic/2026` are the files jpsi-web serves (branch wic/image-weight).

## Develop

```bash
npm install
npm run dev
```
