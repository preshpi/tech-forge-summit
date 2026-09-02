"use client";

import type { PointerEvent } from "react";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function GalleryFooter() {
  const footerRef = useRef<HTMLElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;

    const footer = footerRef.current;
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    footer.style.setProperty("--footer-pointer-x", `${event.clientX - rect.left}px`);
    footer.style.setProperty("--footer-pointer-y", `${event.clientY - rect.top}px`);
    footer.style.setProperty("--footer-spotlight-size", "160px");
    footer.style.setProperty("--footer-light-opacity", "1");
  }

  function handlePointerLeave() {
    const footer = footerRef.current;
    if (!footer) return;

    footer.style.setProperty("--footer-spotlight-size", "0px");
    footer.style.setProperty("--footer-light-opacity", "0");
  }

  return (
    <section
      ref={footerRef}
      className="techforge-footer relative isolate overflow-hidden px-6 py-20 text-paper sm:px-10 lg:py-28"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Image
        src="/tf11.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover object-[62%_center] md:object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-20 bg-black/55" />
      <div className="footer-glass-layer absolute inset-0 -z-10" />
      <div className="footer-pointer-light pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">
            The next chapter
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[0.94] tracking-[-0.05em] sm:text-7xl">
            See you at TechForge 2026.
          </h2>
        </div>
        <Link
          href="https://tix.africa/discover/the-tech-forge"
          transitionTypes={["nav-forward"]}
          className="group inline-flex items-center gap-3 rounded-full bg-paper py-2 pl-5 pr-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-1"
        >
          Get your ticket
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
