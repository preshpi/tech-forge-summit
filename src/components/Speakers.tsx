"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Link2, AtSign } from "lucide-react";
import { gradientFor } from "@/lib/avatar";

const speakers = [
  { name: "Aiko Tanaka", role: "Director of Innovation", org: "Lumen AI" },
  {
    name: "Marcus Alvarado",
    role: "Chief Technology Officer",
    org: "Quantum Solutions",
  },
  { name: "Priya Kapoor", role: "Lead Scientist", org: "Neural Dynamics" },
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = rowRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    rowRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const speaker = speakers[active];

  return (
    <section id="speakers" className="bg-paper text-ink py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/70 mb-14">
          <span className="text-ink">✦</span> Meet the speakers
        </p>

        <div className="grid md:grid-cols-[340px_1fr] gap-12 md:gap-20">
          <div className="md:sticky md:top-32 self-start">
            <div
              key={active}
              className="relative aspect-[3/4.2] rounded-3xl overflow-hidden border border-ink/10 animate-fade-in"
              style={{ background: gradientFor(speaker.name) }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl font-bold text-ink/10">
                  {speaker.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>

            <div key={`meta-${active}`} className="mt-5 animate-fade-in">
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
                    i === active ? "text-ink" : "text-ink/15"
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
