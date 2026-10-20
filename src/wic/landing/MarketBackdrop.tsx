"use client";

import { useEffect, useRef } from "react";

/**
 * The same made-up price series drawn two ways, for the two division cards:
 * "chart" as thin candlesticks (how a trader reads the market), "ascii" as
 * columns of characters with two lines of an agent's log under them (how an
 * agent reads it). Both draw themselves from left to right in a loop while on
 * screen; with reduced motion they show the finished drawing.
 *
 * Fills its positioned parent and draws in `ink` ("r,g,b"); the default
 * assumes the dark landing page.
 */

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (x: number) => Math.min(1, Math.max(0, x));

// 120 daily candles from a seeded random walk; both cards draw this one series
type Candle = { o: number; h: number; l: number; c: number };
const SERIES: Candle[] = (() => {
  const r = mulberry32(7);
  const out: Candle[] = [];
  let p = 132;
  for (let i = 0; i < 120; i++) {
    const drift = Math.sin(i / 17) * 0.35 + 0.06;
    const o = p, c = o + drift + (r() - 0.5) * 2.6;
    out.push({ o, c, h: Math.max(o, c) + r() * 1.2, l: Math.min(o, c) - r() * 1.2 });
    p = c;
  }
  return out;
})();
const LO = Math.min(...SERIES.map((d) => d.l));
const HI = Math.max(...SERIES.map((d) => d.h));

/** Share of the series drawn at time t: 8.5 s to draw, then hold, on an 11 s loop. */
const reveal = (t: number, still: boolean) => (still ? 1 : clamp((t % 11) / 8.5));

/** Example lines of an agent's log; not real trades. */
const LOG = [
  ["read", "NVDA 132.41  vol 1.8M"],
  ["model", "momentum fading, hold"],
  ["read", "NVDA 131.96  vol 2.4M"],
  ["order", "sell 40 NVDA @ 131.94"],
  ["fill", "40 @ 131.94"],
  ["model", "drawdown 3.1%, within limit"],
];

type Ctx = { g: CanvasRenderingContext2D; w: number; h: number; ink: string };

function drawChart({ g, w, h, ink: INK }: Ctx, t: number, still: boolean) {
  g.clearRect(0, 0, w, h);
  const top = 14, bot = h - 12, x0 = 4, x1 = w - 4;
  const n = Math.max(2, Math.floor(reveal(t, still) * SERIES.length));
  const y = (v: number) => bot - ((v - LO) / (HI - LO)) * (bot - top);
  const step = (x1 - x0) / SERIES.length;
  g.lineWidth = 1;
  g.strokeStyle = `rgba(${INK},0.06)`;
  for (let i = 0; i <= 4; i++) {
    const yy = Math.round(top + ((bot - top) * i) / 4) + 0.5;
    g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke();
  }
  const bw = Math.max(1, step * 0.62);
  for (let i = 0; i < n; i++) {
    const d = SERIES[i], cx = Math.round(x0 + step * (i + 0.5)) + 0.5, up = d.c >= d.o;
    const yTop = y(Math.max(d.o, d.c)), yBot = y(Math.min(d.o, d.c)), bh = Math.max(1, yBot - yTop);
    g.strokeStyle = `rgba(${INK},${up ? 0.75 : 0.45})`;
    if (up) {
      // Hollow body; the wick stops at its edges
      g.beginPath(); g.moveTo(cx, y(d.h)); g.lineTo(cx, yTop); g.moveTo(cx, yTop + bh); g.lineTo(cx, y(d.l)); g.stroke();
      g.strokeRect(cx - bw / 2, yTop, bw, bh);
    } else {
      g.beginPath(); g.moveTo(cx, y(d.h)); g.lineTo(cx, y(d.l)); g.stroke();
      g.fillStyle = `rgba(${INK},0.45)`;
      g.fillRect(cx - bw / 2, yTop, bw, bh);
    }
  }
  const last = SERIES[n - 1].c, ly = Math.round(y(last)) + 0.5;
  g.setLineDash([3, 4]); g.strokeStyle = `rgba(${INK},0.35)`;
  g.beginPath(); g.moveTo(x0, ly); g.lineTo(x1, ly); g.stroke(); g.setLineDash([]);
  g.font = `500 11px ${MONO}`; g.fillStyle = `rgba(${INK},0.8)`; g.textAlign = "right"; g.textBaseline = "alphabetic";
  g.fillText(last.toFixed(2), x1 - 2, ly - 6);
}

