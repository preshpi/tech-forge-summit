"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { image: "/tf6.jpg", label: "Business", eyebrow: "01 / operators" },
  { image: "/tf7.jpg", label: "Investors", eyebrow: "02 / capital" },
  { image: "/tf8.jpg", label: "Founders", eyebrow: "03 / builders" },
  { image: "/tf9.jpg", label: "Engineers", eyebrow: "04 / systems" },
  { image: "/tf10.jpg", label: "AI Teams", eyebrow: "05 / momentum" },
];

// Minimum scroll distance spent on each image while the stage is pinned.
const SCROLL_PER_CARD = 640;

function fanState(index: number, active: number) {
  const offset = index - active;
  return {
    rotate: offset * 9,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    zIndex: slides.length - Math.abs(offset),
  };
}

export default function AudienceMap() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-cover-card]", stage);
    const progressBars = gsap.utils.toArray<HTMLElement>(
      "[data-cover-progress]",
      stage,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      function updateFan(active: number) {
        cards.forEach((card, index) => {
          gsap.set(card, {
            ...fanState(index, active),
          });
        });

        progressBars.forEach((bar, index) => {
          const distance = Math.abs(index - active);
          gsap.set(bar, {
            scaleX: Math.max(0.12, 1 - distance),
            opacity: distance < 0.55 ? 1 : 0.28,
          });
        });
      }

      gsap.set(cards, { transformOrigin: "50% 100%" });
      updateFan(0);

      if (reduceMotion) {
        updateFan(2);
        return;
      }

      gsap.from(cards, {
        autoAlpha: 0,
        rotate: "+=20",
        duration: 1.1,
        ease: "expo.out",
        stagger: { each: 0.06, from: "start" },
        scrollTrigger: { trigger: wrapper, start: "top 82%", once: true },
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: () =>
          `+=${
            (slides.length - 1) *
            Math.max(SCROLL_PER_CARD, window.innerHeight * 0.72)
          }`,
        pin: stage,
        pinSpacing: true,
        scrub: 0.55,
        snap: {
          snapTo: 1 / (slides.length - 1),
          duration: { min: 0.18, max: 0.42 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const active = progress * (slides.length - 1);
          updateFan(active);
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={stageRef}
        className="relative h-svh w-full overflow-hidden bg-ink-soft lg:h-screen"
      >
        {/* <div className="absolute left-4 top-5 z-30 font-mono text-[10px] uppercase tracking-widest text-paper/55 sm:left-6 sm:top-6 sm:text-xs">
          Audience Index
        </div> */}

        <div className="absolute left-1/2 top-1/2 h-[min(68svh,560px)] w-[min(calc(100vw-3rem),340px)] -translate-x-1/2 -translate-y-1/2 sm:h-[min(72svh,560px)] lg:bottom-0 lg:top-auto lg:h-[85%] lg:w-[min(50vw,340px)] lg:translate-y-0">
          {slides.map((slide) => (
            <article
              key={slide.image}
              data-cover-card
              className="absolute inset-0 overflow-hidden rounded-2xl border border-paper/10 bg-ink shadow-2xl shadow-black/45 will-change-transform"
            >
              <Image
                src={slide.image}
                alt={`${slide.label} at TechForge`}
                fill
                sizes="(min-width: 1024px) 540px, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/16 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-paper/50">
                  {slide.eyebrow}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-paper sm:text-2xl">
                  {slide.label}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute inset-x-4 bottom-5 z-30 flex gap-2 sm:inset-x-6 sm:bottom-6">
          {slides.map((slide) => (
            <span
              key={slide.image}
              className="h-px flex-1 origin-left bg-paper/65"
              data-cover-progress
            />
          ))}
        </div>
      </div>
    </div>
  );
}
