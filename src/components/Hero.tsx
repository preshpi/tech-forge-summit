"use client";

import { useEffect, useState } from "react";
import { CountdownTicker } from "./Countdown";
import HeroBackdrop from "./HeroBackdrop";
import { ArrowUpRight, Fan } from "lucide-react";

const words = ["Skills", "Strategy", "Innovation"];
const slideCount = words.length;
const slideHoldMs = 2400;
const transitionMs = 850;
const typewriterText = "The TechForgefor all the";
const typewriterDelayMs = 180;
const typewriterStaggerMs = 45;
const typewriterRevealMs = 520;
const typewriterTotalMs =
  typewriterDelayMs +
  (typewriterText.length - 1) * typewriterStaggerMs +
  typewriterRevealMs;

const verticalWordsColors = ["#ff0054", "#fcdd01", "#ff6b4a"];

export function TypewriterText({
  children,
  startIndex = 0,
}: {
  children: string;
  startIndex?: number;
}) {
  return (
    <>
      {Array.from(children).map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="hero-typewriter-character"
          style={{
            animationDelay: `${
              typewriterDelayMs + (startIndex + index) * typewriterStaggerMs
            }ms`,
          }}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      Promise.resolve().then(() => setIntroComplete(true));
      return;
    }

    const finishIntro = window.setTimeout(
      () => setIntroComplete(true),
      typewriterTotalMs,
    );

    return () => window.clearTimeout(finishIntro);
  }, []);

  useEffect(() => {
    if (!introComplete) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    if (isTransitioning) {
      const finishTransition = window.setTimeout(() => {
        setActiveIndex(nextIndex);
        setNextIndex((nextIndex + 1) % slideCount);
        setIsTransitioning(false);
      }, transitionMs);

      return () => window.clearTimeout(finishTransition);
    }

    const startTransition = window.setTimeout(() => {
      setNextIndex((activeIndex + 1) % slideCount);
      setTransitionKey((key) => key + 1);
      setIsTransitioning(true);
    }, slideHoldMs);

    return () => window.clearTimeout(startTransition);
  }, [activeIndex, introComplete, isTransitioning, nextIndex]);

  return (
    <section
      id="top"
      className="relative flex h-[60vh] lg:h-screen flex-col justify-between overflow-hidden"
    >
      <HeroBackdrop
        activeIndex={activeIndex}
        nextIndex={nextIndex}
        isTransitioning={isTransitioning}
        transitionKey={transitionKey}
        transitionMs={transitionMs}
      />

      <div className="relative mx-auto flex w-full h-full max-w-8xl px-4 sm:px-10 ">
        {/* headline anchored to the bottom of the viewport */}
        <div className="mt-auto w-full h-full flex flex-col items-center justify-center">
          <div className="px-5 py-2 mb-10 text-[10px] lg:text-sm bg-white rounded-full text-ink flex gap-3 items-center">
            <Fan
              className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>TechForge 2.0: Forging Impact Through Innovation</span>
            <Fan
              className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
              aria-hidden="true"
            />
          </div>
          {/* <Marquee /> */}
          <h1
            aria-label={`The TechForge for all the ${words.join(", ")}`}
            className="text-[24px] lg:text-[75px] text-center font-bold leading-[1.08] tracking-tight text-paper drop-shadow-[0_2px_8px_rgba(10,10,12,0.55)] lg:leading-[1.2]"
          >
            <span aria-hidden="true">
              <span className="whitespace-nowrap">
                <TypewriterText>The Builder&apos;s Blueprint </TypewriterText>
              </span>
            </span>
            <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-[18px] font-medium lg:text-[30px]">
              {words.map((word, index) => (
                <span
                  key={word}
                  className="whitespace-nowrap"
                  style={{
                    color:
                      verticalWordsColors[index % verticalWordsColors.length],
                  }}
                >
                  {word}
                  {index < words.length - 2
                    ? ","
                    : index === words.length - 2
                      ? " &"
                      : ""}
                </span>
              ))}
              <span className="whitespace-nowrap">for the future</span>
            </div>
          </h1>

          <div className="flex w-full flex-col items-center justify-center">
            <a
              href="https://tix.africa/discover/the-tech-forge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm pointer-events-auto mt-2 lg:mt-6 inline-flex items-center gap-2 rounded-full bg-white p-2 lg:p-3 pl-5 pr-2  font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              <span>Get Your Ticket</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>

            <CountdownTicker className="mt-5" />

            {/* <a
              href="#about"
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-xs font-medium text-paper/90 drop-shadow-[0_1px_4px_rgba(10,10,12,0.75)] transition-colors hover:text-paper sm:text-sm"
            >
              Scroll to explore
              <span className="inline-block animate-bounce">↓</span>
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /* date / location meta, upper third */
}
{
  /* <div className="mt-6 flex w-full max-w-125 items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-wider text-paper/80 sm:mt-16">
          <div className="space-y-1">
            <div>December 5, 2026</div>
            <div className="text-signal">
              <Countdown />
            </div>
          </div>
          <div className="text-right space-y-1">
            <div>Downtown</div>
            <div>Lagos, Nigeria</div>
          </div>
        </div> */
}
