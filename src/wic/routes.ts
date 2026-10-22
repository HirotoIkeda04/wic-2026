import { NAV, SITE, WIC_IMAGES, wicHref, type WicSlug } from "./data";
import type { WicLang } from "./lang";
import { DETAIL_PAGES } from "./pages";

// The mirror's stand-in for the JPSI site's components/wic/metadata.ts: the same
// head copy, without the site's metadata helpers. Only English is built, as on
// the JPSI site, where /wic/ja is a dev-only review copy. The pages themselves
// are composed in src/pages, as sites/association does on the JPSI site.

export type WicHead = { title: string; description: string; path: string };

export const WIC_SLUGS = NAV.map(({ slug }) => slug);

export const OG_IMAGE = WIC_IMAGES.hero;

export function landingHead(lang: WicLang): WicHead {
  return { title: "World Investment Competition 2026 | JPSI", description: SITE.description[lang], path: wicHref(lang) };
}

export function detailHead(lang: WicLang, slug: WicSlug): WicHead {
  const { title, lead } = DETAIL_PAGES[slug].meta[lang];
  return { title: `${title} — World Investment Competition 2026 | JPSI`, description: lead, path: wicHref(lang, slug) };
}
