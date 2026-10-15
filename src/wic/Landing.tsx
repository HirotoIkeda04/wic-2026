"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { WicHeader } from "./WicHeader";
import { WicPage } from "./WicPage";
import { NAV, SITE, WIC_IMAGES } from "./data";
import { startHero } from "./hero";

const sponsors = [
  { src: WIC_IMAGES.logos.ibkr, alt: "Interactive Brokers", pw: 491, ph: 80, w: 6.2, y: "-0.16em" },
  { src: WIC_IMAGES.logos.tradingview, alt: "TradingView", pw: 1200, ph: 157, w: 5.3, y: "0.055em" },
  { src: WIC_IMAGES.logos.webull, alt: "Webull Securities", pw: 1200, ph: 225, w: 3.74 },
  { src: WIC_IMAGES.logos.okayasu, alt: "Okayasu Shoji Co., Ltd.", pw: 508, ph: 99, w: 5.0 },
  { src: WIC_IMAGES.logos.nsj, alt: "Nihon Securities Journal", pw: 568, ph: 139, w: 4.2 },
];

/* The two division tiles on the poster; both open the Divisions page */
const divisions = [
  { name: "Trader division", line: "You trade.", team: "Teams of 3", long: "Each member trades their own $1M demo account in TWS.", href: "/divisions/" },
  { name: "AI Agent division", line: "Your agent trades.", team: "Teams of 1–3", long: "Build an agent that trades by itself, with an LLM in the loop.", href: "/divisions/" },
];

/* Photos for the five small circles, in NAV order */
const photos = NAV.map((n) => WIC_IMAGES.circles[n.slug]);

const blurb = "m-0 text-[0.86rem] leading-[1.5] text-wic-muted [text-wrap:pretty] [&+p]:mt-[0.55em] [&_b]:text-wic-ink";
const more =
  "pointer-events-auto mt-[0.9em] inline-flex items-center gap-2 rounded-full border border-wic-paper/55 px-4 py-2 text-[0.82rem] text-wic-ink no-underline hover:border-wic-ink";

const blurbs: Record<string, React.ReactNode> = {
  divisions: (
    <>
      <p className={blurb}><b>Trader</b> — teams of three, each member trading their own $1M account.</p>
      <p className={blurb}><b>AI Agent</b> — teams of one to three build an agent that trades by itself.</p>
      <p className={blurb}>You can enter both.</p>
    </>
  ),
  rules: (
    <>
      <p className={blurb}>Nasdaq stocks, ETFs and options on a demo account, with leverage and short selling.</p>
      <p className={blurb}>Fall <b>20% from your peak</b> and you are out.</p>
    </>
  ),
  scoring: (
    <>
      <p className={blurb}>Returns count for <b>70%</b>, your investment report for <b>30%</b>. Reports are scored by external judges.</p>
      <p className={blurb}>The top teams in each division and the best individual trader share <b>$10,000</b> in prizes.</p>
    </>
  ),
  schedule: (
    <dl className="m-0 grid grid-cols-[max-content_1fr] gap-x-[0.9em] gap-y-[0.3em] text-[0.86rem] leading-[1.4] [&_dd]:m-0 [&_dd]:text-wic-muted [&_dt]:font-semibold [&_dt]:text-wic-ink [&_dt]:tabular-nums">
      <dt>Dec 7</dt><dd>Opening ceremony</dd>
      <dt>Jan 4</dt><dd>Trading begins</dd>
      <dt>Feb 1</dt><dd>AI Agent trading begins</dd>
      <dt>Mar 25</dt><dd>Trading ends</dd>
      <dt>Mar 31</dt><dd>Reports due</dd>
    </dl>
  ),
  past: (
    <>
      <p className={blurb}>Last year, <b>16 universities from 9 countries</b> took part.</p>
      <p className={blurb}>See the full results and the winning teams of WIC2025 and WIC2024.</p>
    </>
  ),
};

/**
 * Landing page: a WebGL metaball scene (hero.ts) with the poster rendered as
 * HTML and clipped to the big circle, plus one heading and blurb per small
 * circle that the animation positions every frame.
 */
