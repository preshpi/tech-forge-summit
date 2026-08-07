"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  ExternalLink,
  Navigation,
} from "lucide-react";
import Image from "next/image";

const sessions = [
  {
    time: "09:30 – 10:00",
    title: "Building Production-Grade Agents",
    desc: "Hands-on session covering tool use, memory, and reliability patterns for autonomous agents.",
    speaker: "Daniel Okafor",
    role: "Principal Eng.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    time: "10:15 – 11:00",
    title: "Evals That Actually Catch Regressions",
    desc: "A practical framework for offline and online evaluation across LLM-powered features.",
    speaker: "Aiko Tanaka",
    role: "Head of Research",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    time: "11:15 – 12:00",
    title: "Shipping Agents Your Users Trust",
    desc: "Guardrails, observability, and the UX patterns that keep agent behavior legible.",
    speaker: "Priya Kapoor",
    role: "Lead Scientist",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
];

const venueDetails = {
  name: "The Innovation Center",
  address: "500 Howard Street, San Francisco, CA 94105",
  googleMapsUrl:
    "https://maps.google.com/?q=500+Howard+Street,+San+Francisco,+CA+94105",
  // Google Maps Embed URL (Place your actual API embed URL or standard embed URL here)
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d-122.39867968468126!3d37.78815197975747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807f311f925b%3A0xc3f8e5f22e831688!2s500%20Howard%20St%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
      alt: "Main Auditorium",
    },
    {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
      alt: "Workshop Space",
    },
    {
      src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600",
      alt: "Networking Area",
    },
  ],
};

function AnimatedSessionTitle({ title }: { title: string }) {
  let characterIndex = 0;

  return (
    <h4
      aria-label={title}
      className="font-sans text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl"
    >
      <span aria-hidden="true">
        {title.split(" ").map((word, wordIndex, words) => (
          <span key={`${word}-${wordIndex}`}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((character) => {
                const delay = characterIndex * 38;
                characterIndex += 1;

                return (
                  <span
                    key={`${character}-${characterIndex}`}
                    className="hero-typewriter-character"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {character}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </h4>
  );
}

function VerticalTime({
  current,
  previous,
  direction,
}: {
  current: string;
  previous: string;
  direction: 1 | -1;
}) {
  return (
    <div
      aria-label={current}
      className="mb-8 flex font-mono text-3xl font-semibold tracking-tight text-zinc-600 sm:text-4xl"
    >
      <span aria-hidden="true" className="inline-flex">
        {Array.from(current).map((character, index) => {
          const previousCharacter = Array.from(previous)[index] ?? " ";
          const width =
            character === " " ? "0.34em" : character === "–" ? "0.78em" : "0.62em";
          const delay = index * 18;

          return (
            <span
              key={`${character}-${index}`}
              className="session-time-cell"
              style={{ width }}
            >
              <span
                className={`session-time-value ${
                  direction === 1
                    ? "session-time-old-up"
                    : "session-time-old-down"
                }`}
                style={{ animationDelay: `${delay}ms` }}
              >
                {previousCharacter === " " ? "\u00a0" : previousCharacter}
              </span>
              <span
                className={`session-time-value ${
                  direction === 1
                    ? "session-time-new-up"
                    : "session-time-new-down"
                }`}
                style={{ animationDelay: `${delay}ms` }}
              >
                {character === " " ? "\u00a0" : character}
              </span>
            </span>
          );
        })}
      </span>
    </div>
  );
}

export default function EventPage() {
  const [index, setIndex] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const s = sessions[index];
  const previousIndex =
    (index - direction + sessions.length) % sessions.length;

  function go(dir: 1 | -1) {
    setDirection(dir);
    setIndex((i) => (i + dir + sessions.length) % sessions.length);
  }

  return (
    <div className="space-y-12">
      {/* ================= AGENDA SECTION ================= */}
      <section id="agenda" className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="rounded-[32px] bg-[#141414] p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left & Middle Column Wrapper */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-12 lg:space-y-0">
              {/* Top Row: DAY 01 & Title vs Session Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase font-medium">
                    Day 01
                  </p>
                  <h3 className="font-sans font-bold text-4xl sm:text-5xl mt-4 tracking-tight text-white">
                    Workshops
                  </h3>
                </div>

                <div>
                  <AnimatedSessionTitle key={index} title={s.title} />
                  <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-sm">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Time/Nav vs Speaker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end pt-8">
                <div>
                  <VerticalTime
                    key={`time-${index}`}
                    current={s.time}
                    previous={sessions[previousIndex].time}
                    direction={direction}
                  />

                  {/* Square Pill Navigation */}
                  <div className="inline-flex items-center gap-1 bg-[#1c1c1c] p-1.5 rounded-xl border border-zinc-800/60">
                    <button
                      onClick={() => go(-1)}
                      aria-label="Previous session"
                      className="h-10 w-10 rounded-lg bg-[#262626] hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs font-semibold px-3 text-zinc-200">
                      {index + 1}/{sessions.length}
                    </span>
                    <button
                      onClick={() => go(1)}
                      aria-label="Next session"
                      className="h-10 w-10 rounded-lg bg-[#262626] hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Speaker Profile */}
                <div
                  key={`speaker-${index}`}
                  className="flex items-center gap-3.5"
                >
                  <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 border border-zinc-700">
                    <Image
                      src={s.avatar}
                      alt={s.speaker}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      {s.speaker}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                      {s.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Speaker Image */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[440px]">
              <div
                key={`img-${index}`}
                className="absolute inset-0 rounded-[24px] overflow-hidden border border-zinc-800/50"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VENUE SECTION ================= */}
      <section id="venue" className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="rounded-[32px] bg-[#141414] p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Venue Info & Google Map */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div>
                <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase font-medium">
                  Location
                </p>
                <h3 className="font-sans font-bold text-4xl sm:text-5xl mt-4 tracking-tight text-white">
                  The Venue
                </h3>

                <div className="mt-6 flex items-start gap-3 text-zinc-300">
                  <MapPin className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-bold text-xl text-white">
                      {venueDetails.name}
                    </h4>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                      {venueDetails.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Box */}
              <div className="space-y-4">
                <div className="relative w-full h-[220px] rounded-[20px] overflow-hidden border border-zinc-800/80 bg-[#1c1c1c]">
                  <iframe
                    title="Venue Location Map"
                    src={venueDetails.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      filter: "grayscale(0.9) contrast(1.2) invert(0.9)",
                    }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Open in Google Maps Button */}
                <a
                  href={venueDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-[#1c1c1c] hover:bg-[#222222] border border-zinc-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-200">
                      Get Directions on Google Maps
                    </span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Right Column: Venue Image Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {/* Main Large Photo */}
              <div className="col-span-2 relative h-[240px] sm:h-[280px] rounded-[24px] overflow-hidden border border-zinc-800/50">
                <Image
                  src={venueDetails.gallery[0].src}
                  alt={venueDetails.gallery[0].alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Secondary Photos */}
              {venueDetails.gallery.slice(1).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-[160px] sm:h-[180px] rounded-[20px] overflow-hidden border border-zinc-800/50"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
