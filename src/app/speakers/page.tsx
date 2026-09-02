import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Fan,
  Mic2,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import { gradientFor } from "@/lib/avatar";
import { mainEventSpeakers, preEventSpeakerSlots } from "@/lib/speakers";

const typewriterDelayMs = 180;
const typewriterStaggerMs = 45;

function WrappingTypewriterText({
  children,
  startIndex = 0,
}: {
  children: string;
  startIndex?: number;
}) {
  const words = children.split(" ");

  return (
    <>
      {words.map((word, wordIndex) => {
        const wordStartIndex = words
          .slice(0, wordIndex)
          .reduce((total, previousWord) => total + previousWord.length + 1, 0);

        return (
          <span key={`${word}-${wordIndex}`}>
            <span className="whitespace-nowrap">
              {Array.from(word).map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className="hero-typewriter-character"
                  style={{
                    animationDelay: `${
                      typewriterDelayMs +
                      (startIndex + wordStartIndex + index) *
                        typewriterStaggerMs
                    }ms`,
                  }}
                >
                  {character}
                </span>
              ))}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </>
  );
}

export const metadata: Metadata = {
  title: "Speakers | The TechForge",
  description:
    "Meet the pre-event and main-event speakers joining The TechForge 2026.",
};

const mainRevealSlots = Array.from({ length: 13 }, (_, index) => {
  const number = mainEventSpeakers.length + index + 1;

  return {
    id: `main-reveal-${number}`,
    number: String(number).padStart(2, "0"),
    title: "Speaker reveal",
    focus: "Another sharp voice joining the TechForge 2026 lineup.",
  };
});

function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
        tone === "light"
          ? "border border-white/15 bg-white/10 text-paper"
          : "border border-black/10 bg-black/5 text-ink/70"
      }`}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </p>
  );
}

function PreEventCard({
  slot,
  index,
}: {
  slot: (typeof preEventSpeakerSlots)[number];
  index: number;
}) {
  return (
    <article
      className="group relative min-h-[280px] overflow-hidden rounded-[28px] border border-black/10 bg-white p-5 text-ink shadow-[0_24px_80px_rgba(30,28,84,0.1)] transition-transform duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <div className="absolute inset-x-5 top-5 flex items-center justify-between">
        <span className="font-mono text-xs text-ink/45">
          PRE / {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
          <Mic2 className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div
        className="absolute inset-x-5 top-20 h-28 rounded-[24px] border border-black/10"
        style={{ background: gradientFor(slot.id) }}
      />
      <div className="absolute left-9 top-32 h-16 w-16 rounded-full border border-black/10 bg-black/10 backdrop-blur" />
      <div className="absolute left-24 top-32 h-16 w-16 rounded-full border border-black/10 bg-white/70 backdrop-blur" />
      <div className="absolute left-40 top-32 h-16 w-16 rounded-full border border-black/10 bg-[var(--color-signal)]/85" />

      <div className="relative mt-48">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Reveal soon
        </p>
        <h3 className="mt-3 font-display text-lg lg:text-xl font-bold leading-none">
          {slot.title}
        </h3>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/62">
          {slot.focus}
        </p>
      </div>
    </article>
  );
}

function SpeakerCard({
  speaker,
  index,
}: {
  speaker: (typeof mainEventSpeakers)[number];
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] bg-ink text-paper shadow-[0_22px_70px_rgba(30,28,84,0.16)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/12 to-black/5" />
        <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] backdrop-blur">
          MAIN / {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink">
          {speaker.track}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-display text-4xl font-bold leading-none">
            {speaker.name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-paper/72">
            {speaker.role} <span className="text-paper/40">at</span>{" "}
            {speaker.org}
          </p>
        </div>
      </div>
    </article>
  );
}

function RevealCard({
  slot,
  index,
}: {
  slot: (typeof mainRevealSlots)[number];
  index: number;
}) {
  return (
    <article
      className="group relative min-h-[320px] overflow-hidden rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_18px_54px_rgba(30,28,84,0.08)] transition-transform duration-500 hover:-translate-y-1"
      style={{ background: gradientFor(slot.id) }}
    >
      <div className="absolute inset-0 bg-white/78" />
      <span className="relative z-10 font-mono text-xs text-ink/40">
        MAIN / {slot.number}
      </span>
      <p className="absolute right-5 top-5 font-display text-7xl font-bold leading-none text-ink/[0.06]">
        {slot.number}
      </p>
      <div className="relative z-10 mt-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Reveal soon
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold leading-none text-ink">
          {slot.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-ink/58">
          {index < 4
            ? "A sessional speaker will take this seat as the programme sharpens."
            : slot.focus}
        </p>
      </div>
    </article>
  );
}

export default function SpeakersPage() {
  return (
    <>
      <main className="overflow-hidden bg-paper text-ink">
        <section className="relative isolate min-h-[92svh] overflow-hidden bg-ink px-6 pb-14 pt-32 text-paper sm:px-10 lg:pt-40">
          <Image
            src="/tf19.jpg"
            alt="TechForge audience at a previous gathering"
            fill
            priority
            sizes="100vw"
            className="-z-30 object-cover object-center opacity-36"
          />
          <div className="absolute inset-0 -z-20 bg-[var(--color-primary)]/35" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,12,0.42)_0%,rgba(10,10,12,0.52)_45%,rgba(10,10,12,0.82)_78%,rgba(10,10,12,0.95)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,10,12,0.42)_0%,rgba(10,10,12,0.16)_35%,rgba(10,10,12,0.16)_65%,rgba(10,10,12,0.38)_100%)]" />
          {/* <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-[linear-gradient(135deg,transparent_0_18%,var(--color-signal)_18%_33%,transparent_33%_100%)] opacity-90" /> */}

          <div className="mx-auto  max-w-7xl gap-5 flex flex-col items-center justify-center text-center">
            <div className="px-5 py-2 mb-5 text-[10px] lg:text-sm bg-white w-fit rounded-full text-ink flex gap-3 items-center">
              <Fan
                className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
                aria-hidden="true"
              />
              <span>TechForge 1.0: TechForge 2025</span>
              <Fan
                className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-[24px] lg:text-[75px] text-center font-bold leading-[1.08] tracking-tight text-paper drop-shadow-[0_2px_8px_rgba(10,10,12,0.55)] lg:leading-[1.2]">
              <span aria-hidden="true">
                <WrappingTypewriterText>
                  The voices before the spark and inside the forge.
                </WrappingTypewriterText>
              </span>
            </h1>
            <div className="lg:pb-5">
              <p className="max-w-xl text-sm lg:text-lg leading-relaxed text-paper/70">
                Pre-TechForge speakers open the room first. The main event
                lineup follows with the builders, operators and product thinkers
                carrying the summit programme.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#pre-event"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:text-white hover:bg-[var(--color-primary)]"
                >
                  Pre-event lineup
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#main-event"
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-white hover:text-ink"
                >
                  Main event lineup
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pre-event"
          className="bg-paper px-4 py-16 text-ink sm:px-6 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <div className="mb-5 flex w-fit items-center gap-3 rounded-full bg-[var(--color-primary)] px-5 py-2 text-[10px] text-white lg:text-sm">
                  <Fan
                    className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  <span>PRE-TECHFORGE EVENT</span>
                  <Fan
                    className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-5 font-display text-[24px] font-bold leading-none tracking-normal lg:text-[56px]">
                  Warm-up voices, serious momentum.
                </h2>
              </div>
              <div className="grid gap-4 border-t border-black/15 pt-5 text-sm leading-relaxed text-ink/62 sm:grid-cols-2">
                <p>
                  The pre-event is built to prime the room before the summit:
                  sharper questions, clearer energy and a stronger community
                  pulse before the main stage opens.
                </p>
                <p className="flex items-start gap-3">
                  <CalendarDays
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  Speaker names can drop in here as soon as the pre-event lineup
                  is confirmed.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {preEventSpeakerSlots.map((slot, index) => (
                <PreEventCard key={slot.id} slot={slot} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="main-event"
          className="relative bg-[#f5f4ff] px-4 py-16 sm:px-6 lg:py-24"
        >
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Eyebrow tone="dark">Main event speakers</Eyebrow>
                <h2 className="mt-5 max-w-4xl font-display text-[24px] font-bold leading-none tracking-normal lg:text-[56px]">
                  Confirmed minds first. More seats waking up soon.
                </h2>
              </div>
              <Link
                href="https://forms.gle/pcEGTq4QFJkVZyG99"
                transitionTypes={["nav-forward"]}
                className="inline-flex w-fit items-center gap-3 rounded-full bg-black py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Apply to speak
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-signal)] text-black">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mainEventSpeakers.map((speaker, index) => (
                <SpeakerCard
                  key={speaker.name}
                  speaker={speaker}
                  index={index}
                />
              ))}
              {mainRevealSlots.map((slot, index) => (
                <RevealCard key={slot.id} slot={slot} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