function drawAscii({ g, w, h, ink: INK }: Ctx, t: number, still: boolean) {
  g.clearRect(0, 0, w, h);
  g.font = `500 12px ${MONO}`; g.textBaseline = "top"; g.textAlign = "left";
  const cw = Math.max(6, g.measureText("0").width), ch = 15, logH = 40;
  const x0 = 4, y0 = 10;
  const cols = Math.floor((w - 8) / cw), rows = Math.max(4, Math.floor((h - logH - y0 - 4) / ch));
  const vis = Math.max(1, Math.floor(reveal(t, still) * cols));
  const blocks = "▁▂▃▄▅▆▇█";
  for (let c = 0; c < cols; c++) {
    const d = SERIES[Math.min(SERIES.length - 1, Math.floor((c / cols) * SERIES.length))];
    const hv = ((d.c - LO) / (HI - LO)) * rows, full = Math.floor(hv);
    for (let r = 0; r < rows; r++) {
      const xx = x0 + c * cw, yy = y0 + (rows - 1 - r) * ch;
      if (c < vis && r < full) {
        g.fillStyle = `rgba(${INK},${c === vis - 1 ? 0.5 : 0.22})`; g.fillText(":", xx, yy);
      } else if (c < vis && r === full) {
        g.fillStyle = `rgba(${INK},0.92)`; g.fillText(blocks[Math.min(7, Math.floor((hv - full) * 8))], xx, yy);
      } else if (r % 3 === 0) {
        g.fillStyle = `rgba(${INK},0.06)`; g.fillText("·", xx, yy);
      }
    }
  }
  // Two lines of the agent's log under the columns, the newer one brighter
  const k = still ? 1 : Math.floor(t / 1.6);
  g.font = `400 11px ${MONO}`;
  for (let j = 0; j < 2; j++) {
    const [verb, msg] = LOG[(k + j) % LOG.length];
    const sec = String(2 + (((k + j) * 3) % 57)).padStart(2, "0");
    g.fillStyle = `rgba(${INK},${j === 1 ? 0.85 : 0.4})`;
    g.fillText(`14:31:${sec}  ${verb.padEnd(5)}  ${msg}`, x0, y0 + rows * ch + 6 + j * 17);
  }
}

export function MarketBackdrop({ mode, ink = "242,242,242" }: { mode: "chart" | "ascii"; ink?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = mode === "chart" ? drawChart : drawAscii;
    const cv = document.createElement("canvas");
    cv.className = "block size-full";
    box.appendChild(cv);
    let ctx: Ctx | null = null, raf = 0, visible = false;
    const t0 = performance.now();

    const size = () => {
      const r = box.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
      const g = cv.getContext("2d")!;
      g.setTransform(d, 0, 0, d, 0, 0);
      ctx = { g, w: r.width, h: r.height, ink };
    };
    const frame = (now: number) => {
      if (!ctx) size();
      draw(ctx!, (now - t0) / 1000, false);
      raf = requestAnimationFrame(frame);
    };
    const ro = new ResizeObserver(() => {
      size();
      if (still || !visible) draw(ctx!, 0, true);
    });
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(frame);
    });
    io.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.remove();
    };
  }, [mode, ink]);

  return <div ref={boxRef} aria-hidden="true" className="absolute inset-0" />;
}
