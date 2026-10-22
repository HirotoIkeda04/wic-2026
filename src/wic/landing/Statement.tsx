import type { ReactNode } from "react";
import { SITE } from "../data";
import { pick, type WicLang } from "../lang";

/**
 * The one-sentence description of the competition, in the middle of the
 * screen, inside a vortex of photos from past editions (PhotoVortex). Trial:
 * the same eight photos repeat around the helix.
 */

/** 900px WebP copies of the photos (scripts/images.mjs makes them from the
 *  originals): they are WebGL textures a few hundred pixels across, and every
 *  browser that runs WebGL also decodes WebP. */
export const STATEMENT_PHOTOS = [
  "/images/wic/wic2025-closing-ceremony-900.webp",
  "/images/wic/wic2025-champions-lmu-900.webp",
  "/images/wic/team-dressed-up-900.webp",
  "/images/hero-background-900.webp",
  "/images/wic/wic2025-trader-award-tum-900.webp",
  "/images/wic/wic2025-sponsor-interactive-brokers-900.webp",
  "/images/wic/wic2025-sponsor-nsj-900.webp",
  "/images/wic/wic2025-trader-award-comment-900.webp",
];

/** `vortex`: the PhotoVortex island, given STATEMENT_PHOTOS. */
export function Statement({ lang, vortex }: { lang: WicLang; vortex: ReactNode }) {
  return (
    <section className="relative isolate overflow-clip bg-[#0c0b0b]" aria-label={pick(lang, "About the competition", "大会について")}>
      {vortex}

      {/* Darken behind the sentences (set a little above the middle) so they read over the photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_44%,rgb(12_11_11/0.75),rgb(12_11_11/0)_100%)]"
      />

      {/* Film grain (--wic-noise in wic.css) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:var(--wic-noise)] [background-size:180px]"
      />

      <div className="relative flex h-[115svh] flex-col items-center justify-center gap-[2em] px-6 pb-[14svh] text-[clamp(1.15rem,3.6vw,1.9rem)]">
        <p className="m-0 max-w-[22em] text-center font-semibold leading-[2.25] tracking-[-0.01em] text-[#f2f2f2] [text-shadow:0_0_24px_rgb(0_0_0/0.6)] [text-wrap:balance]">
          {SITE.lead[lang]}
        </p>
        <p className="m-0 max-w-[22em] text-center font-semibold leading-[2.25] tracking-[-0.01em] text-[#f2f2f2] [text-shadow:0_0_24px_rgb(0_0_0/0.6)] [text-wrap:balance]">
          {pick(
            lang,
            "This year, the Trader division is joined by a new AI Agent division.",
            "今年はトレーダー部門に加え、AIエージェント部門を新設する。",
          )}
        </p>
      </div>
    </section>
  );
}
