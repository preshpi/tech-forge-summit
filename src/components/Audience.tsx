"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icons } from "@/lib/icons";
import AudienceMap from "./AudienceMap";

gsap.registerPlugin(ScrollTrigger);

const orbitTags = ["InThe TechForgetion", "Networking", "Distribution", "Learning"];
const audienceTitle = "Built for the people building it";

export default function Audience() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const letters = gsap.utils.toArray<HTMLElement>(
      "[data-audience-title-letter]",
      heading,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(letters, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        return;
      }

      function scatterTitle() {
        gsap.set(letters, {
          autoAlpha: 0,
          y: "0.3em",
          scale: 0.96,
          filter: "blur(12px)",
          transformOrigin: "50% 50%",
        });
      }

      scatterTitle();

      const timeline = gsap.timeline({ paused: true }).to(letters, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.52,
        ease: "power4.out",
        stagger: 0.045,
      });

      function replay() {
        timeline.pause(0);
        scatterTitle();
        timeline.invalidate().restart();
      }

      ScrollTrigger.create({
        trigger: heading,
        start: "top 84%",
        end: "bottom 16%",
        onEnter: replay,
        onEnterBack: replay,
      });
    }, heading);

    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-x-clip py-20 sm:py-24 md:py-32 lg:overflow-visible">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal">
          {Icons().sparkel} For whom?
        </p>
        <h2
          ref={headingRef}
          aria-label={audienceTitle}
          className="max-w-2xl font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[34px] md:text-[44px] lg:text-[64px]"
        >
          <span aria-hidden="true">
            {audienceTitle.split(" ").map((word, wordIndex, words) => (
              <span key={word}>
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word).map((letter, letterIndex) => (
                    <span
                      key={`${letter}-${letterIndex}`}
                      data-audience-title-letter
                      className="inline-block will-change-transform"
                    >
                      {letter}
                    </span>
                  ))}
                </span>
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {/* full-bleed fan stack */}
      <div className="mt-10 sm:mt-14 md:mt-16">
        <AudienceMap />
      </div>

      {/* signature orbit element, now its own row below the stack */}
      <div className="mx-auto mt-16 flex max-w-7xl justify-center px-4 sm:mt-24 sm:px-6">
        <div className="relative mx-auto flex h-[clamp(20rem,92vw,32.5rem)] w-[clamp(20rem,92vw,32.5rem)] items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-9 rounded-full border border-line sm:inset-12 lg:inset-14" />
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-signal text-center font-display font-bold text-ink sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            <span className="max-w-24 leading-tight text-[12px]">
              The TechForge
            </span>
          </div>
          {orbitTags.map((tag, i) => {
            const dot = ["bg-signal", "bg-accent-2", "bg-accent-3", "bg-signal"][i % 4];
            return (
              <div
                key={tag}
                className="absolute animate-orbit"
                style={
                  {
                    "--radius": "clamp(142px, 42vw, 232px)",
                    "--duration": `${24 + i * 6}s`,
                    animationDelay: `${i * -6}s`,
                  } as React.CSSProperties
                }
              >
                <span className="rounded-full border border-line bg-ink-soft pl-2 pr-3 py-1.5 text-xs font-mono text-paper/70 whitespace-nowrap inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  {tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
