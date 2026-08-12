"use client";

import { useEffect, useRef } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SponsorLogo from "./SponsorLogo";

gsap.registerPlugin(ScrollTrigger);

function AnimatedWord({ children }: { children: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {Array.from(children).map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-sponsor-title-letter
          className="inline-block will-change-transform"
        >
          {character}
        </span>
      ))}
    </span>
  );
}

// Complete list of sponsors without empty slot padding
const sponsors = [
  "Snowflake",
  "Terra",
  "Trace",
  "Minty",
  "Orbitc",
  "Glossy",
  "Penta",
  "luminous",
  "Rise",
  "Inspire",
  "hues",
  "umbrella",
  "Volume",
  "Homey",
  "Colab",
  "Automation",
];

export default function Sponsors() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const headingElement = heading;

    const letters = gsap.utils.toArray<HTMLElement>(
      "[data-sponsor-title-letter]",
      headingElement,
    );
    const underline = headingElement.querySelector<SVGElement>(
      "[data-sponsor-title-underline]",
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
      id="sponsors"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-20 bg-black text-white"
    >
      {/* Top Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Tag & Main Title */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            <Plus className="h-3.5 w-3.5 text-[#86efac]" />
            <span>SPONSORS</span>
          </div>

          <h2
            ref={headingRef}
            aria-label="Meet our session sponsors."
            className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]"
          >
            <span aria-hidden="true">
              <AnimatedWord>Meet</AnimatedWord>{" "}
              <AnimatedWord>our</AnimatedWord>{" "}
              <span className="relative inline-block">
                <AnimatedWord>session</AnimatedWord>
                {/* Green Scribble/Underline SVG Accent */}
                <svg
                  data-sponsor-title-underline
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
              <AnimatedWord>sponsors</AnimatedWord>
            </span>
          </h2>
        </div>

        {/* Right Column: Text & Contact CTA */}
        <div className="lg:col-span-5 lg:pt-8 flex flex-col justify-between space-y-6">
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
            Synthik gives your business a platform to stand out, build
            meaningful connections, and engage with enterprises, platforms,
            start-ups, and ambitious teams driving the next wave of growth.
          </p>

          <div className="pt-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-3">
              INTERESTED IN BECOMING A SPONSOR?
            </p>

            {/* Split Pill Button */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black p-1 pl-5 pr-1 font-semibold text-xs transition-colors hover:bg-zinc-200"
            >
              <span>Contact us</span>
              <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Sponsors Grid - Continuous Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {sponsors.map((sponsor, index) => (
          <div
            key={`${sponsor}-${index}`}
            className="h-[120px] rounded-[16px] bg-[#161616] border border-zinc-800/40 hover:border-zinc-700/80 transition-all duration-200 flex items-center justify-center p-4 group"
          >
            <SponsorLogo name={sponsor} />
          </div>
        ))}
      </div>
    </section>
  );
}
