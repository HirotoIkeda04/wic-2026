"use client";

import { useEffect, useRef, useState } from "react";
import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

/**
 * Filled icons on a 24px grid, drawn in currentColor: Heroicons (solid, MIT).
 * Their weights differ a lot (the code brackets cover a quarter of the ink of the
 * clock), so each is evened out a little: thin ones get an outline in their own
 * colour (`stroke`, in grid units) and the document is drawn slightly smaller (`scale`).
 * The clock and flag are then sized by eye: the clock larger, the flag smaller.
 */
type Icon = { paths: { d: string; evenodd?: boolean }[]; scale?: number; stroke?: number };
const ICONS = {
  // Clock: the entry window
  entry: { paths: [{ d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z", evenodd: true }], scale: 1.12 },
  // Flag: opening ceremony
  opening: { paths: [{ d: "M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z", evenodd: true }], scale: 0.92 },
  // Cursor with rays: test trading
  test: { paths: [{ d: "M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Zm-8.962 3.712a.75.75 0 0 1 0 1.061l-1.591 1.591a.75.75 0 1 1-1.061-1.06l1.591-1.592a.75.75 0 0 1 1.06 0Z", evenodd: true }], stroke: 0.9 },
  // Code brackets: building the agent
  build: { paths: [{ d: "M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z", evenodd: true }], stroke: 1.1 },
  // Play: the agent's trial run
  trial: { paths: [{ d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z", evenodd: true }] },
  // Bar chart: live trading by people
  trade: { paths: [{ d: "M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" }], stroke: 0.35 },
  // Chip: live trading by agents
  agent: { paths: [{ d: "M16.5 7.5h-9v9h9v-9Z" }, { d: "M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z", evenodd: true }], stroke: 0.15 },
  // Document: reports
  report: { paths: [{ d: "M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z", evenodd: true }, { d: "M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" }], scale: 0.94 },
  // Trophy: closing and awards ceremony
  awards: { paths: [{ d: "M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z", evenodd: true }] },
} satisfies Record<string, Icon>;

type Who = "both" | "trader" | "agent";

/** Division colours: red for traders, purple for agents, red into purple for both. */
const TONE: Record<Who, { fill: string; text: string; hex: string; capsule: string }> = {
  trader: { fill: "bg-[#c4484f]", text: "text-[#e2878b]", hex: "#c4484f", capsule: "text-[#e2878b]" },
  agent: { fill: "bg-[#7656c2]", text: "text-[#ac95e4]", hex: "#7656c2", capsule: "text-[#ac95e4]" },
  // Both divisions: the OKLCH midpoint of the trader red and the agent purple.
  // (Trial; the gradient it replaces was
  // "bg-[linear-gradient(in_oklch_to_right,#c4484f_20%,#7656c2_80%)]".)
  // Capsules have no edge: grey until their dates, then filled with the colour (see FILL);
  // `capsule` is the icon colour.
  both: { fill: "bg-[color-mix(in_oklch,#c4484f,#7656c2)]", text: "text-[#b4b4b4]", hex: "", capsule: "text-[#f2f2f2]" },
};

/*
 * OKLCH blending for the SVG lines, which (unlike CSS) cannot interpolate in
 * OKLCH themselves: the stops are worked out here instead.
 */
type Lch = [l: number, c: number, h: number];
function hexToOklch(hex: string): Lch {
  const lin = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180) / Math.PI];
}
function oklchToHex([L, C, H]: Lch): string {
  const A = C * Math.cos((H * Math.PI) / 180), B = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((v) => {
      const g = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.max(0, v) ** (1 / 2.4) - 0.055;
      return Math.round(Math.min(1, Math.max(0, g)) * 255).toString(16).padStart(2, "0");
    })
    .join("")}`;
}
/**
 * `n` + 1 colours from a to b, blended in OKLCH along the shorter way round the hue circle.
 * A grey has next to no hue, so it takes the other colour's: purple into grey then just
 * fades, instead of swinging round the circle through red.
 */
function oklchSteps(a: string, b: string, n = 8): string[] {
  const [l1, c1, ha] = hexToOklch(a), [l2, c2, hb] = hexToOklch(b);
  const GREY = 0.03;
  const h1 = c1 < GREY ? hb : ha, h2 = c2 < GREY ? h1 : hb;
  let dh = h2 - h1;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return oklchToHex([l1 + (l2 - l1) * t, c1 + (c2 - c1) * t, h1 + dh * t]);
  });
}

/** A day at noon UTC, for counting days between dates. */
const day = (iso: string) => Date.parse(`${iso}T12:00:00Z`);

type Item = {
  who: Who;
  icon: keyof typeof ICONS;
  title: string;
  /** ISO dates; `end` makes it a period, drawn as a capsule rather than a dot */
  start: string;
  end?: string;
};

/**
 * Key dates in two lanes, one per division, so their overlapping periods sit
 * side by side; items for both divisions take one capsule in the middle. Time runs
 * down to scale: the grid has one row per day, so a capsule is as long as its period
 * (at least as long as it is wide). Months are divided by dotted lines. The lines
 * between capsules shade from one capsule's colour to the next. Events are dots, periods are
 * capsules; colours mark the division, and each capsule fills with its colour as
 * its dates pass, down to today.
 */
const FIRST = "2026-10-15";
/** Grid row (1-based) of a date: one row per day from FIRST. */
const rowOf = (iso: string) => Math.round((day(iso) - day(FIRST)) / 864e5) + 1;
/** Shortest capsule, in days: a little taller than it is wide at the day heights below, so it still reads as a capsule. */
const MIN_DAYS = 18;
/** Month spans, from FIRST to the awards; each after the first opens with a dotted line. */
const MONTHS: [string, string][] = [
  ["2026-10-15", "2026-11-01"], ["2026-11-01", "2026-12-01"], ["2026-12-01", "2027-01-01"], ["2027-01-01", "2027-02-01"],
  ["2027-02-01", "2027-03-01"], ["2027-03-01", "2027-04-01"], ["2027-04-01", "2027-04-30"],
];
/** The colour a capsule fills with as its dates pass. */
const FILL: Record<Who, string> = { trader: "#c4484f", agent: "#7656c2", both: "#d6d2cb" }; // hex: blended by oklchSteps
/** A capsule's colour before its dates: a plain grey. */
const PENDING = "#2c2b2a";
/** The soft edge where a capsule's colour meets its grey at `f`%: OKLCH steps (see oklchSteps), 12% deep. */
const edge = (c: string, f: number) =>
  oklchSteps(c, PENDING, 6).map((s, k, all) => `${s} ${Math.min(100, Math.max(0, f - 6 + (12 * k) / (all.length - 1))).toFixed(1)}%`).join(", ");
/**
 * The lines between capsules, measured from the rendered capsules
 * ([data-lane]). Each lane runs straight down; where a shared item meets the lanes,
 * the line forks out to both lanes or joins back into the middle. Every line fades
 * down from the colour of the capsule above to the one below (grey for shared items).
 */
/** `past`: share of the line (0 to 1, from the top) whose time has come; the rest is grey. */
type Rail = { d: string; x1: number; y1: number; x2: number; y2: number; from: string; to: string; blend: [number, number]; past: number };
/** A line's colour before its time: the same grey as a capsule before its dates. */
const RAIL_PENDING = PENDING;
/** Line colours at each kind of capsule: the division colours, and a grey for shared items. */
const RAIL: Record<Who, string> = { trader: "#c4484f", agent: "#7656c2", both: "#8f8c88" };
function useRails(grid: React.RefObject<HTMLDivElement | null>, today: number | null) {
  const [rails, setRails] = useState<Rail[]>([]);
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const caps = [...el.querySelectorAll<HTMLElement>("[data-lane]")]
        .map((c) => {
          const r = c.getBoundingClientRect();
          return {
            lane: c.dataset.lane as Who,
            from: Number(c.dataset.from), // the item's first day
            to: Number(c.dataset.to), // and its last
            x: r.left - box.left + r.width / 2,
            top: r.top - box.top,
            bottom: r.bottom - box.top,
          };
        })
        .sort((a, b) => a.top - b.top);
      type Cap = (typeof caps)[number];

      // Lines. Forks turn just above the lanes they lead to, and joins just
      // below the lanes they come from, so the turn falls in the gap between rows.
      const parts: Rail[] = [];
      const seg = (a: Cap, b: Cap, fork = false) => {
        const turn = fork ? b.top - 5 : a.bottom + 5;
        const d = Math.abs(a.x - b.x) < 0.5 ? `M${a.x} ${a.bottom}V${b.top}` : `M${a.x} ${a.bottom}V${turn}H${b.x}V${b.top}`;
        // The line stands for the time between the two items: coloured once that has passed
        const past = today === null ? 0 : Math.min(1, Math.max(0, (today - a.to) / Math.max(1, b.from - a.to)));
        parts.push({ d, x1: 0, y1: a.bottom, x2: 0, y2: b.top, from: RAIL[a.lane], to: RAIL[b.lane], blend: [0, 1], past });
      };
      caps.forEach((c, i) => {
        const after = caps.slice(i + 1);
        if (c.lane === "both") {
          const next = after[0];
          if (!next) return;
          if (next.lane === "both") seg(c, next);
          else
            for (const lane of ["trader", "agent"] as const) {
              const n = after.find((a) => a.lane === lane);
              if (n) seg(c, n, true);
            }
        } else {
          const n = after.find((a) => a.lane === c.lane || a.lane === "both");
          if (n) seg(c, n);
        }
      });

      setRails(parts);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [grid, today]);
  return rails;
}

export function ScheduleSection({ lang }: { lang: WicLang }) {
  const items: Item[] = [
    { who: "both", icon: "entry", start: "2026-10-15", end: "2026-11-15", title: pick(lang, "Entries open", "エントリー受付") },
    { who: "both", icon: "opening", start: "2026-12-07", title: pick(lang, "Opening ceremony (online)", "開会式（オンライン）") },
    { who: "trader", icon: "test", start: "2026-12-07", end: "2026-12-20", title: pick(lang, "Test trading", "テスト取引") },
    { who: "agent", icon: "build", start: "2026-12-07", end: "2026-12-31", title: pick(lang, "Build your agent", "エージェント開発") },
    { who: "trader", icon: "trade", start: "2027-01-04", end: "2027-03-25", title: pick(lang, "Live trading", "本番取引") },
    { who: "agent", icon: "trial", start: "2027-01-04", end: "2027-01-31", title: pick(lang, "Trial run", "試運転") },
    { who: "agent", icon: "agent", start: "2027-02-01", end: "2027-03-25", title: pick(lang, "Live trading", "本番取引") },
    { who: "both", icon: "report", start: "2027-03-26", end: "2027-03-31", title: pick(lang, "Final reports", "最終レポート提出") },
    { who: "both", icon: "awards", start: "2027-04-22", title: pick(lang, "Closing and awards ceremony", "閉会式・表彰式") },
  ];
  const last = items[items.length - 1];
  /** Rows an item takes. A period runs from its first day through its last (at least MIN_DAYS);
      a one-day event sits just above its day, so lanes starting that day begin under it,
      except the last, which is centred on its day. */
  const rowsOf = (it: Item) => {
    const r = rowOf(it.start);
    if (it.end) return `${r} / ${Math.max(rowOf(it.end) + 1, r + MIN_DAYS)}`;
    return it === last ? `${r - 7} / ${r + 7}` : `${r - 18} / ${r}`;
  };
  const ROWS = rowOf(last.start) + 7;

  const whoLabel: Record<Who, string> = {
    both: pick(lang, "Both divisions", "両部門"),
    trader: pick(lang, "Trader division", "トレーダー部門"),
    agent: pick(lang, "AI Agent division", "AIエージェント部門"),
  };
  const md = (iso: string) => {
    const d = new Date(day(iso));
    return { m: d.getUTCMonth() + 1, d: d.getUTCDate(), mon: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }) };
  };
  const fmt = (iso: string) => {
    const a = md(iso);
    return lang === "ja" ? `${a.m}月${a.d}日` : `${a.mon} ${a.d}`;
  };
  /** "Dec 7 – 20" within a month, "Jan 4 – Mar 25" across months */
  const range = (s: string, e: string) => {
    const a = md(s), b = md(e);
    if (a.m === b.m) return lang === "ja" ? `${a.m}月${a.d}日〜${b.d}日` : `${a.mon} ${a.d} – ${b.d}`;
    return lang === "ja" ? `${a.m}月${a.d}日〜${b.m}月${b.d}日` : `${a.mon} ${a.d} – ${b.mon} ${b.d}`;
  };

  /** The first item of each year on each lane gives the year in its period line. */
  // Per lane: an item shows the year when nothing earlier on its own line (its
  // lane or the shared items; every lane for a shared item) starts in that year.
  const onLine = (a: Item, b: Item) => a.who === "both" || b.who === "both" || a.who === b.who;
  const yearFirst = new Set(
    items.filter((it, i) => !items.slice(0, i).some((o) => onLine(o, it) && o.start.slice(0, 4) === it.start.slice(0, 4))),
  );
  /** One style for every date on the timeline: the period under each name. */
  const DATE_CLS = "text-[0.72rem] font-normal text-wic-muted tabular-nums sm:text-[0.82rem]";
  /** How far through its dates an item is today, 0 to 1 (an event: 0 or 1). */
  const progress = (it: Item) => {
    if (today === null) return 0;
    const a = day(it.start), b = it.end ? day(it.end) + 864e5 : a;
    return b === a ? (today >= a ? 1 : 0) : Math.min(1, Math.max(0, (today - a) / (b - a)));
  };
  const Capsule = ({ it }: { it: Item }) => {
    // Filled from the top down to today, with a soft edge
    const f = progress(it) * 100;
    const c = FILL[it.who];
    const fill = f >= 100 ? { backgroundColor: c } : { backgroundColor: PENDING, backgroundImage: f > 0 ? `linear-gradient(to bottom, ${c} 0%, ${edge(c, f)})` : undefined };
    // Once the fill has passed the icon, the icon turns pale (dark on a shared item's light fill)
    const iconOn = f >= 55 ? (it.who === "both" ? "!text-[#1d1b1b]" : "!text-white") : "";
    return (
    <span
      data-lane={it.who}
      data-from={day(it.start)}
      data-to={day(it.end ?? it.start)}
      style={fill}
      className={`relative z-10 flex w-10 flex-none items-center justify-center rounded-full sm:w-12 ${TONE[it.who].capsule} ${iconOn} ${
        it.end ? "self-stretch" : "h-10 sm:h-12"
      }`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" className="sm:size-[22px]">
        {(() => {
          const icon: Icon = ICONS[it.icon];
          const s = icon.scale ?? 1;
          return (
            <g
              transform={s === 1 ? undefined : `translate(12 12) scale(${s}) translate(-12 -12)`}
              stroke={icon.stroke ? "currentColor" : undefined}
              strokeWidth={icon.stroke ? icon.stroke / s : undefined}
              strokeLinejoin="round"
            >
              {icon.paths.map((p) => (
                <path key={p.d} d={p.d} fillRule={p.evenodd ? "evenodd" : undefined} clipRule={p.evenodd ? "evenodd" : undefined} />
              ))}
            </g>
          );
        })()}
      </svg>
    </span>
    );
  };
  const when = (it: Item) => {
    const w = it.end ? range(it.start, it.end) : fmt(it.start);
    return yearFirst.has(it) ? (lang === "ja" ? `${it.start.slice(0, 4)}年${w}` : `${w}, ${it.start.slice(0, 4)}`) : w;
  };
  const titleCls = "m-0 text-[0.92rem] font-semibold leading-[1.3] sm:text-[1.1rem]";
  const subCls = `m-0 mt-0.5 ${DATE_CLS}`;

  // Today, read after mount so the page built ahead of time doesn't fix it.
  // ?today=YYYY-MM-DD previews the schedule as of another date.
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => {
    const preview = new URLSearchParams(location.search).get("today");
    setToday(preview && /^\d{4}-\d{2}-\d{2}$/.test(preview) ? day(preview) : Date.now());
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const rails = useRails(gridRef, today);

  return (
    <Section id="schedule" title={pick(lang, "Schedule", "日程")}>
      {/* Trader lane | middle | AI Agent lane, the middle set a little left of centre (0.9 : 1.1) because
          the shared items' labels hang off to the right. Lane capsules sit against the middle
          column, so a shared capsule there is centred between the lanes. The middle
          column is narrower than a capsule: shared capsules spill over its edges,
          which is fine as they never share a row with a lane capsule. */}
      <div className="mx-auto grid max-w-[48rem] grid-cols-[minmax(0,0.9fr)_1.25rem_minmax(0,1.1fr)] gap-x-1 pb-3 sm:grid-cols-[minmax(0,0.9fr)_2rem_minmax(0,1.1fr)] sm:gap-x-2">
        <p className="m-0 flex items-center justify-end gap-2 pr-1 text-[0.78rem] font-medium text-wic-muted sm:text-[0.88rem]">
          <span aria-hidden="true" className={`size-2.5 flex-none rounded-full ${TONE.trader.fill}`} />
          {whoLabel.trader}
        </p>
        <span />
        <p className="m-0 flex items-center gap-2 pl-5 text-[0.78rem] font-medium text-wic-muted sm:text-[0.88rem]">
          <span aria-hidden="true" className={`size-2.5 flex-none rounded-full ${TONE.agent.fill}`} />
          {whoLabel.agent}
        </p>
      </div>
      <div
        ref={gridRef}
        className="relative mx-auto grid max-w-[48rem] grid-cols-[minmax(0,0.9fr)_1.25rem_minmax(0,1.1fr)] gap-x-1 [--day:3.4px] sm:grid-cols-[minmax(0,0.9fr)_2rem_minmax(0,1.1fr)] sm:gap-x-2 sm:[--day:3.9px]"
        style={{ gridTemplateRows: `repeat(${ROWS}, var(--day))` }}
      >
        {/* Months across the full width (no month names): a sparse dotted line at each month's start,
            drawn as a repeating gradient since border-dotted can't set the spacing */}
        {MONTHS.map(([a, b], i) => (
          <div
            key={a}
            aria-hidden="true"
            className={`-mx-5 sm:-mx-8 ${i ? "bg-[linear-gradient(to_right,rgb(242_242_242/0.16)_2px,transparent_2px)] bg-[length:9px_1px] bg-top bg-repeat-x" : ""}`}
            style={{ gridColumn: "1 / 4", gridRow: `${rowOf(a)} / ${Math.min(rowOf(b), ROWS + 1)}` }}
          />
        ))}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          <defs>
            {rails.map((r, i) => (
              <linearGradient key={i} id={`rail-${i}`} gradientUnits="userSpaceOnUse" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}>
                {oklchSteps(r.from, r.to).map((c, k, all) => (
                  // The coloured part is squeezed into the share that has passed; grey below it
                  <stop key={k} offset={r.past * (r.blend[0] + (r.blend[1] - r.blend[0]) * (k / (all.length - 1)))} stopColor={c} />
                ))}
                {r.past < 1 && <stop offset={r.past} stopColor={RAIL_PENDING} />}
              </linearGradient>
            ))}
          </defs>
          {rails.map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke={r.past > 0 ? `url(#rail-${i})` : RAIL_PENDING} strokeWidth="1.5" strokeLinejoin="round" />
          ))}
        </svg>

        {items.map((it, i) => {
          const area = { gridRow: rowsOf(it) };
          // Periods keep a little space above and below, so neighbouring capsules don't touch
          const pad = it.end ? "py-[3px]" : it === last ? "" : "pb-5";
          if (it.who === "both") {
            // One capsule in the middle column, what it is on the right
            return (
              <div key={i} className={`col-span-3 grid grid-cols-subgrid ${pad}`} style={{ gridColumn: "1 / 4", ...area }}>
                <div />
                <div className={`flex justify-center ${it.end ? "" : it === last ? "items-center" : "items-end"}`}>
                  <Capsule it={it} />
                </div>
                {/* Clear the shared capsule where it spills past the narrow middle column. An event
                    above the lanes keeps its label's foot level with the dot, clear of the lanes. */}
                <div className={`min-w-0 pl-4 sm:pl-2.5 ${it.end || it === last ? "self-center" : "self-end"}`}>
                  <p className={titleCls}>{it.title}</p>
                  <p className={subCls}>{when(it)}</p>
                </div>
              </div>
            );
          }
          const trader = it.who === "trader";
          return (
            <div
              key={i}
              className={`flex min-w-0 gap-2 sm:gap-3.5 ${trader ? "flex-row-reverse" : ""} ${pad}`}
              style={{ gridColumn: trader ? 1 : 3, ...area }}
            >
              <Capsule it={it} />
              <div className={`min-w-0 self-center ${trader ? "text-right" : ""}`}>
                <p className={titleCls}>{it.title}</p>
                <p className={subCls}>{when(it)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mb-0 mt-8 text-[0.9rem] text-wic-muted">
        {pick(lang, "Entries close at 23:59 ET on Nov 15. Live trading ends at 15:50 ET on Mar 25.", "エントリー締切は11月15日の米国東部時間 23:59。本番取引は3月25日の米国東部時間 15:50 までに全ポジションを決済する。")}
      </p>
      <div className="mt-6 flex justify-end">
        <MoreLink href={wicHref(lang, "schedule")}>{pick(lang, "Full schedule", "日程の詳細")}</MoreLink>
      </div>
    </Section>
  );
}
