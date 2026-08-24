"use client";

import { useEffect, useRef } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SponsorLogo from "./SponsorLogo";
import Link from "next/link";
import useDeviceWidth from "@/hooks/useDeviceWidth";

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
    <section id="sponsors" className=" px-4 sm:px-6 pt-20 bg-black text-white">
      {/* Top Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 w-full max-w-7xl mx-auto">
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
              <AnimatedWord>Meet</AnimatedWord> <AnimatedWord>our</AnimatedWord>{" "}
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
            The TechForge 2026 is expected to bring together more than 1,000
            developers, founders, designers, students, product professionals,
            and people building careers across tech.
          </p>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
            For sponsors, it’s a chance to meet this audience directly, support
            the growth of Nigeria’s tech ecosystem, discover talent, and put
            your company in front of people already interested in technology,
            products, careers, and the companies behind them.
          </p>

          <div className="pt-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-3">
              Want to sponsor The TechForge 2026?
            </p>

            {/* Split Pill Button */}
            <a
              href="https://wa.me/2347073659187"
              target="_blank"
              rel="noopener noreferrer"
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

      <SponsorBooth />
      {/* Add the booth animaton here */}

      {/* Sponsors Grid - Continuous Layout */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {sponsors.map((sponsor, index) => (
          <div
            key={`${sponsor}-${index}`}
            className="h-[120px] rounded-[16px] bg-[#161616] border border-zinc-800/40 hover:border-zinc-700/80 transition-all duration-200 flex items-center justify-center p-4 group"
          >
            <SponsorLogo name={sponsor} />
          </div>
        ))}
      </div> */}
    </section>
  );
}

