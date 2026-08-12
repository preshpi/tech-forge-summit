"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutMedia from "./AboutMedia";
import { Icons } from "@/lib/icons";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

function TightWord({ children }: { children: ReactNode }) {
  return (
    <span data-tight-word className="inline-block will-change-transform">
      {children}
    </span>
  );
}

function TightWords({ children }: { children: string }) {
  const words = children.split(" ");

  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <TightWord>{word}</TightWord>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

function ImageText({
  children,
  image,
}: {
  children: ReactNode;
  image: string;
}) {
  return (
    <span
      className="image-text-fill"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      {children}
    </span>
  );
}

function IconBadge({
  icon: Icon,
  className,
}: {
  icon: typeof ArrowUpRight;
  className?: string;
}) {
  return (
    <span className={`inline-flex align-middle mx-1.5 ${className}`}>
      <Icon
        className="h-[0.7em] w-[0.7em]"
        strokeWidth={2.5}
        style={{ transform: "translateY(-0.05em)" }}
      />
    </span>
  );
}

export default function About() {
  const introRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const intro = introRef.current;
    const heading = headingRef.current;
    if (!intro || !heading) return;
    const introElement = intro;
    const headingElement = heading;

    const words = gsap.utils.toArray<HTMLElement>(
      "[data-tight-word]",
      headingElement,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(words, {
          x: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
        });
        return;
      }

      let lines: HTMLElement[][] = [];

      function getLayoutTop(element: HTMLElement) {
        let top = 0;
        let node: HTMLElement | null = element;

        while (node && node !== headingElement) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }

        return top;
      }

      function measureLines() {
        lines = [];

        words.forEach((word) => {
          const top = getLayoutTop(word);
          const line = lines.find(
            (candidate) => Math.abs(getLayoutTop(candidate[0]) - top) < 4,
          );

          if (line) {
            line.push(word);
          } else {
            lines.push([word]);
          }
        });

        lines.sort(
          (first, second) =>
            getLayoutTop(first[0]) - getLayoutTop(second[0]),
        );
      }

      const ease = gsap.parseEase("power3.out");

      function render(progress: number) {
        lines.forEach((line, lineIndex) => {
          const lineProgress = gsap.utils.clamp(
            0,
            1,
            progress * lines.length - lineIndex,
          );
          const tightened = ease(lineProgress);
          const center = (line.length - 1) / 2;
          const spreadUnit = Math.min(
            54,
            Math.max(
              22,
              (headingElement.clientWidth / Math.max(line.length, 4)) * 0.55,
            ),
          );

          line.forEach((word, wordIndex) => {
            gsap.set(word, {
              x: (wordIndex - center) * spreadUnit * (1 - tightened),
              autoAlpha: 0.38 + tightened * 0.62,
              filter: `blur(${(1 - tightened) * 7}px)`,
            });
          });
        });
      }

      measureLines();
      render(0);

      const scrollState = { progress: 0 };

      gsap.to(scrollState, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(scrollState.progress),
        scrollTrigger: {
          trigger: introElement,
          start: "top top",
          end: () =>
            `+=${Math.max(window.innerHeight * 1.1, lines.length * 220)}`,
          pin: introElement,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measureLines();
            render(scrollState.progress);
          },
        },
      });
    }, headingElement);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="overflow-x-clip">
      <div
        ref={introRef}
        className="mx-auto min-h-svh max-w-8xl px-4 pt-20 sm:px-6 sm:pt-24 md:pt-32"
      >
        <p className="eyebrow mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal">
          {Icons().sparkel}
          About The TechForge 2026
        </p>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-52">
          <h2
            ref={headingRef}
            className="max-w-5xl font-display text-[26px] font-bold leading-[1.14] tracking-tight sm:text-[34px] md:text-[42px] lg:w-400 lg:max-w-none lg:text-justify lg:text-[64px] lg:leading-[74px]"
          >
            <span className="relative inline-block">
              <TightWords>The TechForge</TightWords>{" "}
              <TightWord>
                <ImageText image="/tf1.jpg">2027</ImageText>
              </TightWord>
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 10 Q20 2 45 8 T95 6 T150 9 T200 4"
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            <TightWords>
              brings together the people actually shipping AI products
            </TightWords>{" "}
            <TightWord>
              <IconBadge
                icon={ArrowUpRight}
                className="text-[var(--color-accent-2)]"
              />
            </TightWord>{" "}
            <TightWords>
              founders, researchers, engineers, and operators
            </TightWords>{" "}
            <TightWord>
              <IconBadge
                icon={Zap}
                className="text-[var(--color-accent-3)]"
              />
            </TightWord>{" "}
            <TightWords>for one focused day in</TightWords>{" "}
            <TightWord>
              <ImageText image="/tf4.jpg">Austin</ImageText>.
            </TightWord>
          </h2>
          <div className="w-full max-w-xl lg:mx-auto lg:mt-14 lg:w-200 lg:max-w-none lg:px-6">
            {/* <div className="rounded-3xl overflow-hidden border border-line bg-ink-soft aspect-[4/3] relative">
          <div
            className="absolute inset-0"
            style={{ background: gradientFor("about-preview") }}
          />
        </div> */}

            <div className="space-y-5 text-sm leading-relaxed text-paper/70 sm:text-base lg:space-y-6 lg:pt-2">
              <p>
                Expect unfiltered talks, hands-on workshops, and the kind of
                hallway conversations that turn into your next hire, customer,
                or co-founder.
              </p>
              <p>
                No vendor pitches, no recycled slides. Every session is curated
                around what&apos;s working right now: agent architectures,
                evals, distribution, fundraising, and the real economics of
                building an AI company in 2027.
              </p>
              <div className="ticket-switcher">
                <Link
                  href="/checkout?tier=general"
                  transitionTypes={["nav-forward"]}
                  className="ticket-switch-button ticket-switch-primary"
                >
                  <span className="ticket-switch-text">Get ticket</span>
                  <ArrowUpRight
                    className="ticket-switch-symbol h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/checkout?tier=general"
                  transitionTypes={["nav-forward"]}
                  aria-label="Get ticket"
                  className="ticket-switch-button ticket-switch-secondary"
                >
                  <ArrowUpRight
                    className="ticket-switch-symbol h-4 w-4"
                    aria-hidden="true"
                  />
                  <span className="ticket-switch-text" aria-hidden="true">
                    Get ticket
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <AboutMedia />
      </div>
    </section>
  );
}
