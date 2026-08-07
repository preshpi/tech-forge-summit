"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "When and where is Synthik 2026?",
    a: "14 October 2026 at the Marina Bay Sands Convention Centre, Singapore. Doors open at 8:30am.",
  },
  {
    q: "What's included with my ticket?",
    a: "Full access to every keynote, workshop, and networking session, plus lunch, refreshments, and the closing after-party.",
  },
  {
    q: "Are talks recorded?",
    a: "Yes — every main-stage talk is recorded and shared with ticket holders within two weeks of the event.",
  },
  {
    q: "Can I get a refund?",
    a: "Tickets are fully refundable up to 30 days before the event. After that, they're transferable to another attendee.",
  },
  {
    q: "Is there a student or non-profit discount?",
    a: "We offer 40% off for students and registered non-profits. Email us with proof of status for a code.",
  },
  {
    q: "Will there be a virtual option?",
    a: "A live stream of the main stage is included with every ticket, so you can join remotely if you can't make it in person.",
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
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

              <div className="mt-4 ticket-switcher">
                <a
                  href="#contact"
                  className="ticket-switch-button ticket-switch-primary"
                >
                  <span className="ticket-switch-text">Contact us</span>
                  <ArrowUpRight
                    className="ticket-switch-symbol h-4 w-4"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href="#contact"
                  aria-label="Contact us"
                  className="ticket-switch-button ticket-switch-secondary"
                >
                  <ArrowUpRight
                    className="ticket-switch-symbol h-4 w-4"
                    aria-hidden="true"
                  />
                  <span className="ticket-switch-text" aria-hidden="true">
                    Contact us
                  </span>
                </a>
              </div>
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
                  className={`w-full sm:w-auto inline-flex items-center justify-between gap-6 px-6 py-4 rounded-[20px] transition-all duration-200 text-left ${
                    isOpen
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-[#161616] hover:bg-[#1f1f1f] text-zinc-200"
                  }`}
                >
                  <span className="font-sans font-semibold text-sm sm:text-base tracking-tight">
                    {f.q}
                  </span>
                  <div
                    className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
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
                  <div className="w-full sm:w-[85%] bg-primary text-black rounded-[24px] p-5 font-semibold text-sm leading-relaxed self-end transition-all animate-in fade-in slide-in-from-top-2 duration-200">
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
