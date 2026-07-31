"use client";

import { useState } from "react";

const days = [
  {
    label: "Day 01",
    track: "Workshops",
    time: "09:30 – 10:00",
    title: "Building production-grade agents",
    desc: "A hands-on session covering tool use, memory, and reliability patterns for autonomous agents.",
    speaker: "Daniel Okafor",
    role: "Principal Engineer",
  },
  {
    label: "Day 02",
    track: "Main conference",
    time: "09:00 – 10:30",
    title: "Opening keynote: the next five years",
    desc: "Where the frontier is heading, and what it means for product teams shipping today.",
    speaker: "Aiko Tanaka",
    role: "Head of Research",
  },
  {
    label: "Day 03",
    track: "Founders day",
    time: "09:00 – 10:30",
    title: "Zero to one, honestly",
    desc: "Three unfiltered accounts of a messy first year — what worked, and what didn't.",
    speaker: "Wei Zhang",
    role: "Co-Founder",
  },
];

export default function Agenda() {
  const [active, setActive] = useState(0);
  const day = days[active];

  return (
    <section id="agenda" className="mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-6">
        Agenda
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-xl">
        Three days. One focused track.
      </h2>

      <div className="mt-12 flex gap-3 flex-wrap">
        {days.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-sm font-mono border transition-colors ${
              active === i
                ? "bg-signal text-ink border-signal font-semibold"
                : "border-line text-paper/60 hover:text-paper"
            }`}
          >
            {d.label} — {d.track}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-ink-soft p-8 md:p-12 grid md:grid-cols-[140px_1fr] gap-8">
        <div className="font-mono text-sm text-paper/40">{day.time}</div>
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold">{day.title}</h3>
          <p className="mt-4 text-paper/60 leading-relaxed max-w-xl">{day.desc}</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-signal/40 to-line" />
            <div>
              <div className="text-sm font-semibold">{day.speaker}</div>
              <div className="text-xs text-paper/40 uppercase font-mono tracking-wide">
                {day.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
