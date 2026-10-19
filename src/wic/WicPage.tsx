import type { ReactNode } from "react";
import type { WicLang } from "./lang";

export type WicTone = "light" | "dark";

/**
 * Page ground for the WIC 2026 pages: sets the tone tokens (see wic.css), the
 * base font/colors and the content language (the root layout says `ja`).
 * Landing uses "dark", the text pages "light".
 */
export function WicPage({ tone = "light", lang, children }: { tone?: WicTone; lang: WicLang; children: ReactNode }) {
  return (
    <div className="wic relative min-h-screen" data-tone={tone} lang={lang}>
      {children}
    </div>
  );
}
