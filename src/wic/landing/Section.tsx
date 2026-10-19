import type { ReactNode } from "react";

/** A landing section: heading, then free-form content. */
export function Section({
  id,
  title,
  children,
  className = "",
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-16 border-t border-wic-line ${className}`}>
      <div className="mx-auto max-w-[72rem] px-5 py-20 sm:px-8 sm:py-28">
        <h2 id={`${id}-title`} className="mb-10 max-w-[18em] text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.025em] [text-wrap:balance]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/** "Read more" style link to a detail page. */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-wic-ink/30 px-5 py-2.5 text-[0.9rem] font-medium text-wic-ink no-underline transition-colors hover:border-wic-ink hover:bg-wic-ink hover:text-wic-bg"
    >
      {children} <span aria-hidden="true">→</span>
    </a>
  );
}
