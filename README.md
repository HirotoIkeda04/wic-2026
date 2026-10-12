# World Investment Competition 2026

Site for WIC 2026, a university stock-trading competition hosted by the Japan Students Investment Union (JPSI).
This repository is a portfolio mirror served at <https://wic.ihiro.page>; the official site will live on JPSI's domain.

## Stack

- [Astro](https://astro.build) (static output, zero client JS except the landing animation and the menu)
- [Tailwind CSS v4](https://tailwindcss.com) via the Vite plugin, with light/dark tone tokens in `src/styles/global.css`
- Inter, self-hosted through `@fontsource-variable/inter`
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`

## Structure

```
src/
  pages/        one .astro file per page
  layouts/      Base (head, header, nav) and Detail (text pages)
  components/   SiteHeader, Pager, Callout
  data/site.ts  navigation, schedule, organizer details
  scripts/      landing-page WebGL animation
  assets/       photos and sponsor logos (optimized at build time)
```

## Develop

```bash
npm install
npm run dev
```