function BoothLetters({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-booth-letter
          className="inline-block will-change-transform outline-[#71717a]"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function SponsorBooth() {
  const boothRef = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceWidth() < 640;

  useEffect(() => {
    const root = boothRef.current;
    if (!root) return;

    const centerPanel = root.querySelector<SVGRectElement>(
      "[data-booth-center]",
    );
    const leftPanel = root.querySelector<SVGRectElement>("[data-booth-left]");
    const rightPanel = root.querySelector<SVGRectElement>("[data-booth-right]");
    const drawnLines = gsap.utils.toArray<SVGGeometryElement>(
      "[data-booth-draw]",
      root,
    );
    const counter = root.querySelector<SVGLineElement>("[data-booth-counter]");
    const glow = root.querySelector<SVGCircleElement>("[data-booth-glow]");
    const leadLine = root.querySelector<HTMLElement>("[data-booth-line-lead]");
    const sponsorLine = root.querySelector<HTMLElement>(
      "[data-booth-line-sponsor]",
    );
    const leadLetters = gsap.utils.toArray<HTMLElement>(
      "[data-booth-letter]",
      leadLine,
    );
    const sponsorLetters = gsap.utils.toArray<HTMLElement>(
      "[data-booth-letter]",
      sponsorLine,
    );
    const support = root.querySelector<HTMLElement>("[data-booth-support]");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            centerPanel,
            leftPanel,
            rightPanel,
            ...drawnLines,
            counter,
            glow,
            support,
          ],
          { clearProps: "all" },
        );
        if (leadLine) gsap.set(leadLine, { autoAlpha: 0 });
        if (sponsorLine) gsap.set(sponsorLine, { autoAlpha: 1 });
        gsap.set(sponsorLetters, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      // measure each hand-drawn line so we can "draw" it on with stroke-dash
      const lineLengths = drawnLines.map((line) => line.getTotalLength());

      gsap.set(centerPanel, {
        autoAlpha: 0,
        scaleY: 0.85,
        transformOrigin: "50% 100%",
      });
      gsap.set(leftPanel, {
        rotateY: 0,
        scaleX: 0,
        transformOrigin: "100% 50%",
      });
      gsap.set(rightPanel, { scaleX: 0, transformOrigin: "0% 50%" });
      drawnLines.forEach((line, i) => {
        gsap.set(line, {
          strokeDasharray: lineLengths[i],
          strokeDashoffset: lineLengths[i],
        });
      });
      gsap.set(counter, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(glow, { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
      gsap.set(leadLetters, { autoAlpha: 0, y: -90, scale: 0.6 });
      gsap.set(sponsorLetters, { autoAlpha: 0, y: 100, scale: 0.6 });
      if (support) gsap.set(support, { autoAlpha: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(counter, { scaleX: 1, duration: 0.4 })
        .to(
          drawnLines,
          { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
          "-=0.15",
        )
        .to(centerPanel, { autoAlpha: 1, scaleY: 1, duration: 0.45 }, "-=0.4")
        .to(
          [leftPanel, rightPanel],
          { scaleX: 1, duration: 0.6, ease: "power4.out" },
          "-=0.25",
        );
      tl.to(counter, { scaleX: 1, duration: 0.4 })
        .to(
          drawnLines,
          { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
          "-=0.15",
        )
        .to(centerPanel, { autoAlpha: 1, scaleY: 1, duration: 0.45 }, "-=0.4")
        .to(
          [leftPanel, rightPanel],
          { scaleX: 1, duration: 0.6, ease: "power4.out" },
          "-=0.25",
        )
        .to(glow, { autoAlpha: 1, scale: 1, duration: 0.5 }, "-=0.3")
        // "Lead the Way." bounces in
        .to(
          leadLetters,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.8)",
            stagger: 0.035,
          },
          "-=0.15",
        )
        // holds, then exits upward
        .to(
          leadLetters,
          {
            autoAlpha: 0,
            y: -70,
            duration: 0.45,
            ease: "power2.in",
            stagger: 0.02,
          },
          "+=0.55",
        )
        // "Sponsor TechForge." bounces in
        .to(
          sponsorLetters,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.8)",
            stagger: 0.035,
          },
          "+=0.05",
        )
        // holds, then settles upward into a resting headline position (stays visible)
        .to(
          sponsorLetters,
          {
            y: isMobile ? 30: 50,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.015,
          },
          "+=0.5",
        ) // kick off an infinite slick zigzag dance across the letters, staggered per-letter
        .call(() => {
          gsap.to(sponsorLetters, {
            y: "+=14",
            duration: 0.55,
            ease: "sine.inOut",
            stagger: {
              each: 0.09,
              yoyo: true,
              repeat: -1,
            },
          });
        })
        // description + CTA reveal
        .to(support, { autoAlpha: 1, y: isMobile ? 50 : 80, duration: 0.5 }, "-=0.1");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={boothRef} className="relative left-1/2 w-screen -translate-x-1/2">
      <svg
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        className="h-[97.2vw] w-full sm:h-auto aspect-1440/1400 sm:aspect-1440/700"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="boothGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle
          data-booth-glow
          cx="720"
          cy="415"
          r="220"
          fill="url(#boothGlow)"
        />

        {/* double-line roof, drawn on */}
        <path
          data-booth-draw
          d="M60 150 L720 40 L1380 150"
          stroke="#3f3f46"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-booth-draw
          d="M60 200 L720 90 L1380 200"
          stroke="#3f3f46"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* left pillar */}
        <line
          data-booth-draw
          x1="60"
          y1="150"
          x2="60"
          y2="620"
          stroke="#71717a"
          strokeWidth="1.5"
        />
        <line
          data-booth-draw
          x1="110"
          y1="200"
          x2="110"
          y2="620"
          stroke="#3f3f46"
          strokeWidth="1.25"
        />

        {/* right pillar */}
        <line
          data-booth-draw
          x1="1380"
          y1="150"
          x2="1380"
          y2="620"
          stroke="#71717a"
          strokeWidth="1.5"
        />
        <line
          data-booth-draw
          x1="1330"
          y1="200"
          x2="1330"
          y2="620"
          stroke="#3f3f46"
          strokeWidth="1.25"
        />

        {/* base counter */}
        <line
          data-booth-counter
          x1="60"
          y1="620"
          x2="1380"
          y2="620"
          stroke="#52525b"
          strokeWidth="1.5"
        />

        {/* left wing panel */}
        <rect
          data-booth-left
          x="120"
          y="210"
          width="400"
          height="410"
          fill="#111318"
          fillOpacity="0.55"
          stroke="#52525b"
          strokeWidth="1.25"
        />

        {/* center panel */}
        <rect
          data-booth-center
          x="520"
          y="210"
          width="400"
          height="410"
          fill="#0b0d10"
          fillOpacity="1"
          stroke="#71717a"
          strokeOpacity="0.85"
          strokeWidth="1.5"
        />

        {/* right wing panel */}
        <rect
          data-booth-right
          x="920"
          y="210"
          width="400"
          height="410"
          fill="#111318"
          fillOpacity="0.55"
          stroke="#52525b"
          strokeWidth="1.25"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="relative flex min-h-[2.4rem] w-full max-w-2xl items-center justify-center sm:min-h-12 md:min-h-[3.8rem]">
          <h3
            data-booth-line-lead
            className="absolute inset-0 flex items-center justify-center overflow-hidden font-sans text-3xl font-bold uppercase leading-[1.15] tracking-tight text-transparent sm:text-4xl md:text-5xl"
            style={{ WebkitTextStroke: "1.25px #71717a" }}
          >
            <BoothLetters text="Lead the Way." />
          </h3>
          <h3
            data-booth-line-sponsor
            className="absolute inset-0 flex items-center justify-center font-sans text-3xl font-bold uppercase leading-[1.15] tracking-tight text-transparent sm:text-4xl md:text-[62px]"
            style={{ WebkitTextStroke: "1.25px #71717a" }}
          >
            <BoothLetters text="Sponsor TechForge." />
          </h3>
        </div>
        <div data-booth-support className="mt-3lg:mt-5">
          <p className="mx-auto max-w-75 lg:max-w-md text-sm leading-relaxed text-zinc-300 sm:text-[12px]">
            Be the first brand to support TechForge and position your company in
            front of builders, innovators, founders, and the next generation of
            tech talent.
          </p>
          <a
            href="https://wa.me/2347073659187"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-2 lg:mt-6 inline-flex items-center gap-2 rounded-full bg-white p-1 pl-5 pr-1 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            <span>Become a Sponsor</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
