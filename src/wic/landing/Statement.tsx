"use client";

import { useEffect, useRef } from "react";
import { SITE } from "../data";
import { pick, type WicLang } from "../lang";

/**
 * The one-sentence description of the competition, held in the middle of
 * the screen on black while photos from WIC2025 drift past behind it. Each
 * layer moves at its own rate as the page scrolls: the faint backdrop
 * slowest, the photos faster.
 */

type Layer = { src: string; speed: number; className: string };

/**
 * Each photo is about a quarter of the section tall, stacked so that neighbours
 * almost touch; their different speeds open and close the gaps as you scroll.
 * The first one sits above the section by as much as the parallax pushes it
 * down while the section scrolls in (its speed × the viewport height), so
 * its top edge meets the section's top edge just as the section appears.
 */
const PHOTOS: Layer[] = [
  { src: "/images/wic/wic2025-closing-ceremony.jpg", speed: 0.28, className: "left-[-8%] top-[-28%] w-[78%] sm:left-[4%] sm:w-[42%]" },
  { src: "/images/wic/wic2025-champions-lmu.jpg", speed: 0.36, className: "right-[-10%] top-[1%] w-[66%] sm:right-[6%] sm:w-[30%]" },
  { src: "/images/wic/wic2025-lmu-japan-trip.jpg", speed: 0.3, className: "left-[-2%] top-[30%] w-[74%] sm:left-[12%] sm:w-[38%]" },
  { src: "/images/hero-background.jpg", speed: 0.38, className: "right-[-8%] top-[59%] w-[76%] sm:right-[10%] sm:w-[40%]" },
];

/** The backdrop: a blurred, very dark photo that barely moves. */
const BACKDROP_SPEED = 0.12;

export function Statement({ lang }: { lang: WicLang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current!;
    let raf = 0;
    function update() {
      raf = 0;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the section's centre is at the viewport's centre; ±1 a screen away
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      layerRefs.current.forEach((el) => {
        if (!el) return;
        const speed = Number(el.dataset.speed);
        el.style.transform = `translate3d(0, ${(p * vh * speed).toFixed(1)}px, 0)`;
      });
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate overflow-clip bg-[#0c0b0b]" aria-label={pick(lang, "About the competition", "大会について")}>
      {/* Backdrop */}
      <div
        ref={(el) => { layerRefs.current[0] = el; }}
        data-speed={BACKDROP_SPEED}
        aria-hidden="true"
        className="absolute inset-[-25%_0] -z-10 bg-cover bg-center opacity-25 blur-2xl will-change-transform"
        style={{ backgroundImage: "url(/images/wic/wic2025-closing-ceremony.jpg)" }}
      />

      {/* Photos */}
      {PHOTOS.map((ph, i) => (
        <div
          key={ph.src}
          ref={(el) => { layerRefs.current[i + 1] = el; }}
          data-speed={ph.speed}
          aria-hidden="true"
          className={`absolute -z-10 h-[26%] will-change-transform ${ph.className}`}
        >
          <img src={ph.src} alt="" loading="lazy" className="block size-full object-cover brightness-[0.45]" />
        </div>
      ))}

      {/* Film grain over the backdrop and photos (--wic-noise in wic.css) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.2] [background-image:var(--wic-noise)] [background-size:180px]"
      />

      <div className="h-[100svh]">
        <div className="flex h-full items-center justify-center px-6">
          <p className="m-0 max-w-[22em] text-center text-[clamp(1.15rem,3.6vw,1.9rem)] font-semibold leading-[2] tracking-[-0.01em] text-[#f2f2f2] [text-shadow:0_0_24px_rgb(0_0_0/0.6)] [text-wrap:balance]">
            {SITE.lead[lang]}
          </p>
        </div>
      </div>
    </section>
  );
}
