import { NAV } from "./data";

/** Previous / next links between the detail pages, in NAV order. */
export function Pager({ slug }: { slug: string }) {
  const i = NAV.findIndex((n) => n.slug === slug);
  const prev = NAV[i - 1];
  const next = NAV[i + 1];
  return (
    <nav
      className="mt-16 flex justify-between gap-4 border-t border-wic-line pt-6 [&_a]:text-wic-ink [&_a]:no-underline [&_span]:block [&_span]:text-[0.85rem] [&_span]:text-wic-muted"
      aria-label="Pages"
    >
      {prev && (
        <a href={prev.href}>
          <span>Previous</span>
          {prev.label}
        </a>
      )}
      {next ? (
        <a href={next.href} className="ml-auto text-right">
          <span>Next</span>
          {next.label}
        </a>
      ) : (
        <a href="/" className="ml-auto text-right">
          <span>Back to</span>Top
        </a>
      )}
    </nav>
  );
}
