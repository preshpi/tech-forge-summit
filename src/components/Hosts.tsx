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
    <section id="hosts" className="w-full bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Top Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink/50">
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
          <p className="mt-6 max-w-md leading-relaxed text-ink/65">
            The TechForge 2026 is hosted by The Infinite Community, a community
            focused on helping developers and people in tech learn, collaborate,
            build, and grow through practical experiences and shared knowledge.
            The community is bringing that same spirit into The TechForge,
            creating a space where people at different stages can meet, learn
            from one another, and form connections that don’t have to end when
            the event does.
          </p>
        </div>
      </div>

      {/* Image Bento Grid */}
      <div className="grid h-auto grid-cols-1 gap-4 sm:gap-6 md:h-[620px] md:grid-cols-12">
        {/* Column 1: Tall Vertical Image */}
        <div className="relative min-h-[380px] overflow-hidden rounded-[28px] border border-black/10 md:col-span-4 md:min-h-0">
          <Image
            src="/tf12.jpg"
            alt="Team collaborating at table"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Column 2: one Stacked Images */}
        <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Wide Photo */}
          <div className="relative h-[200px] shrink-0 overflow-hidden rounded-[24px] border border-black/10 md:h-[220px]">
            <Image
              src="/tf16.jpg"
              alt="Group selfie of the team"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bottom Tall Photo */}
          <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-[28px] border border-black/10 md:min-h-0">
            <Image
              src="/tf13.jpg"
              alt="Researcher sitting in red seats"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Column 3: one Stacked Images */}
        <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Tall Photo */}
          <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-[28px] border border-black/10 md:min-h-0">
            <Image
              src="/tf14.jpg"
              alt="Co-founders working outside"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bottom Wide Photo */}
          <div className="relative h-[180px] shrink-0 overflow-hidden rounded-[24px] border border-black/10 md:h-[190px]">
            <Image
              src="/tf15.jpg"
              alt="Panel speakers at conference"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
