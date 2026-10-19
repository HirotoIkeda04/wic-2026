import { SITE } from "../data";
import { pick, type WicLang } from "../lang";
import { PhotoVortex } from "./PhotoVortex";

/**
 * The one-sentence description of the competition, in the middle of the
 * screen, inside a vortex of photos from past editions (PhotoVortex). Trial:
 * the same four photos repeat around the helix.
 */

const PHOTOS = [
  "/images/wic/wic2025-closing-ceremony.jpg",
  "/images/wic/wic2025-champions-lmu.jpg",
  "/images/wic/team-dressed-up.jpg",
  "/images/hero-background.jpg",
];

export function Statement({ lang }: { lang: WicLang }) {
  return (
    <section className="relative isolate overflow-clip bg-[#0c0b0b]" aria-label={pick(lang, "About the competition", "大会について")}>
      <PhotoVortex photos={PHOTOS} />

      {/* Darken the middle so the sentence reads over the photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(12_11_11/0.75),rgb(12_11_11/0)_100%)]"
      />

      {/* Film grain (--wic-noise in wic.css) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:var(--wic-noise)] [background-size:180px]"
      />

      <div className="relative flex h-[90svh] items-center justify-center px-6">
        <p className="m-0 max-w-[22em] text-center text-[clamp(1.15rem,3.6vw,1.9rem)] font-semibold leading-[2] tracking-[-0.01em] text-[#f2f2f2] [text-shadow:0_0_24px_rgb(0_0_0/0.6)] [text-wrap:balance]">
          {SITE.lead[lang]}
        </p>
      </div>
    </section>
  );
}
