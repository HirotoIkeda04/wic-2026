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
  wic/          copy of jpsi-web components/wic/ (minus Next-only files)
    routes.tsx  mirror-only: page trees and head copy without Next's metadata API
    data.ts     JPSI_URL, contact address and root-level wicHref are mirror edits
  pages/        index.astro and [page].astro (one route per NAV slug)
  layouts/      Base.astro (document head; canonical points to jpsi-association.com/wic)
public/images/  the images the WIC pages use, copied from jpsi-web
```

To resync, copy jpsi-web's `components/wic/` and `public/images/wic/` over these, then
reapply the mirror edits (`git diff` against the copy shows them).

## Develop

```bash
npm install
npm run dev
```
