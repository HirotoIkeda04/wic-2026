import { DetailPage } from "./DetailPage";
import { Landing } from "./Landing";
import { NAV, SITE, WIC_IMAGES, wicHref, type WicSlug } from "./data";
import type { WicLang } from "./lang";
import { DETAIL_PAGES } from "./pages";

// The mirror's stand-in for the JPSI site's components/wic/routes.tsx: the same
// page trees and head copy, without Next's metadata API. Only English is built,
// as on the JPSI site, where /wic/ja is a dev-only review copy.

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

export function WicLanding({ lang }: { lang: WicLang }) {
  return <Landing lang={lang} />;
}

/** One island per page, so interactive bodies (the 2025 judges) hydrate too. */
export function WicDetail({ lang, page }: { lang: WicLang; page: WicSlug }) {
  const { meta, Body } = DETAIL_PAGES[page];
  return (
    <DetailPage slug={page} lang={lang} {...meta[lang]}>
      <Body lang={lang} />
    </DetailPage>
  );
}
