import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The hero's photos taking turns: a crossfade every INTERVAL seconds, each one
 * pushing in slowly while it is up, with progress marks over the sponsors.
 * It pauses while the hero is off screen or the tab is hidden; with reduced
 * motion the first photo stays.
 */

export type HeroSlide = {
  src: string;
  srcSet: string;
  alt: string;
  /** object-position on phones, and from lg up */
  pos: string;
  posLg: string;
  /** how much darker the oval behind the words needs to be on this photo (0–1) */
  veil: number;
};

const INTERVAL = 6;

export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  // n counts every change, so the active progress mark restarts its fill each time
  const [n, setN] = useState(0);
  const [running, setRunning] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const at = n % slides.length;
  const prev = n ? (n - 1) % slides.length : -1;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let onScreen = true;
    const run = () => {
      window.clearInterval(timer);
      const go = onScreen && !document.hidden;
      setRunning(go);
      timer = go ? window.setInterval(() => setN((k) => k + 1), INTERVAL * 1000) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      run();
    });
    io.observe(ref.current!);
    document.addEventListener("visibilitychange", run);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ "--wic-sv": slides[at].veil, "--play": running ? "running" : "paused" } as CSSProperties}
    >
      {slides.map((s, i) => (
        <picture key={s.src} className="contents">
          <source type="image/webp" srcSet={s.srcSet} sizes="100vw" />
          <img
            src={s.src}
            alt={s.alt}
            aria-hidden={i === at ? undefined : true}
            loading={i ? "lazy" : "eager"}
            fetchPriority={i ? "low" : "high"}
            // The outgoing photo keeps its push-in while it fades, so it does not jump back
            className={`absolute inset-0 block size-full max-w-none object-cover object-(--pos) transition-opacity duration-[1.6s] ease-in-out [animation-play-state:var(--play)] motion-reduce:animate-none lg:object-(--pos-lg) ${i === at ? "opacity-100" : "opacity-0"} ${i === at || i === prev ? "animate-[wic-drift_7.6s_linear_both]" : ""}`}
            style={{ "--pos": s.pos, "--pos-lg": s.posLg } as CSSProperties}
          />
        </picture>
      ))}

      {/* A soft oval behind the words, as dark as the photo on show needs; --wic-sv is
          registered in wic.css so it eases from one photo's value to the next */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_38%_at_28%_32%,rgb(12_11_11/var(--wic-sv)),rgb(12_11_11/0)_100%)] [transition:--wic-sv_1.6s_ease]"
      />

      {/* Progress marks, centred just above the sponsor row (its cells are 32px × --k tall) */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+18px+32px*var(--k)+14px)] z-10 flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <i
            key={i === at ? `${s.src}-${n}` : s.src}
            className={`relative block h-0.5 w-[22px] overflow-hidden bg-[#f2f2f2]/28 after:absolute after:inset-0 after:origin-left after:bg-white after:content-[''] after:[animation-play-state:var(--play)] ${
              i === at
                ? "after:[transform:scaleX(0)] after:animate-[wic-fill_6s_linear_forwards] motion-reduce:after:animate-none"
                : i < at
                  ? "after:[transform:none]"
                  : "after:[transform:scaleX(0)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
