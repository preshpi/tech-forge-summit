"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  Globe,
  Crown,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { TierId } from "@/lib/tickets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function AnimatedWord({ children }: { children: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {Array.from(children).map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-pricing-title-letter
          className="inline-block will-change-transform"
        >
          {character}
        </span>
      ))}
    </span>
  );
}

const tiers: {
  id: TierId;
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  highlight: boolean;
  icon: LucideIcon;
}[] = [
  {
    id: "builder",
    name: "The Builder",
    price: "Free",
    unit: "Individual",
    desc: "Access to all sessions and the expo/exhibition floor.",
    features: ["Access to all sessions", "Expo/exhibition access"],
    highlight: false,
    icon: Globe,
  },
  {
    id: "founder",
    name: "The Founder",
    price: "₦10,000",
    unit: "Individual",
    desc: "Everything in Builder, plus merch and front-row reserved seating.",
    features: [
      "Access to all sessions",
      "Expo/exhibition access",
      "Merch",
      "Front-row reserved seating",
    ],
    highlight: true,
    icon: Crown,
  },
  {
    id: "founder-squad",
    name: "The Founder Squad",
    price: "₦45,000",
    unit: "Group (Founder tier) × 5",
    desc: "Bring four others. Five Founder-tier passes at a group discount.",
    features: [
      "Access to all sessions",
      "Expo/exhibition access",
      "Merch",
      "Front-row reserved seating",
    ],
    highlight: false,
    icon: Users,
  },
];

