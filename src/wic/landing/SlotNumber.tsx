"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure set inline in running text (e.g. "$10,000") whose characters roll
 * into place like slot reels, starting from the rightmost one, the first time
 * it scrolls into view. Server HTML, reduced motion and screen readers get
 * the plain figure.
 */

const STEP = 90;       // ms between one reel stopping and the next one to its left
const DURATION = 900;  // ms per reel

/** Cells of one reel: blank, then ten digits ending on `ch`, or just `ch`. */
function cells(ch: string): string[] {
  if (!/\d/.test(ch)) return [" ", ch];
  const d = Number(ch);
  return [" ", ...Array.from({ length: 10 }, (_, k) => String((d + 1 + k) % 10))];
}

export function SlotNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // "done": the plain figure; "armed": reels at the blank cell; "run": rolling
  const [phase, setPhase] = useState<"done" | "armed" | "run">("done");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Let the armed state paint before the transition starts
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase("run")));
      },
      { threshold: 1 },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  const chars = [...value];
  return (
    <span ref={ref} className="whitespace-nowrap">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex tabular-nums">
        {chars.map((ch, i) => {
          const strip = cells(ch);
          const at = phase === "armed" ? 0 : strip.length - 1;
          const delay = (chars.length - 1 - i) * STEP;
          return (
            <span key={i} className="inline-block h-[1lh] overflow-hidden">
              <span
                className="flex flex-col"
                style={{
                  transform: `translateY(${-at}lh)`,
                  transition: phase === "run" ? `transform ${DURATION}ms cubic-bezier(0.2, 0.75, 0.25, 1) ${delay}ms` : "none",
                }}
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
