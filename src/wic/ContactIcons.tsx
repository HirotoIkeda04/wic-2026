import type { ReactNode } from "react";
import { SITE } from "./data";

/** Glyphs for SITE.contact, keyed by label; drawn in currentColor on a 24px grid. */
const GLYPHS: Record<string, ReactNode> = {
  Email: (
    <path d="M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  X: (
    <path
      d="M17.2 4.5h2.6l-5.7 6.5 6.7 8.5h-5.2l-4.1-5.3-4.7 5.3H4.2l6.1-6.9L3.9 4.5h5.3l3.7 4.9zm-.9 13.5h1.4L8.3 6H6.8z"
      fill="currentColor"
    />
  ),
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.2" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.7" cy="7.3" r="0.4" fill="currentColor" />
    </g>
  ),
};

/** Email / X / Instagram as round outlined icon buttons. */
export function ContactIcons({ className = "" }: { className?: string }) {
  return (
    <ul className={`m-0 flex list-none gap-2.5 p-0 ${className}`}>
      {SITE.contact.map((c) => (
        <li key={c.label}>
          <a
            href={c.href}
            aria-label={c.label}
            className="grid size-10 place-items-center rounded-full border border-wic-ink/35 text-wic-ink no-underline transition-colors hover:border-wic-ink hover:bg-wic-ink hover:text-wic-bg"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              {GLYPHS[c.label]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
