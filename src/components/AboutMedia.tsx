"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutMedia() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    function measure() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const width = 62 + progress * 38;
  const height = 46 + progress * 54;
  const radius = 28 - progress * 28;
  const ctaOpacity = Math.max(0, (progress - 0.55) / 0.35);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div
          className="relative overflow-hidden border border-line bg-ink-soft"
          style={{
            width: `${width}vw`,
            height: `${height}vh`,
            borderRadius: `${radius}px`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 75% 15%, rgba(198,255,61,0.14), transparent 60%), radial-gradient(100% 100% at 15% 100%, rgba(185,140,255,0.16), transparent 60%)",
            }}
          />
          <svg
            className="absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
          >
            <path
              d="M400 500 L400 260 Q400 210 350 200 L320 195 Q300 190 300 165 L300 120 Q300 90 330 85 L470 85 Q500 90 500 120 L500 165 Q500 190 480 195 L450 200 Q400 210 400 260 Z"
              fill="#f2f2f0"
              opacity="0.5"
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: ctaOpacity, pointerEvents: ctaOpacity > 0.5 ? "auto" : "none" }}
          >
            <a
              href="/checkout?tier=general"
              className="rounded-full bg-signal text-ink font-semibold px-8 py-4 text-sm hover:bg-signal-dim transition-colors"
            >
              Get tickets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