export default function Pricing() {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const mobileHeadingRef = useRef<HTMLHeadingElement>(null);
  const [isHandHovered, setIsHandHovered] = useState(false);

  useEffect(() => {
    const heading = mobileHeadingRef.current;
    if (!heading) return;
    const headingElement = heading;

    const letters = gsap.utils.toArray<HTMLElement>(
      "[data-pricing-title-letter]",
      headingElement,
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

      function resetHeading() {
        gsap.set(letters, {
          autoAlpha: 0,
          y: "0.3em",
          scale: 0.96,
          filter: "blur(12px)",
          transformOrigin: "50% 50%",
        });
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

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Only run GSAP pin & scroll animation on desktop (>= 768px)
    mm.add("(min-width: 768px)", () => {
      if (!imageRef.current || !heroWrapperRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroWrapperRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(imageRef.current, {
        width: "263px",
        height: "148px",
        opacity: 1,
        ease: "power2.out",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div id="pricing" className="bg-[#f9f9f9]">
      {/* 1. HERO TITLE SECTION: Auto-height on Mobile, Full Viewport & Pinned on Desktop */}
      <div
        ref={heroWrapperRef}
        className="w-full py-16 md:py-0 md:min-h-screen flex items-center justify-start md:justify-center relative px-6 sm:px-12 overflow-hidden"
      >
        <div
          ref={heroContentRef}
          className="w-full max-w-7xl mx-auto text-left md:text-center relative"
        >
          {/* MOBILE VIEW: Stacked Plain Text, Natural Height (< md) */}
          <h2
            ref={mobileHeadingRef}
            aria-label="Secure your spot"
            className="block md:hidden font-sans font-extrabold text-6xl sm:text-7xl tracking-tight text-black leading-[0.95] flex flex-col items-start justify-center"
          >
            <span aria-hidden="true">
              <AnimatedWord>Secure</AnimatedWord>
            </span>
            <span aria-hidden="true">
              <AnimatedWord>your</AnimatedWord>
            </span>
            <span aria-hidden="true">
              <AnimatedWord>spot</AnimatedWord>
            </span>
          </h2>

          {/* DESKTOP VIEW: Interactive GSAP Layout (>= md) */}
          <h2 className="hidden md:flex font-sans font-extrabold text-[180px] tracking-tight text-black leading-[0.85] flex-col items-center justify-center">
            {/* Top Row: Secure + Original Hand Doodles */}
            <div className="relative inline-flex items-center">
              {/* Left Hand Icon */}
              <div
                onMouseEnter={() => setIsHandHovered(true)}
                onMouseLeave={() => setIsHandHovered(false)}
                className={`absolute -left-36 -top-12 cursor-pointer transition-colors duration-300 ${
                  isHandHovered ? "text-[#f472b6]" : "text-[#38bdf8]"
                }`}
              >
                <svg
                  className="w-32 h-32"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 55 18 L 78 18 M 68 8 L 78 18 L 68 28" />
                  <path d="M 28 82 L 28 58 C 28 52 34 52 34 58 L 34 32 C 34 26 42 26 42 32 L 42 55 M 42 32 L 42 24 C 42 18 50 18 50 24 L 50 55 M 50 36 L 50 30 C 50 24 58 24 58 30 L 58 60 M 58 45 C 58 40 66 40 66 46 L 66 68 C 66 82 52 86 38 86 C 28 86 28 82 28 82 Z" />
                </svg>
              </div>

              <span>Secure</span>

              {/* Right Hand Icon */}
              <div
                onMouseEnter={() => setIsHandHovered(true)}
                onMouseLeave={() => setIsHandHovered(false)}
                className={`absolute -right-36 -top-12 cursor-pointer transition-colors duration-300 ${
                  isHandHovered ? "text-[#38bdf8]" : "text-[#f472b6]"
                }`}
              >
                <svg
                  className="w-32 h-32"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 45 18 L 22 18 M 32 8 L 22 18 L 32 28" />
                  <path d="M 72 82 L 72 58 C 72 52 66 52 66 58 L 66 32 C 66 26 58 26 58 32 L 58 55 M 58 32 L 58 24 C 58 18 50 18 50 24 L 50 55 M 50 36 L 50 30 C 50 24 42 24 42 30 L 42 60 M 42 45 C 42 40 34 40 34 46 L 34 68 C 34 82 48 86 62 86 C 72 86 72 82 72 82 Z" />
                </svg>
              </div>
            </div>

            {/* Bottom Row: your + [GSAP Expanding & Opacity Image] + spot */}
            <div className="flex items-center justify-center gap-8 mt-2">
              <span>your</span>

              <div
                ref={imageRef}
                className="w-[28px] h-[16px] opacity-20 rounded-lg overflow-hidden relative shrink-0 border border-zinc-200/60 shadow-sm inline-block my-auto"
              >
                <Image
                  src="/tf18.jpg"
                  alt="Networking attendees"
                  fill
                  className="object-cover"
                />
              </div>

              <span>spot</span>
            </div>
          </h2>
        </div>
      </div>

      {/* 2. DEDICATED SEPARATE SECTION: Pricing Cards */}
      <section className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-20 pb-20">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className={`rounded-[28px] p-8 flex flex-col justify-between transition-all duration-200 ${
                  t.highlight
                    ? "bg-[#0f0f0f] text-white shadow-2xl scale-[1.02]"
                    : "bg-[#eaeaea] text-zinc-900"
                }`}
              >
                {/* Header Elements */}
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        t.highlight
                          ? "bg-primary text-black"
                          : "bg-black text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`font-mono text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase ${
                        t.highlight
                          ? "bg-zinc-800 text-primary"
                          : "bg-zinc-300/70 text-zinc-700"
                      }`}
                    >
                      Early Bird
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-2xl mt-6 tracking-tight">
                    {t.name}
                  </h3>
                  <p
                    className={`mt-3 text-xs leading-relaxed min-h-[40px] ${
                      t.highlight ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {t.desc}
                  </p>

                  <ul className="mt-8 space-y-3.5">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-xs font-semibold"
                      >
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                            t.highlight
                              ? "bg-zinc-800 text-white"
                              : "bg-white text-zinc-900"
                          }`}
                        >
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span
                          className={
                            t.highlight ? "text-zinc-200" : "text-zinc-800"
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-6 border-t border-zinc-500/20">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {t.price}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        t.highlight ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {t.unit}
                    </span>
                  </div>

                  <div className="ticket-switcher">
                    <a
                      href={`/checkout?tier=${t.id}`}
                      className="ticket-switch-button ticket-switch-primary"
                    >
                      <span className="ticket-switch-text">Buy ticket</span>
                      <ArrowUpRight
                        className="ticket-switch-symbol h-4 w-4"
                        aria-hidden="true"
                      />
                    </a>
                    <a
                      href={`/checkout?tier=${t.id}`}
                      aria-label="Get ticket"
                      className="ticket-switch-button ticket-switch-secondary"
                    >
                      <ArrowUpRight
                        className="ticket-switch-symbol h-4 w-4"
                        aria-hidden="true"
                      />
                      <span className="ticket-switch-text" aria-hidden="true">
                        Buy ticket
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
