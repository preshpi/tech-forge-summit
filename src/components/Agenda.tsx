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
    programme: "General Programme",
    time: "08:00 – 9:30",
    title: "Registration, Check-in, Expo & Networking",
    desc: "Registration, ticket verification, merch collection, expo opening, sponsor booths and attendee networking.",
    speaker: "",
    role: "",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    programme: "General Programme",
    time: "09:30 – 9:45",
    title: "Opening Event & Energy Kickoff",
    desc: "Welcome, housekeeping, introduction to Tech Forge and audience engagement.",
    speaker: "Compere",
    role: "",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    programme: "General Programme",
    time: "09:45 – 10:15",
    title: "GAME — Shadow Boxing",
    desc: "High-energy interactive entertainment segment to energise the audience.",
    speaker: "Attendees",
    role: "",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    programme: "General Programme",
    time: "10:30 – 10:55",
    title: "The Architecture of a Future-Proof Tech Career",
    desc: "Explores how to build a sustainable career in technology by developing strong fundamentals, adaptability, continuous learning, and skills that remain valuable as tools, roles, and industry trends evolve.",
    speaker: "Dominus Kelvin",
    role: "Lead Maintainer, Sails",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    programme: "General Programme",
    time: "10:55 – 11:15",
    title: "Networking",
    desc: "Informal networking and attendee-to-attendee interaction.",
    speaker: "All Attendees",
    role: "",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    programme: "General Programme",
    time: "11:15 – 11:40",
    title: "Section 2 — Engineering for Scale".split("—")[0].trim(),
    desc: "",
    speaker: "Sessional Speaker 2",
    role: "All Attendees",
    image: "/tf5.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "11:40 – 12:05",
    title: "Section 3 — Building Trust".split("—")[0].trim(),
    desc: "",
    speaker: "Sessional Speaker 3",
    role: "All Attendees",
    image: "/tf4.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "12:05 – 12:50",
    title: "Panel Session — Building for Tomorrow",
    desc: "A four-person panel exploring technology, skills, innovation and what it takes to build for the future.",
    speaker: "Moderator + 4 Panel Speakers",
    role: "All Attendees",
    image: "/tf8.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "12:50 – 1:05",
    title: "Short Break + Interactive Game",
    desc: "Short audience game/activity to refresh attendees and transition into the next programme block.",
    speaker: "Activity Team",
    role: "All Attendees",
    image: "/tf9.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "1:05 – 1:30",
    title: "Section 4 — From Problem to Product".split("—")[0].trim(),
    desc: "",
    speaker: "Sessional Speaker 4",
    role: "All Attendees",
    image: "/tf12.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "1:30 – 1:55",
    title: "Section 5 — The Future Builder".split("—")[0].trim(),
    desc: "",
    speaker: "Sessional Speaker 5",
    role: "All Attendees",
    image: "/tf13.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "1:55 – 2:10",
    title: "Game / Audience Engagement",
    desc: "Second interactive game or audience activity to maintain energy and participation.",
    speaker: "Activity Team",
    role: "All Attendees",
    image: "/tf14.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "2:10 – 2:45",
    title: "Partnership Spotlight",
    desc: "Selected partners/sponsors introduce their organisations, opportunities and value to the tech community.",
    speaker: "Selected Sponsors / Partners",
    role: "All Attendees",
    image: "/tf15.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "2:45 – 3:05",
    title: "Sponsor Activation + Giveaways",
    desc: "Sponsor-led activities, product engagement, audience participation and giveaways.",
    speaker: "Sponsors / MC",
    role: "All Attendees",
    image: "/tf16.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "3:05 – 3:25",
    title: "Tech Challenge",
    desc: "Interactive technology-themed challenge involving audience participation.",
    speaker: "Activity Team",
    role: "All Attendees",
    image: "/tf17.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "General Programme",
    time: "3:25 – 3:30",
    title: "General Programme Closing",
    desc: "Brief closing and official departure point for Free Ticket attendees.",
    speaker: "MC / Organising Team",
    role: "All Attendees",
    image: "/tf18.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "Premium Experience",
    time: "3:30 – 4:15",
    title: "Premium Lunch",
    desc: "Exclusive lunch experience for ₦10,000 ticket holders.",
    speaker: "Organising Team",
    role: "₦10,000 Ticket Holders",
    image: "/tf19.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "Premium Experience",
    time: "4:15 – 5:00",
    title: "Exclusive Speaker Networking",
    desc: "Dedicated networking and interaction between paid attendees and Tech Forge speakers.",
    speaker: "Speakers + Organising Team",
    role: "₦10,000 Ticket Holders",
    image: "/tf20.jpg",
    avatar: "/techforge-logo.png",
  },
  {
    programme: "Premium Experience",
    time: "5:00",
    title: "Official End of Tech Forge 2026",
    desc: "Conclusion of the official event.",
    speaker: "All Remaining Attendees",
    role: "",
    image: "/tf7.jpg",
    avatar: "/techforge-logo.png",
  },
];

const venueDetails = {
  name: "The Innovation Center",
  address: "500 Howard Street, San Francisco, CA 94105",
  googleMapsUrl: "https://maps.app.goo.gl/nXKs2PqDhtL1fYTa6",
  // Google Maps Embed URL (Place your actual API embed URL or standard embed URL here)
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.7641261852677!2d3.374265073864627!3d6.551436122840391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d73a658782b%3A0x7a1de11d89cccc84!2sThe%20Zone!5e0!3m2!1sen!2sng!4v1787343862698!5m2!1sen!2sng",
  gallery: [
    {
      src: "https://thezone.ng/wp-content/uploads/2025/11/Emerald1.webp",
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
            character === " "
              ? "0.34em"
              : character === "–"
                ? "0.78em"
                : "0.62em";
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
  const previousIndex = (index - direction + sessions.length) % sessions.length;

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
                    AGENDA
                  </p>
                  <h3
                    key={s.programme}
                    className="font-sans font-bold text-4xl sm:text-5xl mt-4 tracking-tight text-white"
                  >
                    {s.programme}
                  </h3>
                </div>

                <div>
                  <AnimatedSessionTitle key={index} title={s.title} />
                  {s.desc ? (
                    <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-sm">
                      {s.desc}
                    </p>
                  ) : null}
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
