"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Link2, AtSign } from "lucide-react";
import { gradientFor } from "@/lib/avatar";
import Image from "next/image";

const speakers = [
  { name: "Imam Abubakar", role: "Founder", org: "Sqaleup Inc", image: '/imam.jpeg' },
  {
    name: "Folashade Blessing Adegbite",
    role: "Senior Product Designer",
    org: "Interswitch Group",
    image: '/folashade.jpeg'
  },
  { name: "Dominus Kelvin", role: "Lead maintainer", org: "Sails", image: '/koo.jpg' },
  {
    name: "Daniel Okafor",
    role: "Principal Engineer",
    org: "Insight Analytics",
  },
  { name: "Sofia Andersson", role: "VP of Research", org: "TechSphere" },
  { name: "Wei Liu", role: "Co-Founder", org: "FutureTech Labs" },
];

export default function Speakers() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="flex items-center text-black gap-2 font-mono text-xs uppercase tracking-widest mb-14">
          <span className="text-ink">✦</span> Meet the speakers
        </p>

        <div className="grid md:grid-cols-[340px_1fr] gap-12 md:gap-20">
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

            <div className="mt-5">
              <div className="font-display font-bold text-lg">
                {speaker.role}
              </div>
              <div className="font-mono text-xs uppercase tracking-wide text-ink/40 mt-1">
                {speaker.org}
              </div>
              <div className="flex gap-2 mt-4">
                <span className="h-9 w-9 rounded-lg bg-ink/5 flex items-center justify-center">
                  <Link2 className="h-4 w-4" />
                </span>
                <span className="h-9 w-9 rounded-lg bg-ink/5 flex items-center justify-center">
                  <AtSign className="h-4 w-4" />
                </span>
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
                className="py-4 md:py-6 flex items-center gap-4"
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
                  className={`font-display font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl transition-colors duration-300 ${
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
