"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gradientFor } from "@/lib/avatar";
import Image from "next/image";

const speakers = [
  {
    name: "Imam Abubakar",
    role: "Founder",
    org: "Sqaleup Inc",
    image: "/imam.jpeg",
  },
  {
    name: "Folashade Blessing",
    role: "Senior Product Designer",
    org: "Interswitch Group",
    image: "/folashade.jpeg",
  },
  {
    name: "Dominus Kelvin",
    role: "Lead maintainer",
    org: "Sails",
    image: "/koo.jpg",
  },
  {
    name: "Daniel Okafor",
    role: "Principal Engineer",
    org: "Insight Analytics",
    image: "/daniel.jpeg",
  },
  { name: "Sofia Andersson", role: "VP of Research", org: "TechSphere" },
  { name: "Wei Liu", role: "Co-Founder", org: "FutureTech Labs" },
];

function SocialIcons({ onImage = false }: { onImage?: boolean }) {
  const iconClass = onImage
    ? "flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/55 text-sm text-white backdrop-blur-md"
    : "flex h-10 w-10 items-center justify-center rounded-lg bg-ink/5 text-black";

  return (
    <div className="flex gap-2">
      <span className={iconClass}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
          />
        </svg>
      </span>
      <span className={iconClass}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 14 14"
          aria-hidden="true"
        >
          <path d="M0 0h14v14H0z" fill="none" />
          <path
            fill="currentColor"
            d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
          />
        </svg>
      </span>
    </div>
  );
}

export default function Speakers() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileActive, setMobileActive] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    function updateMobileActive() {
      if (!track) return;
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setMobileActive((current) =>
        current === closestIndex ? current : closestIndex,
      );
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateMobileActive);
    }

    track.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", scheduleUpdate);
    };
  }, []);

  function goToSlide(index: number) {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;

    const targetLeft =
      slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  const isInteractingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isInteractingRef.current) return;
      goToSlide((mobileActive + 1) % speakers.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [mobileActive]);

  function pauseAutoplay() {
    isInteractingRef.current = true;
  }

  function resumeAutoplay() {
    window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 4000);
  }

  useEffect(() => {
    let frame = 0;

    function updateActiveSpeaker() {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;

        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActive((current) =>
        current === closestIndex ? current : closestIndex,
      );
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveSpeaker);
    }

    updateActiveSpeaker();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const speaker = speakers[active];

  return (
    <section id="speakers" className="bg-white  py-24 md:py-32">
      <div className="px-12">
        <p className="flex items-center text-black gap-2 font-mono text-xs uppercase tracking-widest mb-14">
          <span className="text-ink">✦</span> Meet the speakers
        </p>

        <div className="md:hidden">
          <div
            ref={trackRef}
            onPointerDown={pauseAutoplay}
            onPointerUp={resumeAutoplay}
            onPointerCancel={resumeAutoplay}
            onTouchStart={pauseAutoplay}
            onTouchEnd={resumeAutoplay}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 -mx-12 px-12 scrollbar-none"
          >
            {speakers.map((item, index) => (
              <article
                key={item.name}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                className="w-[82%] shrink-0 snap-center"
              >
                <div
                  className="relative aspect-4/5 overflow-hidden rounded-2xl"
                  style={{ background: gradientFor(item.name) }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 767px) calc(100vw - 2rem), 340px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-6xl font-bold text-black/15">
                        {item.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3">
                    <SocialIcons onImage />
                  </div>
                </div>

                <div className="pt-4 text-black">
                  <h3 className="font-display text-2xl font-bold leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-600">
                    {item.role} <span className="text-zinc-400">at</span>{" "}
                    {item.org}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {speakers.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={`Go to ${item.name}`}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === mobileActive
                    ? "w-6 bg-signal-dim"
                    : "w-1.5 bg-ink/15"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hidden gap-12 md:grid md:grid-cols-[340px_1fr] md:gap-32 lg:gap-48">
          <div className="md:sticky md:top-32 self-start">
            <div
              className="relative aspect-[3/4.2] overflow-hidden rounded-3xl border border-ink/10"
              style={{ background: gradientFor(speaker.name) }}
            >
              {speakers.map((item, index) => (
                <div
                  key={item.name}
                  className={`absolute inset-0 items-center justify-center ${
                    index === active ? "flex" : "hidden"
                  }`}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      loading="eager"
                      sizes="(min-width: 768px) 340px, calc(100vw - 2rem)"
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-display text-6xl font-bold text-black/15">
                      {item.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="">
                <div className="font-display font-bold text-lg text-ink">
                  {speaker.role}
                </div>
                <div className="font-mono text-xs uppercase tracking-wide text-ink/40 mt-1">
                  {speaker.org}
                </div>
              </div>
              <div className="mt-4">
                <SocialIcons />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {speakers.map((s, i) => (
              <div
                key={s.name}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={`py-4 md:py-6 flex items-center gap-4 ${i === active ? "px-12" : "px-0"}`}
              >
                <ArrowRight
                  className={`h-8 w-8 md:h-10 md:w-10 shrink-0 text-signal-dim transition-all duration-300 ${
                    i === active
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  }`}
                  strokeWidth={2.5}
                />
                <span
                  className={`font-display font-bold tracking-tight text-4xl sm:text-5xl md:text-5xl lg:text-6xl transition-colors duration-300 ${
                    i === active ? "text-black" : "text-zinc-300"
                  }`}
                >
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
