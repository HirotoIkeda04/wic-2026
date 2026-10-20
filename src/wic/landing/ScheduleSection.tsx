"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

/** Line icons on a 24px grid, drawn in currentColor. */
const ICONS = {
  // Hourglass: the entry window
  entry: <path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9" />,
  // Flag: opening ceremony
  opening: <path d="M6 21V4M6 4h11l-2.5 4L17 12H6" />,
  // Target: test trading
  test: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5v1" />,
  // Code brackets: building the agent
  build: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  // Play: the agent's trial run
  trial: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM10 8.5v7l6-3.5z" />,
  // Candlesticks: live trading by people
  trade: <path d="M8 3v4M8 15v5M6 7h4v8H6zM16 5v3M16 15v4M14 8h4v7h-4z" />,
  // Chip: live trading by agents
  agent: <path d="M8 8h8v8H8zM10 4v4M14 4v4M10 16v4M14 16v4M4 10h4M4 14h4M16 10h4M16 14h4" />,
  // Document: reports
  report: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />,
  // Trophy: closing and awards ceremony
  awards: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M10 17h4M9 20h6" />,
} satisfies Record<string, ReactNode>;

type Who = "both" | "trader" | "agent";

/** Division colours: red for traders, purple for agents, red into purple for both. */
const TONE: Record<Who, { fill: string; text: string; hex: string }> = {
  trader: { fill: "bg-[#c4484f]", text: "text-[#e2878b]", hex: "#c4484f" },
  agent: { fill: "bg-[#7656c2]", text: "text-[#ac95e4]", hex: "#7656c2" },
  // Both divisions: the OKLCH midpoint of the trader red and the agent purple.
  // (Trial; the gradient it replaces was
  // "bg-[linear-gradient(in_oklch_to_right,#c4484f_20%,#7656c2_80%)]".)
  both: { fill: "bg-[color-mix(in_oklch,#c4484f,#7656c2)]", text: "text-[#b4b4b4]", hex: "" },
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
/** `n` + 1 colours from a to b, blended in OKLCH along the shorter way round the hue circle. */
function oklchSteps(a: string, b: string, n = 8): string[] {
  const [l1, c1, h1] = hexToOklch(a), [l2, c2, h2] = hexToOklch(b);
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
  /** Grid rows it occupies (1-based, after the lane headers) and its minimum height */
  row: number;
  span?: number;
  minH?: string;
};

/**
 * Key dates in two lanes, one per division, so their overlapping periods sit
 * side by side; items for both divisions take one capsule in the middle. Time runs down in
 * phases (one grid row each), with each phase's start date on the left.
 * Events are dots, periods are capsules; colours mark the division.
 */
/**
 * The lines between capsules, measured from the rendered capsules
 * ([data-lane]). Each lane runs straight down; where a shared item meets the lanes,
 * the line forks out to both lanes or joins back into the middle. Lines within
 * a lane fade down from the colour of the capsule above to the one below.
 * Lines that touch a shared item run, like its capsule, from red on the trader
 * side to purple on the agent side, across the width.
 */
type Rail = { d: string; x1: number; y1: number; x2: number; y2: number; from: string; to: string; blend: [number, number] };
/** Where across the lanes a shared line blends red into purple: a band in the middle. */
const BLEND: [number, number] = [0.3, 0.7];
function useRails(grid: React.RefObject<HTMLDivElement | null>) {
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
      const laneCap = (lane: Who) => caps.find((c) => c.lane === lane);
      const xT = laneCap("trader")?.x ?? 0, xA = laneCap("agent")?.x ?? 0;
      const seg = (a: Cap, b: Cap, fork = false) => {
        const turn = fork ? b.top - 5 : a.bottom + 5;
        const d = Math.abs(a.x - b.x) < 0.5 ? `M${a.x} ${a.bottom}V${b.top}` : `M${a.x} ${a.bottom}V${turn}H${b.x}V${b.top}`;
        if (a.lane === "both" || b.lane === "both")
          parts.push({ d, x1: xT, y1: 0, x2: xA, y2: 0, from: TONE.trader.hex, to: TONE.agent.hex, blend: BLEND });
        else parts.push({ d, x1: 0, y1: a.bottom, x2: 0, y2: b.top, from: TONE[a.lane].hex, to: TONE[b.lane].hex, blend: [0, 1] });
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
  }, [grid]);
  return rails;
}

