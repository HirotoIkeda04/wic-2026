"use client";

import { useState } from "react";
import { NAV, SITE } from "./data";

/**
 * Fixed header + full-screen menu overlay. Colors come from the tone tokens in
 * wic.css, so the same component sits on the dark landing page and the light
 * detail pages. `current` is the slug of the page being shown, if any.
 */
export function WicHeader({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="wic-header pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[1.1rem] pb-[0.9rem] pt-[calc(env(safe-area-inset-top,0px)+0.9rem)] *:pointer-events-auto">
        <a
          href="/"
          className="inline-flex items-center gap-[0.45rem] leading-none text-wic-ink no-underline"
          aria-label={SITE.shortName}
          data-brand
        >
          <span className="text-[2.05rem] font-black leading-[0.8] tracking-[-0.045em]">WIC</span>
          <span className="text-[0.66rem] font-extrabold uppercase leading-[1.08] tracking-[0.01em]">
            World Investment
            <br />
            Competition 2026
          </span>
        </a>
        <div className="flex items-center gap-[0.6rem]">
          <a
            href={SITE.entryUrl}
            className="inline-flex h-9 items-center rounded-full bg-wic-ink px-6 text-[0.95rem] font-semibold text-wic-bg no-underline"
          >
            Entry
          </a>
          <button
            type="button"
            className="group grid size-9 cursor-pointer place-items-center rounded-full border border-wic-ink/45 bg-wic-bg/50 text-wic-ink backdrop-blur-[6px]"
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            aria-controls="wic-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-px w-4 bg-current transition-[background,transform] duration-250 group-aria-expanded:bg-transparent before:absolute before:left-0 before:-top-[5px] before:block before:h-px before:w-4 before:bg-current before:transition-transform before:duration-250 before:content-[''] after:absolute after:left-0 after:top-[5px] after:block after:h-px after:w-4 after:bg-current after:transition-transform after:duration-250 after:content-[''] group-aria-expanded:before:translate-y-[5px] group-aria-expanded:before:rotate-45 group-aria-expanded:after:-translate-y-[5px] group-aria-expanded:after:-rotate-45" />
          </button>
        </div>
      </header>

      <nav
        id="wic-nav"
        aria-label="Menu"
        className={`fixed inset-0 z-40 flex-col overflow-y-auto bg-wic-bg/95 pt-[calc(env(safe-area-inset-top,0px)+4.6rem)] text-right backdrop-blur-[10px] ${open ? "flex" : "hidden"}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "A") setOpen(false);
        }}
      >
        <div className="flex-none px-6 pb-[1.4rem]">
          {NAV.map((item) => (
            <a
              key={item.slug}
              href={item.href}
              aria-current={item.slug === current ? "page" : undefined}
              className="block border-b border-wic-line py-[0.45em] text-[1.25rem] text-wic-ink no-underline last:border-b-0 aria-[current=page]:font-semibold"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="mt-auto flex-none border-t border-wic-line px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.2rem)] pt-[1.3rem] text-[0.84rem] leading-[1.55] text-wic-ink/70 [&_b]:mb-[0.35rem] [&_b]:block [&_b]:text-wic-ink">
          <p className="mb-[0.9rem]">
            <b>Organizer</b>
            {SITE.organizer}
            <br />
            AI Agent division co-host: {SITE.coHost}
          </p>
          <p className="mb-[0.9rem]">
            <b>Contact</b>
            {SITE.contact.map((c) => (
              <a key={c.label} href={c.href} className="ml-[1.1em] border-b border-wic-ink/35 text-wic-ink no-underline">
                {c.label}
              </a>
            ))}
          </p>
          <p className="text-[0.74rem] text-wic-ink/45">{SITE.legal}</p>
        </div>
      </nav>
    </>
  );
}
