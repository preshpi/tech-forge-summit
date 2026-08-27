"use client";

import { useEffect, useState } from "react";
import Countdown from "./Countdown";
import HeroBackdrop from "./HeroBackdrop";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const words = ["Founders", "Engineers", "Researchers", "Operators", "Investors"];
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

function TypewriterText({
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
          className="hero-typewriter-character text-[28px] lg:text-[56px]"
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

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const wordDisplayIndex = isTransitioning
    ? nextIndex === 0
      ? words.length
      : nextIndex
    : activeIndex;

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pb-6 pt-24 sm:min-h-screen sm:pb-10 sm:pt-32"
    >
      <HeroBackdrop
        activeIndex={activeIndex}
        nextIndex={nextIndex}
        isTransitioning={isTransitioning}
        transitionKey={transitionKey}
        transitionMs={transitionMs}
      />

      <div className="relative mx-auto flex w-full max-w-8xl flex-1 flex-col px-4 sm:px-10">
        {/* date / location meta, upper third */}
        <div className="mt-6 flex w-full max-w-125 items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-wider text-paper/80 sm:mt-16">
          <div className="space-y-1">
            <div>December 5, 2026</div>
            <div className="text-signal">
              <Countdown />
            </div>
          </div>
          <div className="text-right space-y-1">
            <div>The Zone</div>
            <div>Lagos, Nigeria</div>
          </div>
        </div>

        {/* headline anchored to the bottom of the viewport */}
        <div className="mt-auto pt-12 sm:pt-16">
          {/* <Marquee /> */}
          <h1
            aria-label={`The TechForge for all the ${words.join(", ")}`}
            className="max-w-5xl text-[34px] font-bold leading-[1.08] tracking-tight text-paper sm:text-[42px] md:text-[48px] lg:text-[56px] lg:leading-[1.2]"
          >
            <span aria-hidden="true">
              <span className="whitespace-nowrap">
                <TypewriterText>Behind everything worth</TypewriterText>
              </span>
              <br />
              <span className="whitespace-nowrap">
                <TypewriterText startIndex={"The TechForge".length}>
                  building are the
                </TypewriterText>
              </span>{" "}
              <span
                className={`hero-word-window vertical-word-window inline-flex align-baseline ${
                  introComplete ? "hero-word-window-ready" : ""
                }`}
              >
                <span
                  className={`vertical-word-stack ${
                    isTransitioning ? "vertical-word-stack-moving" : ""
                  }  text-[28px] lg:text-[56px]`}
                  style={{
                    transform: `translateY(-${wordDisplayIndex * 1.05}em)`,
                    transitionDuration: isTransitioning
                      ? `${transitionMs}ms`
                      : "0ms",
                  }}
                >
                  {[...words, words[0]].map((word, index) => (
                    <span key={`${word}-${index}`}>{word}</span>
                  ))}
                </span>
              </span>
            </span>
          </h1>

          <div className="mt-7 flex w-full items-center justify-between gap-3 sm:mt-10">
            <div className="ticket-switcher">
              <Link
                href="#"
                transitionTypes={["nav-forward"]}
                className="ticket-switch-button ticket-switch-primary"
              >
                <span className="ticket-switch-text">Get ticket</span>
                <ArrowUpRight className="ticket-switch-symbol h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#"
                transitionTypes={["nav-forward"]}
                aria-label="Get ticket"
                className="ticket-switch-button ticket-switch-secondary"
              >
                <ArrowUpRight className="ticket-switch-symbol h-4 w-4" aria-hidden="true" />
                <span className="ticket-switch-text" aria-hidden="true">
                  Get ticket
                </span>
              </Link>
            </div>
            <a
              href="#about"
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-xs font-medium text-paper/70 transition-colors hover:text-paper sm:text-sm"
            >
              Scroll to explore
              <span className="inline-block animate-bounce">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
