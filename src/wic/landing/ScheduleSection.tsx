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
    { who: "both", icon: "awards", start: "2027-04-22", title: pick(lang, "Closing and awards ceremony, Tokyo", "閉会式・表彰式（東京）") },
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
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:size-[22px]">
        {ICONS[it.icon]}
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
      {/* Trader lane | middle | AI Agent lane. Lane capsules sit against the middle
          column, so a shared capsule there is centred between the lanes. The middle
          column is narrower than a capsule: shared capsules spill over its edges,
          which is fine as they never share a row with a lane capsule. */}
      <div className="mx-auto grid max-w-[48rem] grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-x-1 pb-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] sm:gap-x-2">
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
        className="relative mx-auto grid max-w-[48rem] grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-x-1 [--day:3.4px] sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] sm:gap-x-2 sm:[--day:3.9px]"
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
