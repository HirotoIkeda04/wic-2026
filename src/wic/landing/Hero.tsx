import type { CSSProperties, ReactNode } from "react";
import { WIC_IMAGES } from "../data";
import { pick, type WicLang } from "../lang";

/** `w` is the display width in em; `y` nudges the baseline. */
const sponsors: { src: string; width: number; height: number; alt: string; w: number; y?: string }[] = [
  { ...WIC_IMAGES.logos.ibkr, alt: "Interactive Brokers", w: 6.2, y: "-0.16em" },
  { ...WIC_IMAGES.logos.tradingview, alt: "TradingView", w: 5.3, y: "0.055em" },
];

/**
 * The photo's shade, as on the JPSI site's WIC poster (.p-stage::before in
 * components/wic/wic.css): dark at the top behind the header, clear through the
 * middle where the people stand, then into the black under the photo.
 */
const PHOTO_FADE =
  "linear-gradient(to bottom, rgb(0 0 0 / 0.78) 0%, rgb(0 0 0 / 0.35) 38%, rgb(0 0 0 / 0) 58%, rgb(0 0 0 / 0) 72%, rgb(12 11 11 / 0.75) 90%, #0c0b0b 100%)";

/** Black into the paper colour of the sponsor strip, eased at both ends (a cosine curve). */
const STRIP_FADE = `linear-gradient(to bottom, ${Array.from({ length: 17 }, (_, i) => {
  const t = i / 16;
  const a = 0.5 + 0.5 * Math.cos(Math.PI * t); // 1 → 0, flat at both ends
  const mix = (dark: number, light: number) => Math.round(light + (dark - light) * a);
  return `rgb(${mix(12, 246)} ${mix(11, 245)} ${mix(11, 242)}) ${(100 * t).toFixed(1)}%`;
}).join(", ")})`;

/** First screen: photo, title, the deadline, and a strip with the sponsor logos. */
/** `status`: the EntryStatus island, which works out the entry phase in the browser. */
export function Hero({ lang, status }: { lang: WicLang; status: ReactNode }) {
  return (
    // The whole hero, sponsor strip included, fills exactly one screen on every
    // device: the photo takes whatever height the title and strip leave.
    <section className="flex h-svh flex-col" aria-label="World Investment Competition 2026">
      <div className="flex min-h-0 flex-1 flex-col bg-[#0c0b0b]">
        {/* The photo starts at the top, under the header, and is cropped to the
            space left, centred on the people. */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {/* The page's LCP element. Browsers that know WebP pick the smallest
              width that still covers the viewport; others take the JPEG. */}
          <picture className="contents">
            <source type="image/webp" srcSet={WIC_IMAGES.posterSrcSet} sizes="100vw" />
            <img
              src={WIC_IMAGES.hero.src}
              width={WIC_IMAGES.hero.width}
              height={WIC_IMAGES.hero.height}
              alt={pick(lang, "WIC awards ceremony: winners, judges and organizers on stage, with teams joining online on screen", "WICの表彰式。壇上に受賞者・審査員・運営、スクリーンにオンライン参加のチーム")}
              loading="eager"
              fetchPriority="high"
              className="block size-full object-cover object-[58%_30%] lg:object-[50%_60%]"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0" style={{ background: PHOTO_FADE }} />
          {/* Grain over the photo, as on the JPSI site's poster (.wic-poster::after at rest) */}
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.22] mix-blend-overlay [background-image:var(--wic-noise)] [background-size:220px]" />
        </div>
        <div className="relative mx-auto w-full max-w-[72rem] px-5 pb-3 text-[#f2f2f2] sm:px-8 sm:pb-5">
          {/* Warm gold like the stage lights, lighter towards the bottom, with a faint glow.
              drop-shadow, not text-shadow: the fill is a background clipped to the text. */}
          <h1 className="mx-0 -mt-[1.1em] mb-0 bg-[linear-gradient(to_bottom,#dcb06a_0%,#e5c48d_45%,#efe2c9_100%)] bg-clip-text text-[clamp(2.6rem,9vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-transparent [filter:drop-shadow(0_0_6px_rgb(230_186_112/0.35))]">
            World
            <br />
            Investment
            <br />
            Competition <span className="font-light">2026</span>
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem]">
            {status}
            <span className="text-[#f2f2f2]/70">{pick(lang, "Free to enter · Undergrad & grad students", "参加費無料・大学生／大学院生")}</span>
          </p>
        </div>
      </div>

      {/* Black to paper, with grain (--wic-noise in wic.css) so the change of tone has no clean edge */}
      <div aria-hidden="true" className="relative z-10 -mb-px h-6 sm:h-8" style={{ background: STRIP_FADE }}>
        {/* The grain is strongest mid-way and fades out at both ends, so it leaves no seam */}
        <div className="absolute inset-0 opacity-50 [background-image:var(--wic-noise)] [background-size:160px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]" />
      </div>

      {/* The sponsors confirmed for 2026 so far; more may join, none will drop out. */}
      <div className="bg-[#f6f5f2] px-5 pb-5 pt-6 text-[#1d1b1b] sm:px-8 sm:pt-8 lg:pb-9 lg:pt-10">
        {/* A label, then the logos in one row: the label sits above them on phones
            and to their left from sm up. Logo widths are in em, so the dl's font
            size scales them. */}
        <dl className="mx-auto my-0 grid max-w-[72rem] grid-cols-1 items-center gap-y-4 text-[1.6rem] sm:grid-cols-[auto_1fr] sm:gap-x-8 sm:text-[1.4rem] md:text-[1.8rem] lg:text-[2.7rem]">
          <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-black/60 sm:flex sm:items-center sm:self-stretch sm:border-r sm:border-black/20 sm:pr-8 sm:normal-case sm:tracking-normal sm:text-black/70">
            {pick(lang, "Sponsors", "協賛")}
          </dt>
          <dd className="m-0 min-w-0">
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-[1.6em] gap-y-3 p-0" aria-label={pick(lang, "Sponsors", "協賛企業")}>
              {sponsors.map((s) => (
                <li key={s.alt} className="min-w-0">
                  <img
                    src={s.src}
                    width={s.width}
                    height={s.height}
                    alt={s.alt}
                    className="block h-auto w-[calc(var(--w)*0.92em)] max-w-full translate-y-(--y)"
                    style={{ "--w": s.w, "--y": s.y ?? "0" } as CSSProperties}
                  />
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>
    </section>
  );
}
