"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, Zap } from "lucide-react";
import gsap from "gsap";
import AboutMedia from "./AboutMedia";
import { Icons } from "@/lib/icons";
import Link from "next/link";

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
  alternateIcon: AlternateIcon,
  className,
}: {
  icon: typeof ArrowUpRight;
  alternateIcon: typeof ArrowUpRight;
  className?: string;
}) {
  return (
    <span
      data-about-icon-pair
      className={`relative mx-1.5 inline-flex h-[0.7em] w-[0.7em] -translate-y-[0.05em] align-middle ${className}`}
    >
      <Icon
        data-about-icon-primary
        className="absolute inset-0 h-full w-full"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <AlternateIcon
        data-about-icon-alternate
        className="absolute inset-0 h-full w-full opacity-0"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </span>
  );
}

export default function About() {
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const primaryIcons = gsap.utils.toArray<SVGElement>(
      "[data-about-icon-primary]",
      intro,
    );
    const alternateIcons = gsap.utils.toArray<SVGElement>(
      "[data-about-icon-alternate]",
      intro,
    );

    const ctx = gsap.context(() => {
      gsap.set(primaryIcons, { autoAlpha: 1, y: 0, rotate: 0 });
      gsap.set(alternateIcons, { autoAlpha: 0, y: 6, rotate: -15 });

      if (reduceMotion) {
        gsap.set(intro, { y: 0 });
        return;
      }

      gsap.to(intro, {
        y: -6,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap
        .timeline({ repeat: -1 })
        .to(primaryIcons, {
          autoAlpha: 0,
          y: -6,
          rotate: 15,
          duration: 0.28,
          ease: "power2.in",
        }, 1.72)
        .to(
          alternateIcons,
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 0.28,
            ease: "power3.out",
          },
          1.72,
        )
        .to(alternateIcons, {
          autoAlpha: 0,
          y: 6,
          rotate: -15,
          duration: 0.28,
          ease: "power2.in",
        }, 3.72)
        .to(
          primaryIcons,
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 0.28,
            ease: "power3.out",
          },
          3.72,
        );
    }, intro);

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
            className="max-w-5xl font-display text-[26px] font-bold leading-[1.14] tracking-tight sm:text-[34px] md:text-[42px] lg:w-400 lg:max-w-none lg:text-justify lg:text-[64px] lg:leading-[74px]"
          >
            <span className="relative inline-block">
              The TechForge <ImageText image="/tf1.jpg">2026</ImageText>
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
            brings together the people actually shipping AI products{" "}
            <IconBadge
              icon={ArrowUpRight}
              alternateIcon={Zap}
              className="text-[var(--color-accent-2)]"
            />{" "}
            founders, researchers, engineers, and operators{" "}
            <IconBadge
              icon={Zap}
              alternateIcon={ArrowUpRight}
              className="text-[var(--color-accent-3)]"
            />{" "}
            for one focused day in <ImageText image="/tf4.jpg">Austin</ImageText>.
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
                building an AI company in 2026.
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