export function ScheduleSection({ lang }: { lang: WicLang }) {
  const items: Item[] = [
    { who: "both", icon: "entry", start: "2026-10-15", end: "2026-11-15", row: 1, minH: "min-h-[6.5rem]", title: pick(lang, "Entries open", "エントリー受付") },
    { who: "both", icon: "opening", start: "2026-12-07", row: 2, title: pick(lang, "Opening ceremony (online)", "開会式（オンライン）") },
    { who: "trader", icon: "test", start: "2026-12-07", end: "2026-12-20", row: 3, minH: "min-h-[7rem]", title: pick(lang, "Test trading", "テスト取引") },
    { who: "agent", icon: "build", start: "2026-12-07", end: "2026-12-31", row: 3, minH: "min-h-[7rem]", title: pick(lang, "Build your agent", "エージェント開発") },
    { who: "trader", icon: "trade", start: "2027-01-04", end: "2027-03-25", row: 4, span: 2, title: pick(lang, "Live trading", "本番取引") },
    { who: "agent", icon: "trial", start: "2027-01-04", end: "2027-01-31", row: 4, minH: "min-h-[7rem]", title: pick(lang, "Trial run", "試運転") },
    { who: "agent", icon: "agent", start: "2027-02-01", end: "2027-03-25", row: 5, minH: "min-h-[10rem]", title: pick(lang, "Live trading", "本番取引") },
    { who: "both", icon: "report", start: "2027-03-26", end: "2027-03-31", row: 6, minH: "min-h-[4.5rem]", title: pick(lang, "Final reports", "最終レポート提出") },
    { who: "both", icon: "awards", start: "2027-04-22", row: 7, title: pick(lang, "Closing and awards ceremony, Tokyo", "閉会式・表彰式（東京）") },
  ];

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
  const Capsule = ({ it }: { it: Item }) => (
    <span
      data-lane={it.who}
      className={`relative z-10 flex w-8 flex-none items-center justify-center rounded-full text-[#f2f2f2] sm:w-11 ${TONE[it.who].fill} ${
        it.end ? "self-stretch" : "h-8 sm:h-11"
      }`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:size-5">
        {ICONS[it.icon]}
      </svg>
    </span>
  );
  const when = (it: Item) => {
    const w = it.end ? range(it.start, it.end) : fmt(it.start);
    return yearFirst.has(it) ? (lang === "ja" ? `${it.start.slice(0, 4)}年${w}` : `${w}, ${it.start.slice(0, 4)}`) : w;
  };
  const titleCls = "m-0 text-[0.92rem] font-semibold leading-[1.3] sm:text-[1.1rem]";
  const subCls = `m-0 mt-0.5 ${DATE_CLS}`;

  const gridRef = useRef<HTMLDivElement>(null);
  const rails = useRails(gridRef);

  return (
    <Section id="schedule" title={pick(lang, "From entry to the awards in Tokyo.", "エントリーから東京での表彰式まで。")}>
      {/* Trader lane | middle | AI Agent lane. Lane capsules sit against the middle
          column, so a shared capsule there is centred between the lanes. */}
      <div ref={gridRef} className="relative mx-auto grid max-w-[48rem] grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] gap-x-2 gap-y-2.5 sm:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] sm:gap-x-4">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          <defs>
            {rails.map((r, i) => (
              <linearGradient key={i} id={`rail-${i}`} gradientUnits="userSpaceOnUse" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}>
                {oklchSteps(r.from, r.to).map((c, k, all) => (
                  <stop key={k} offset={r.blend[0] + (r.blend[1] - r.blend[0]) * (k / (all.length - 1))} stopColor={c} />
                ))}
              </linearGradient>
            ))}
          </defs>
          {rails.map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke={`url(#rail-${i})`} strokeWidth="3" strokeLinejoin="round" />
          ))}
        </svg>
        <p className="m-0 flex items-center justify-end gap-2 pb-2 text-[0.78rem] font-medium text-wic-muted sm:text-[0.88rem]" style={{ gridColumn: 1, gridRow: 1 }}>
          {whoLabel.trader}
          <span aria-hidden="true" className={`size-2.5 flex-none rounded-full ${TONE.trader.fill}`} />
        </p>
        <p className="m-0 flex items-center gap-2 pb-2 text-[0.78rem] font-medium text-wic-muted sm:text-[0.88rem]" style={{ gridColumn: 3, gridRow: 1 }}>
          <span aria-hidden="true" className={`size-2.5 flex-none rounded-full ${TONE.agent.fill}`} />
          {whoLabel.agent}
        </p>

        {items.map((it, i) => {
          const area = { gridRow: `${it.row + 1} / span ${it.span ?? 1}` };
          if (it.who === "both") {
            // One capsule in the middle column, what it is on the right
            return (
              <div key={i} className={`col-span-3 grid grid-cols-subgrid ${it.minH ?? ""}`} style={{ gridColumn: "1 / 4", ...area }}>
                <div />
                <div className="flex items-center justify-center">
                  <Capsule it={it} />
                </div>
                <div className="min-w-0 self-center">
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
              className={`flex min-w-0 gap-2 sm:gap-3.5 ${trader ? "flex-row-reverse" : ""} ${it.minH ?? ""}`}
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
      <div className="mt-6">
        <MoreLink href={wicHref(lang, "schedule")}>{pick(lang, "Full schedule", "日程の詳細")}</MoreLink>
      </div>
    </Section>
  );
}
