"use client";

import { useEffect, useRef } from "react";

/**
 * A figure set inline in running text (e.g. "$10,000") whose characters roll
 * like slot reels as the page scrolls: blank while the figure is low in the
 * viewport, settling on their digits from the rightmost one as it rises, and
 * rolling back when scrolling up. Server HTML, reduced motion and screen
 * readers get the plain figure.
 */

/** Viewport heights (from the top) where the rolling starts and where every reel has settled */
const START = 1.0;
const END = 0.45;
/** Share of the scroll range each reel spends rolling; the rest staggers the reels */
const SPAN = 0.55;

/** Cells of one reel: blank, then ten digits ending on `ch`, or just `ch`. */
function cells(ch: string): string[] {
  if (!/\d/.test(ch)) return [" ", ch];
  const d = Number(ch);
  return [" ", ...Array.from({ length: 10 }, (_, k) => String((d + 1 + k) % 10))];
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function SlotNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const chars = [...value];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const reels = reelRefs.current;
    const n = reels.length;
    let raf = 0;

    function update() {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      // 0 when the figure enters at the bottom, 1 once it is up at END
      const p = Math.min(1, Math.max(0, (START * vh - top) / ((START - END) * vh)));
      reels.forEach((reel, i) => {
        if (!reel) return;
        const order = n - 1 - i; // rightmost reel first
        const from = n > 1 ? (order / (n - 1)) * (1 - SPAN) : 0;
        const local = Math.min(1, Math.max(0, (p - from) / SPAN));
        const last = reel.childElementCount - 1;
        reel.style.transform = `translateY(${-(easeOut(local) * last).toFixed(3)}lh)`;
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
    <span ref={ref} className="whitespace-nowrap">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex tabular-nums">
        {chars.map((ch, i) => {
          const strip = cells(ch);
          return (
            <span key={i} className="inline-block h-[1lh] overflow-hidden">
              {/* Server HTML shows the settled figure; the effect takes over on the client */}
              <span
                ref={(r) => { reelRefs.current[i] = r; }}
                className="flex flex-col will-change-transform"
                style={{ transform: `translateY(${-(strip.length - 1)}lh)` }}
              >
                {strip.map((c, k) => (
                  <span key={k} className="block h-[1lh]">{c}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
