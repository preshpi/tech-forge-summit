"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "What is The TechForge 2026?",
    a: "The TechForge 2026 is a one-day tech event bringing together people exploring tech and those already working in the industry. It’s a space to learn from real experiences, ask questions, meet other people in the ecosystem, and get a clearer picture of what’s possible in tech.",
  },
  {
    q: "When is The TechForge 2026?",
    a: "The TechForge 2026 is scheduled for December 5, 2026",
  },
  {
    q: "Who is The TechForge for?",
    a: "It’s for students, people exploring tech, developers, engineers, designers, founders, product professionals, and others interested in building or growing within the tech ecosystem. You don’t need years of experience to be in the room.",
  },
  {
    q: "I’m new to tech. Should I attend?",
    a: "Yes. One of the reasons The TechForge exists is to help people who are interested in tech but aren’t sure where to begin or what direction to take.",
  },
  {
    q: "What should I expect?",
    a: "one day of talks, panels, and hands-on sessions from people working in tech, plus room to ask questions, meet others in the ecosystem, and make connections that continue long after the event.",
  },
  {
    q: "Will there be a virtual option?",
    a: "Yes. A live stream of the main stage is included with every ticket, so you can follow both day remotely if you can't make it in person.",
  },
  {
    q: "Will there be a pre-event?",
    a: "Yes.",
  },
  {
    q: "How can I contact The TechForge team?",
    a: "For enquiries, email info.techforge@gmail.com or call +234 707 365 9187.",
  },
];

function AnimatedWord({ children }: { children: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {Array.from(children).map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-faq-title-letter
          className="inline-block will-change-transform"
        >
          {character}
        </span>
      ))}
    </span>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const headingElement = heading;

    const letters = gsap.utils.toArray<HTMLElement>(
      "[data-faq-title-letter]",
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

  return (
    <section
      id="faq"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-20 bg-black text-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading & Contact Card */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-12 lg:space-y-24">
          <div>
            {/* + FAQS Tag */}
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-6">
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span>FAQS</span>
            </div>

            <h2
              ref={headingRef}
              aria-label="Frequently asked questions"
              className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]"
            >
              <span aria-hidden="true">
                <AnimatedWord>Frequently</AnimatedWord>{" "}
                <AnimatedWord>asked</AnimatedWord>
                <br />
                <AnimatedWord>questions</AnimatedWord>
              </span>
            </h2>
          </div>

          {/* Got Questions? Card */}
          <div className="rounded-[24px] bg-[#1a1a1a] p-4 sm:p-5 border border-zinc-800/80 flex items-center gap-5 max-w-md">
            <div className="relative h-28 w-28 rounded-[16px] overflow-hidden shrink-0 border border-zinc-700/50">
              <Image
                src="/tf3.jpg"
                alt="Support representative"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-between py-1">
              <div>
                <h3 className="font-sans font-bold text-base text-white">
                  Got Questions?
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">
                  Can&apos;t find what you&apos;re looking for? Reach out —
                  we&apos;re fast.
                </p>
              </div>

              <a
                href="https://wa.me/2347073659187"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm pointer-events-auto mt-2 lg:mt-6 inline-flex items-center gap-2 rounded-full bg-white p-2 lg:py-1.5 pl-4 pr-2 w-fit font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                <span>Contact us</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Chat-Bubble Accordion FAQs */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="flex flex-col items-end space-y-3">
                {/* Question Pill */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`inline-flex w-full items-center justify-between gap-4 rounded-[16px] px-4 py-3 text-left transition-all duration-200 md:w-auto md:gap-6 md:rounded-[20px] md:px-6 md:py-4 ${
                    isOpen
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-[#161616] hover:bg-[#1f1f1f] text-zinc-200"
                  }`}
                >
                  <span className="font-sans font-semibold text-sm sm:text-base tracking-tight">
                    {f.q}
                  </span>
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors md:h-7 md:w-7 md:rounded-xl ${
                      isOpen
                        ? "bg-[#282828] text-zinc-300"
                        : "bg-[#222222] text-zinc-400"
                    }`}
                  >
                    {isOpen ? (
                      <X className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </div>
                </button>

                {/* Green Answer Speech Bubble */}
                {isOpen && (
                  <div className="w-full sm:w-[85%] bg-[var(--color-primary)] text-white rounded-[24px] p-5 font-semibold text-sm leading-relaxed self-end transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
