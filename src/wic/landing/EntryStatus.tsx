"use client";

import { useEffect, useState } from "react";
import { pick, type WicLang } from "../lang";

/**
 * The entry window as a pill with a status dot after the text: grey before
 * entries open, a softly breathing green dot while they are open (wic-breathe
 * in wic.css), a dim dot once they have closed.
 * The page is static, so the phase is worked out again in the browser.
 */

/** Entries open Oct 15, 2026 00:00 ET (EDT) and close Nov 15, 23:59 ET (EST); see SCHEDULE in data.ts. */
const OPENS = Date.parse("2026-10-15T00:00:00-04:00");
const CLOSES = Date.parse("2026-11-15T23:59:59-05:00");

type Phase = "before" | "open" | "closed";

function phaseAt(now: number): Phase {
  if (now < OPENS) return "before";
  return now <= CLOSES ? "open" : "closed";
}

export function EntryStatus({ lang }: { lang: WicLang }) {
  const [phase, setPhase] = useState<Phase>(() => phaseAt(Date.now()));

  useEffect(() => {
    const update = () => setPhase(phaseAt(Date.now()));
    update();
    // Pick up a change of phase while the page stays open
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const label = {
    before: pick(lang, "Entries open Oct 15", "応募開始 10月15日"),
    open: pick(lang, "Entries close Nov 15", "応募締切 11月15日"),
    closed: pick(lang, "Entries closed", "応募受付終了"),
  }[phase];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#f2f2f2]/40 px-4 py-1.5 font-semibold">
      {label}
      <span
        aria-hidden="true"
        className={`size-[7px] flex-none rounded-full ${
          phase === "open" ? "wic-breathe bg-[#6ee7a8]" : phase === "before" ? "bg-[#f2f2f2]/50" : "bg-[#f2f2f2]/25"
        }`}
      />
    </span>
  );
}
