"use client";

import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

export default function AboutMedia() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [progress, setProgress] = useState(0);
  const [ctaPosition, setCtaPosition] = useState({
    x: 0,
    y: 0,
    hasPointer: false,
  });

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
  const mobileHeight = 52 + progress * 48;
  const radius = 28 - progress * 12;
  const edgeInset = progress * 48;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const media = mediaRef.current;
    if (!media) return;

    const rect = media.getBoundingClientRect();
    const button = ctaRef.current;
    const padding = 16;
    const halfWidth = (button?.offsetWidth ?? 132) / 2 + padding;
    const halfHeight = (button?.offsetHeight ?? 52) / 2 + padding;
    const x = Math.min(
      rect.width - halfWidth,
      Math.max(halfWidth, event.clientX - rect.left),
    );
    const y = Math.min(
      rect.height - halfHeight,
      Math.max(halfHeight, event.clientY - rect.top),
    );

    setCtaPosition({ x, y, hasPointer: true });
  }

  return (
    <div ref={sectionRef} className="relative h-[220svh] md:h-[260vh]">
      <div className="sticky top-0 mx-auto flex h-svh max-w-8xl items-center justify-center overflow-hidden lg:h-screen">
        <div
          ref={mediaRef}
          className="relative h-[calc(var(--mobile-media-height)-var(--edge-inset))] w-[calc(88vw-var(--edge-inset))] cursor-none overflow-hidden bg-ink-soft sm:w-[calc(76vw-var(--edge-inset))] lg:h-[calc(var(--media-height)-var(--edge-inset))] lg:w-[calc(var(--media-width)-var(--edge-inset))]"
          onPointerMove={handlePointerMove}
          onPointerLeave={() =>
            setCtaPosition((position) => ({ ...position, hasPointer: false }))
          }
          style={{
            "--media-width": `${width}vw`,
            "--media-height": `${height}vh`,
            "--mobile-media-height": `${mobileHeight}svh`,
            "--edge-inset": `${edgeInset}px`,
            borderRadius: `${radius}px`,
          } as React.CSSProperties}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/tf5.jpg"
            aria-label="TechForge summit preview"
          >
            <source src="/tf-vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,12,0.08), rgba(10,10,12,0.28)), radial-gradient(120% 100% at 75% 15%, rgba(198,255,61,0.14), transparent 60%), radial-gradient(100% 100% at 15% 100%, rgba(185,140,255,0.16), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <a
              ref={ctaRef}
              href="/checkout?tier=general"
              className="absolute cursor-none rounded-full bg-primary text-ink font-semibold px-8 py-14 text-sm transition-[background-color,opacity,transform] duration-200"
              style={{
                left: ctaPosition.hasPointer ? ctaPosition.x : "50%",
                top: ctaPosition.hasPointer ? ctaPosition.y : "50%",
                opacity: ctaPosition.hasPointer ? 1 : 0,
                pointerEvents: ctaPosition.hasPointer ? "auto" : "none",
                transform: "translate(-50%, -50%)",
              }}
            >
              Get tickets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
