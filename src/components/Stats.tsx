"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: 1000,
    suffix: "+",
    label: "Attendees",
    desc: "People from across tech, all in one room to learn, connect, and exchange ideas.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Speakers",
    desc: "Experienced voices sharing practical lessons, real stories, and industry insight.",
  },
  {
    value: 1,
    suffix: "",
    label: "Day",
    desc: "One full day of talks, conversations, learning, and meaningful connections.",
  },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const formatter = new Intl.NumberFormat("en-US");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-stat-row]", section);

      rows.forEach((row) => {
        const counter = row.querySelector<HTMLElement>(
          "[data-stat-counter]",
        ) as HTMLElement | null;
        const letters = gsap.utils.toArray<HTMLElement>(
          "[data-stat-letter]",
          row,
        );
        if (!counter) return;
        const counterElement = counter;

        const target = Number(counterElement.dataset.target);
        const suffix = counterElement.dataset.suffix ?? "";

        if (reduceMotion) {
          counterElement.textContent = `${formatter.format(target)}${suffix}`;
          gsap.set(letters, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            filter: "blur(0px)",
          });
          return;
        }

        function scatterLetters() {
          gsap.set(letters, {
            autoAlpha: 0,
            x: (index) => ((index % 3) - 1) * (44 + index * 5),
            y: (index) => (index % 2 === 0 ? -58 : 62) - index * 3,
            rotation: (index) => (index % 2 === 0 ? -1 : 1) * (18 + index * 5),
            filter: "blur(10px)",
            transformOrigin: "50% 50%",
          });
        }

        scatterLetters();

        const count = { value: 0 };
        const timeline = gsap.timeline({ paused: true });

        timeline
          .to(
            count,
            {
              value: target,
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => {
                counterElement.textContent = `${formatter.format(
                  Math.round(count.value),
                )}${suffix}`;
              },
            },
            0,
          )
          .to(
            letters,
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotation: 0,
              filter: "blur(0px)",
              duration: 1.15,
              ease: "expo.out",
              stagger: {
                each: 0.055,
                from: "random",
              },
            },
            0.08,
          );

        function replay() {
          timeline.pause(0);
          count.value = 0;
          counterElement.textContent = `0${suffix}`;
          scatterLetters();
          timeline.invalidate().restart();
        }

        ScrollTrigger.create({
          trigger: row,
          start: "top 82%",
          end: "bottom 18%",
          onEnter: replay,
          onEnterBack: replay,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl overflow-hidden border-y border-line border-zinc-800 bg-ink-soft/40 lg:overflow-visible"
    >
      <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="mb-10 max-w-xl font-display text-xl font-bold sm:mb-14 sm:text-2xl lg:text-3xl">
          The numbers behind a day at The TechForge
        </h2>
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:gap-8">
          {stats.map((s) => (
            <div
              key={s.label}
              data-stat-row
              className="flex flex-col items-start gap-5 border-t border-line border-zinc-800 pt-6 lg:min-w-0 lg:flex-1"
            >
              <div className="min-w-0">
                <p
                  aria-label={`${s.value.toLocaleString("en-US")}${s.suffix}`}
                  className="text-[42px] font-bold leading-none lg:text-[76px]"
                >
                  <span
                    aria-hidden="true"
                    data-stat-counter
                    data-target={s.value}
                    data-suffix={s.suffix}
                  >
                    0{s.suffix}
                  </span>
                </p>
                <p className="mt-1 text-[38px] font-bold leading-[0.9] text-[#464646] lg:text-[54px]">
                  <span className="sr-only">{s.label}</span>
                  <span aria-hidden="true" className="inline-block">
                    {Array.from(s.label).map((letter, index) => (
                      <span
                        key={`${letter}-${index}`}
                        data-stat-letter
                        className="inline-block will-change-transform"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </p>
              </div>
              <p className="max-w-md text-sm font-bold leading-relaxed text-paper/50 sm:text-base">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
