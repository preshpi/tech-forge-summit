"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gradientFor } from "@/lib/avatar";
import { mainEventSpeakers } from "@/lib/speakers";

gsap.registerPlugin(ScrollTrigger);

type SpeakerSlot = (typeof mainEventSpeakers)[number] & {
  id: string;
  number: string;
  reveal?: boolean;
};

const speakerSlots: SpeakerSlot[] = [
  ...mainEventSpeakers.map((speaker, index) => ({
    ...speaker,
    id: `speaker-${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
  })),
  ...Array.from({ length: 13 }, (_, index) => {
    const number = mainEventSpeakers.length + index + 1;

    return {
      id: `speaker-reveal-${number}`,
      number: String(number).padStart(2, "0"),
      name: "Speaker reveal",
      role: "New voice joining the room",
      org: "Coming soon",
      image: "",
      reveal: true,
    };
  }),
];

const CARDS_PER_SLIDE = 8;
const speakerSlides = Array.from(
  { length: Math.ceil(speakerSlots.length / CARDS_PER_SLIDE) },
  (_, index) =>
    speakerSlots.slice(index * CARDS_PER_SLIDE, (index + 1) * CARDS_PER_SLIDE),
);
const SLIDE_COUNT = speakerSlides.length;

function wrapIndex(value: number, total: number) {
  return ((value % total) + total) % total;
}

function SocialIcons() {
  const iconClass =
    "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-colors group-hover/card:bg-black/60 sm:h-9 sm:w-9";

  return (
    <div className="flex gap-1.5" aria-hidden="true">
      <span className={iconClass}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className={iconClass}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path
            d="M11.025.656h2.147L8.482 6.03 14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
}

function ApplyToSpeakButton() {
  return (
    <Link
      href="https://forms.gle/pcEGTq4QFJkVZyG99"
      transitionTypes={["nav-forward"]}
      className="inline-flex w-fit items-center gap-3 rounded-full bg-black py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      <span>Apply to speak</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-signal)] text-black">
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

export default function Speakers() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  const moveSlide = useCallback((direction: number) => {
    setActiveSlide((current) => wrapIndex(current + direction, SLIDE_COUNT));
  }, []);

  const goToSlide = useCallback((slide: number) => {
    setActiveSlide(wrapIndex(slide, SLIDE_COUNT));
  }, []);

  const pauseAutoplay = useCallback(() => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const resumeAutoplay = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      resumeTimerRef.current = null;
    }, 1600);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      if (!isInteractingRef.current) moveSlide(1);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [moveSlide, reduceMotion]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const intro = section.querySelector("[data-speaker-intro]");
      const footer = section.querySelector("[data-speaker-footer]");
      const surfaces = gsap.utils.toArray<HTMLElement>(
        "[data-speaker-surface]",
        section,
      );

      if (prefersReducedMotion) {
        gsap.set([intro, footer, ...surfaces], {
          clearProps: "all",
        });
        return;
      }

      const animatedElements = [intro, footer, ...surfaces];

      function reveal(direction: number) {
        gsap.killTweensOf(animatedElements);

        gsap
          .timeline()
          .fromTo(
            intro,
            { autoAlpha: 0, y: direction * 42, filter: "blur(12px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "power3.out",
            },
            0.04,
          )
          .fromTo(
            surfaces,
            {
              autoAlpha: 0,
              y: direction * 84,
              scale: 0.86,
              rotateX: direction * 14,
              filter: "blur(14px)",
              clipPath: "inset(16% 8% 16% 8% round 28px)",
              transformPerspective: 900,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              clipPath: "inset(0% 0% 0% 0% round 20px)",
              duration: 1.05,
              ease: "expo.out",
              stagger: {
                amount: 0.68,
                grid: "auto",
                from: "center",
              },
            },
            0.1,
          )
          .fromTo(
            footer,
            {
              autoAlpha: 0,
              y: direction * 28,
              filter: "blur(8px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.65,
              ease: "power3.out",
            },
            0.58,
          );
      }

      function leave(direction: number) {
        gsap.killTweensOf(animatedElements);

        gsap
          .timeline()
          .to(
            surfaces,
            {
              autoAlpha: 0,
              y: direction * -58,
              scale: 0.91,
              rotateX: direction * -10,
              filter: "blur(10px)",
              duration: 1,
              ease: "power2.inOut",
              stagger: {
                amount: 0.45,
                grid: "auto",
                from: direction > 0 ? "end" : "start",
              },
            },
            0,
          )
          .to(
            [intro, footer],
            {
              autoAlpha: 0,
              y: direction * -24,
              filter: "blur(8px)",
              duration: 0.75,
              ease: "power2.inOut",
            },
            0.08,
          );
      }

      gsap.set([intro, footer, ...surfaces], { autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 76%",
        endTrigger: footer ?? section,
        end: "bottom 8%",
        onEnter: () => reveal(1),
        onLeave: () => leave(1),
        onEnterBack: () => reveal(-1),
        onLeaveBack: () => leave(-1),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="speakers" 
      aria-labelledby="speakers-heading"
      className="relative isolate overflow-hidden bg-[#f5f4ff] py-20 text-ink sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-10">
        <header
          data-speaker-intro
          className="mb-10 flex flex-col gap-8 sm:mb-14 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <span aria-hidden="true">✦</span>
              Meet the speakers
            </p>
            <h2
              id="speakers-heading"
              className="max-w-3xl font-display text-[32px] font-bold leading-[0.98] tracking-[-0.04em] lg:text-[72px]"
            >
              The voices shaping what comes next.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
              Builders, operators, and creative minds sharing the lessons behind
              the work—not just the highlight reel.
            </p>
          </div>

          <div className="hidden shrink-0 sm:block">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Want to join the lineup?
            </p>
            <ApplyToSpeakButton />
          </div>
        </header>

        <div
          aria-label="Speaker lineup"
          onPointerEnter={pauseAutoplay}
          onPointerLeave={resumeAutoplay}
          onFocusCapture={pauseAutoplay}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              resumeAutoplay();
            }
          }}
          className="overflow-hidden [perspective:1200px]"
        >
          <div
            className={`flex items-start will-change-transform ${
              reduceMotion
                ? ""
                : "transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
            }`}
            style={{
              transform: `translate3d(-${activeSlide * 100}%, 0, 0)`,
            }}
          >
            {speakerSlides.map((slide, slideIndex) => (
              <div
                key={`speaker-slide-${slideIndex}`}
                role="list"
                aria-label={`Speaker slide ${slideIndex + 1} of ${SLIDE_COUNT}`}
                aria-hidden={activeSlide !== slideIndex}
                className="grid w-full shrink-0 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
              >
                {slide.map((item) => (
                  <article
                    key={item.id}
                    role="listitem"
                    data-speaker-card
                    aria-label={
                      item.reveal ? `${item.name} ${item.number}` : item.name
                    }
                    className="min-w-0"
                  >
                    <div data-speaker-surface className="h-full">
                      <div
                        className="group/card relative aspect-[4/5] h-full overflow-hidden rounded-[18px] bg-zinc-900 shadow-[0_18px_55px_rgba(40,38,92,0.12)] ring-1 ring-black/5 sm:rounded-[24px]"
                        style={{ background: gradientFor(item.id) }}
                      >
                        {item.reveal ? (
                          <>
                            <div
                              className="absolute inset-0 opacity-80"
                              style={{
                                background:
                                  "radial-gradient(circle at 18% 15%, rgba(255,255,255,.28), transparent 28%), radial-gradient(circle at 90% 90%, rgba(252,221,1,.32), transparent 34%), linear-gradient(145deg, rgba(72,69,226,.88), rgba(28,27,74,.96))",
                              }}
                            />
                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15 sm:h-52 sm:w-52" />
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/15 sm:h-32 sm:w-32" />
                            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/80 backdrop-blur sm:left-5 sm:top-5 sm:text-[10px]">
                              Reveal soon
                            </span>
                            <span
                              className="absolute right-3 top-10 font-display text-[76px] font-bold leading-none text-white/8 sm:right-5 sm:top-14 sm:text-[116px]"
                              aria-hidden="true"
                            >
                              {item.number}
                            </span>
                            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-signal)] sm:text-[10px]">
                                Speaker {item.number}
                              </p>
                              <h3 className="mt-2 font-display text-lg font-bold leading-tight sm:text-2xl">
                                {item.name}
                              </h3>
                              <p className="mt-1.5 text-[10px] text-white/65 sm:text-xs">
                                {item.role}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 1023px) 50vw, 25vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.045]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/5" />
                            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-white backdrop-blur sm:left-5 sm:top-5 sm:text-[10px]">
                              {item.number}
                            </span>
                            <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 sm:right-4 sm:top-4 lg:opacity-100">
                              <SocialIcons />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                              <h3 className="font-display text-lg font-bold leading-tight sm:text-2xl">
                                {item.name}
                              </h3>
                              <p className="mt-1.5 text-[10px] leading-relaxed text-white/70 sm:text-xs">
                                {item.role}{" "}
                                <span className="text-white/40">at</span>{" "}
                                {item.org}
                              </p>
                            </div>
                          </>
                        )}

                        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <footer
          data-speaker-footer
          className="mt-8 flex flex-col gap-6 border-t border-black/10 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              Slide {String(activeSlide + 1).padStart(2, "0")} /{" "}
              {String(SLIDE_COUNT).padStart(2, "0")}
            </span>
            <div
              className="flex items-center gap-1.5"
              aria-label="Carousel slides"
            >
              {Array.from({ length: SLIDE_COUNT }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show speaker slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-[var(--color-primary)]"
                      : "w-2 bg-black/15 hover:bg-black/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="sm:hidden">
              <ApplyToSpeakButton />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Show previous speaker slide"
                onClick={() => moveSlide(-1)}
                onPointerDown={pauseAutoplay}
                onPointerUp={resumeAutoplay}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white text-black transition-[background-color,transform] hover:-translate-x-1 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Show next speaker slide"
                onClick={() => moveSlide(1)}
                onPointerDown={pauseAutoplay}
                onPointerUp={resumeAutoplay}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <span className="sr-only" aria-live="polite">
            Speaker slide {activeSlide + 1} of {SLIDE_COUNT}
          </span>
        </footer>
      </div>
    </section>
  );
}
