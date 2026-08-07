"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedWord({ children }: { children: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {Array.from(children).map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-host-title-letter
          className="inline-block will-change-transform"
        >
          {character}
        </span>
      ))}
    </span>
  );
}

export default function Hosts() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const headingElement = heading;

    const letters = gsap.utils.toArray<HTMLElement>(
      "[data-host-title-letter]",
      headingElement,
    );
    const underline = headingElement.querySelector<SVGElement>(
      "[data-host-title-underline]",
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
        if (underline) {
          gsap.set(underline, { autoAlpha: 1, scaleX: 1 });
        }
        return;
      }

      function resetHeading() {
        gsap.set(letters, {
          autoAlpha: 0,
          y: "0.3em",
          scale: 0.96,
          filter: "blur(12px)",
          transformOrigin: "50% 50%",
        });

        if (underline) {
          gsap.set(underline, {
            autoAlpha: 0,
            scaleX: 0,
            transformOrigin: "0% 50%",
          });
        }
      }

      resetHeading();

      const timeline = gsap.timeline({ paused: true }).to(letters, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.52,
        ease: "power4.out",
        stagger: 0.045,
      });

      if (underline) {
        timeline.to(
          underline,
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.35",
        );
      }

      function replay() {
        timeline.pause(0);
        resetHeading();
        timeline.invalidate().restart();
      }

      ScrollTrigger.create({
        trigger: headingElement,
        start: "top 84%",
        end: "bottom 16%",
        onEnter: replay,
        onEnterBack: replay,
      });
    }, headingElement);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hosts"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-16 bg-black text-white"
    >
      {/* Top Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            <Plus className="h-3.5 w-3.5 text-[#86efac]" />
            <span>Host</span>
          </div>

          <h2
            ref={headingRef}
            aria-label="Curated by builders, for builders."
            className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]"
          >
            <span aria-hidden="true">
              <AnimatedWord>Curated</AnimatedWord>{" "}
              <AnimatedWord>by</AnimatedWord>{" "}
              <span className="relative inline-block">
                <AnimatedWord>builders,</AnimatedWord>
                {/* Green Scribble/Underline SVG Accent */}
                <svg
                  data-host-title-underline
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#86efac]"
                  viewBox="0 0 100 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 12 Q 25 2, 50 12 T 98 10"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <AnimatedWord>for</AnimatedWord>{" "}
              <AnimatedWord>builders.</AnimatedWord>
            </span>
          </h2>
          <p className="mt-6 text-paper/60 leading-relaxed max-w-md">
            The TechForge is run by a small independent team of operators and
            researchers who&apos;ve shipped AI products at every stage, from
            research labs to public companies. We pick the speakers, write the
            agenda, and run the show ourselves.
          </p>
        </div>
      </div>

      {/* Image Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 h-auto md:h-[620px]">
        {/* Column 1: Tall Vertical Image */}
        <div className="md:col-span-4 relative min-h-[380px] md:min-h-0 rounded-[28px] overflow-hidden border border-zinc-800/60">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
            alt="Team collaborating at table"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Column 2: Two Stacked Images */}
        <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Wide Photo */}
          <div className="relative h-[200px] md:h-[220px] rounded-[24px] overflow-hidden border border-zinc-800/60 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
              alt="Group selfie of the team"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bottom Tall Photo */}
          <div className="relative flex-1 min-h-[260px] md:min-h-0 rounded-[28px] overflow-hidden border border-zinc-800/60">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
              alt="Researcher sitting in red seats"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Column 3: Two Stacked Images */}
        <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Tall Photo */}
          <div className="relative flex-1 min-h-[300px] md:min-h-0 rounded-[28px] overflow-hidden border border-zinc-800/60">
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
              alt="Co-founders working outside"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bottom Wide Photo */}
          <div className="relative h-[180px] md:h-[190px] rounded-[24px] overflow-hidden border border-zinc-800/60 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800"
              alt="Panel speakers at conference"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
