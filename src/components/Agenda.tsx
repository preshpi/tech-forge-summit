"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  ExternalLink,
  Navigation,
  ClipboardCheck,
  Megaphone,
  Mic,
  Swords,
  Cpu,
  Coffee,
  Layers,
  ShieldCheck,
  Users,
  Gamepad2,
  Rocket,
  Compass,
  Handshake,
  Gift,
  Puzzle,
  Flag,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

const sessions: {
  time: string;
  title: string;
  desc: string;
  speaker: string;
  role: string;
  image: string;
  icon: LucideIcon;
}[] = [
  {
    time: "8:00 – 9:30 AM",
    title: "Registration, Check-in, Expo & Networking",
    desc: "Registration, ticket verification, merch collection, expo opening, sponsor booths and networking.",
    speaker: "All Attendees",
    role: "Expo & Check-in",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
    icon: ClipboardCheck,
  },
  {
    time: "9:30 – 9:45 AM",
    title: "Opening Event & Energy Kickoff",
    desc: "Welcome, housekeeping, introduction to Tech Forge and audience engagement.",
    speaker: "Host & MC",
    role: "Main Stage",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
    icon: Megaphone,
  },
  {
    time: "9:45 – 10:15 AM",
    title: "Opening Keynote — The Builders' Blueprint",
    desc: "Opening keynote setting the direction for the event theme.",
    speaker: "Keynote Speaker",
    role: "Main Stage",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
    icon: Mic,
  },
  {
    time: "10:15 – 10:30 AM",
    title: "Shadow Boxing",
    desc: "High-energy interactive entertainment segment.",
    speaker: "Entertainment",
    role: "Main Stage",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    icon: Swords,
  },
  {
    time: "10:30 – 10:55 AM",
    title: "Building with AI",
    desc: "AI, automation, responsible AI, LLMs, AI products and practical opportunities.",
    speaker: "Sessional Speaker",
    role: "Track Session",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000",
    icon: Cpu,
  },
  {
    time: "10:55 – 11:15 AM",
    title: "Networking",
    desc: "Audience networking and informal interaction.",
    speaker: "All Attendees",
    role: "Expo Floor",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
    icon: Coffee,
  },
  {
    time: "11:15 – 11:40 AM",
    title: "Engineering for Scale",
    desc: "Software engineering, architecture, cloud, DevOps and reliable systems.",
    speaker: "Sessional Speaker",
    role: "Track Session",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=1000",
    icon: Layers,
  },
  {
    time: "11:40 – 12:05 PM",
    title: "Building Trust",
    desc: "Cybersecurity, privacy, secure systems, identity, fraud prevention and digital trust.",
    speaker: "Sessional Speaker",
    role: "Track Session",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=1000",
    icon: ShieldCheck,
  },
  {
    time: "12:05 – 12:50 PM",
    title: "Panel Session — Building for Tomorrow",
    desc: "Four panel speakers explore skills, technology, innovation and building for the future.",
    speaker: "Panel Speakers",
    role: "Main Stage",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000",
    icon: Users,
  },
  {
    time: "12:50 – 1:05 PM",
    title: "Short Break + Interactive Game",
    desc: "A short audience game/activity to refresh attendees.",
    speaker: "All Attendees",
    role: "Interactive Break",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    icon: Gamepad2,
  },
  {
    time: "1:05 – 1:30 PM",
    title: "From Problem to Product",
    desc: "Startups, entrepreneurship, product development, funding, business models and scaling.",
    speaker: "Sessional Speaker",
    role: "Track Session",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
    icon: Rocket,
  },
  {
    time: "1:30 – 1:55 PM",
    title: "The Future Builder",
    desc: "Future-ready skills, careers, leadership, mentorship and the changing workplace.",
    speaker: "Sessional Speaker",
    role: "Track Session",
    image: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80&w=1000",
    icon: Compass,
  },
  {
    time: "1:55 – 2:10 PM",
    title: "Game / Audience Engagement",
    desc: "Second interactive game/activity.",
    speaker: "All Attendees",
    role: "Interactive Break",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1000",
    icon: Gamepad2,
  },
  {
    time: "2:10 – 2:45 PM",
    title: "Partnership Spotlight",
    desc: "Selected sponsors/partners introduce their organisations, opportunities and value to attendees.",
    speaker: "Sponsors & Partners",
    role: "Sponsor Segment",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000",
    icon: Handshake,
  },
  {
    time: "2:45 – 3:05 PM",
    title: "Sponsor Activation + Giveaways",
    desc: "Sponsor games, product activations, audience engagement and giveaways.",
    speaker: "Sponsors & Partners",
    role: "Sponsor Segment",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000",
    icon: Gift,
  },
  {
    time: "3:05 – 3:25 PM",
    title: "Tech Challenge",
    desc: "Interactive technology-themed challenge involving audience participation.",
    speaker: "All Attendees",
    role: "Interactive Challenge",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000",
    icon: Puzzle,
  },
  {
    time: "3:25 – 3:30 PM",
    title: "General Programme Closing",
    desc: "Brief closing and departure of General Admission attendees.",
    speaker: "Host & MC",
    role: "Main Stage",
    image: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?auto=format&fit=crop&q=80&w=1000",
    icon: Flag,
  },
];

const venueDetails = {
  name: "The Zone",
  address: "Plot 9, Gbagada Industrial Scheme, beside UPS, Gbagada-Oworonshoki Expressway, Lagos.",
  googleMapsUrl: "https://maps.app.goo.gl/xDF9umrXfCPCgpk37",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.7641684755763!2d3.37684!3d6.551430799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d73a658782b%3A0x7a1de11d89cccc84!2sThe%20Zone!5e0!3m2!1sen!2sng!4v1787669874915!5m2!1sen!2sng",
  gallery: [
    {
      src: "https://res.cloudinary.com/dgtc1iood/image/upload/v1787670226/Ruby3_qwd7mw.webp",
      alt: "Main Auditorium",
    },
  {
      src: "https://res.cloudinary.com/dgtc1iood/image/upload/v1787835868/5_1_gaxzbq.avif",
      alt: "Front view of the auditorium",
    },
    {
      src: "https://res.cloudinary.com/dgtc1iood/image/upload/v1787670232/ruby-hall-an-ideal-hall_iizqpw.webp",
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
              {/* Top Row: Title vs Session Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-sans font-bold text-4xl sm:text-5xl mt-4 tracking-tight text-white">
                    Programme
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
                  <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-800/60 bg-[#1c1c1c] p-1 md:p-1.5">
                    <button
                      onClick={() => go(-1)}
                      aria-label="Previous session"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-zinc-300 transition-colors hover:bg-zinc-700 md:h-10 md:w-10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="px-2 font-mono text-[10px] font-semibold text-zinc-200 md:px-3 md:text-xs">
                      {index + 1}/{sessions.length}
                    </span>
                    <button
                      onClick={() => go(1)}
                      aria-label="Next session"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-zinc-300 transition-colors hover:bg-zinc-700 md:h-10 md:w-10"
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
                  <div className="flex h-11 w-11 items-center justify-center rounded-full shrink-0 border border-zinc-700 bg-[#1c1c1c]">
                    <s.icon className="h-5 w-5 text-zinc-300" />
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
                  className="group inline-flex w-full items-center justify-between rounded-xl border border-zinc-800/80 bg-[#1c1c1c] p-3 transition-colors hover:bg-[#222222] md:p-4"
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