export function Landing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = startHero(canvasRef.current!, photos);
    const brand = document.querySelector<HTMLAnchorElement>("[data-brand]");
    const toTop = (e: Event) => { e.preventDefault(); hero?.toTop(); };
    brand?.addEventListener("click", toTop);
    return () => brand?.removeEventListener("click", toTop);
  }, []);

  return (
    <WicPage tone="dark">
      <WicHeader />
      <canvas ref={canvasRef} id="gl" className="fixed inset-0 block h-full w-full" />

      {/* Poster: HTML content clipped to the big circle by the animation.
          A printed notice: the key facts and the ceremony photo (cut out to the
          people) on an orange sheet, two orange division tiles, a white band for
          the sponsors. The fixed WicHeader sits in the space at the top. */}
      <section className="wic-poster" id="poster" aria-label="World Investment Competition 2026">
        <div className="p-in" id="pIn">
          <div className="c-sheet">
            <div className="c-hdr" aria-hidden="true" />
            <div className="c-top">
              <div className="c-ttl">
                <h1 className="c-name">World Investment<br />Competition 2026</h1>
                <p className="c-sub">The Investment Olympics. University teams.</p>
              </div>
              <div className="c-due">
                <span className="c-lbl">Entries close</span>
                <div className="c-date">
                  <span className="num">11.15</span>
                  <span className="dow" aria-label="Sunday"><span>S</span><span>U</span><span>N</span></span>
                </div>
              </div>
            </div>
            <div className="c-panel c-paper">
              <dl className="c-stats">
                <div><dt className="c-lbl">Entry fee</dt><dd className="v">Free</dd><dd className="s">Undergrad &amp; grad students</dd></div>
                <div><dt className="c-lbl">Prizes</dt><dd className="v">$10,000</dd><dd className="s">incl. flights to Japan</dd></div>
                <div><dt className="c-lbl">Trading period</dt><dd className="v">Jan–Mar</dd><dd className="s">2027 · awards on Apr 22</dd></div>
              </dl>
              <div className="c-scene">
                <img
                  className="c-people"
                  src={WIC_IMAGES.people}
                  width={1600}
                  height={606}
                  alt="WIC2025 awards ceremony: the winning teams, judges and sponsors"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
          <nav className="c-tiles" aria-label="Divisions">
            {divisions.map((d) => (
              <a className="c-tile c-paper" href={d.href} key={d.name}>
                <span className="nm">{d.name}</span>
                <span className="rt">
                  <span className="tx"><b>{d.line}</b><span>{d.team}</span><span>U.S. stock demo trading</span><span className="long">{d.long}</span></span>
                  <span className="ar" aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </nav>
          <div className="c-strip">
            <div className="c-spons-wrap">
              <span className="c-zab">Sponsors</span>
              <ul className="c-spons" aria-label="Sponsors">
                {sponsors.map((s) => (
                  <li key={s.alt}>
                    <img src={s.src} alt={s.alt} width={s.pw} height={s.ph} style={{ "--w": s.w, "--y": s.y } as CSSProperties} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="c-org"><span className="c-zab">Organizer</span><p className="c-by">{SITE.organizer}</p></div>
          </div>
          <div className="p-dim" id="pDim" aria-hidden="true" />
        </div>
      </section>

      {/* Only exists to give the page scroll height for the animation */}
      <div className="track h-[509.4vh]" />

      {/* Heading beside the big circle after zoom-out */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-20 text-wic-paper opacity-0 will-change-[transform,opacity] [text-shadow:0_0_0.5em_rgb(0_0_0/0.6)]"
        id="heroLabel"
      >
        <h2 className="m-0 whitespace-nowrap font-semibold leading-[1.05] tracking-[-0.02em]">World Investment<br />Competition 2026</h2>
        <p className="mt-[0.55em] text-base text-wic-paper/75">The Investment Olympics.</p>
      </div>

      {/* One heading + blurb per small circle; hero.ts positions them every frame */}
      <div id="sections">
        {NAV.map((item) => (
          <section className="sec" data-slug={item.slug} key={item.slug}>
            <div className="title pointer-events-none fixed left-0 top-0 z-20 origin-top-left text-wic-paper opacity-0 will-change-[transform,opacity] [text-shadow:0_0_0.4em_rgb(0_0_0/0.35)]">
              <h2 className="m-0 text-[1em] font-semibold leading-[1.02] tracking-[-0.02em]">{item.label}</h2>
            </div>
            <div className="note pointer-events-none fixed left-0 top-0 z-20 opacity-0 will-change-[transform,opacity]">
              {blurbs[item.slug]}
              <a className={more} href={item.href}>Read more <span aria-hidden="true">→</span></a>
            </div>
          </section>
        ))}
      </div>

      <p className="fixed inset-0 hidden place-items-center p-8 text-center" id="error">
        This browser does not support WebGL, so the animation cannot be shown.
      </p>
    </WicPage>
  );
}
