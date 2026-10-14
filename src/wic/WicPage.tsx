import type { ReactNode } from "react";

export type WicTone = "light" | "dark";

/**
 * Page ground for the WIC 2026 pages: sets the tone tokens (see wic.css) and
 * the base font/colors. Landing uses "dark", the text pages "light".
 */
export function WicPage({ tone = "light", children }: { tone?: WicTone; children: ReactNode }) {
  return (
    <div className="wic relative min-h-screen" data-tone={tone}>
      {children}
    </div>
  );
}
