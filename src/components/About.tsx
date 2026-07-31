import { Sparkles, ArrowUpRight, Zap } from "lucide-react";
import { gradientFor } from "@/lib/avatar";
import AboutMedia from "./AboutMedia";

function Chip({ seed }: { seed: string }) {
  return (
    <span
      className="inline-block align-middle mx-2 rounded-2xl border border-line"
      style={{
        width: "clamp(70px, 9vw, 130px)",
        height: "clamp(46px, 5.5vw, 78px)",
        background: gradientFor(seed),
        transform: "translateY(-0.08em)",
      }}
    />
  );
}

function IconBadge({
  icon: Icon,
  className,
}: {
  icon: typeof ArrowUpRight;
  className?: string;
}) {
  return (
    <span className={`inline-flex align-middle mx-1.5 ${className}`}>
      <Icon
        className="h-[0.7em] w-[0.7em]"
        strokeWidth={2.5}
        style={{ transform: "translateY(-0.05em)" }}
      />
    </span>
  );
}

export default function About() {
  return (
    <section id="about">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 md:pt-32">
        <p className="eyebrow flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          About NOVA 2027
        </p>

        <h2 className="font-display font-bold tracking-tight leading-[1.05] text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem]">
          <span className="relative inline-block">
            NOVA 2027
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
          </span>
          <Chip seed="crowd-one" /> brings together the people actually
          shipping AI products <IconBadge icon={ArrowUpRight} className="text-[var(--color-accent-2)]" />{" "}
          founders, researchers, engineers, and operators{" "}
          <IconBadge icon={Zap} className="text-[var(--color-accent-3)]" /> for
          one focused day <Chip seed="venue-one" /> in Austin.
        </h2>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-14 grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <div className="rounded-3xl overflow-hidden border border-line bg-ink-soft aspect-[4/3] relative">
          <div
            className="absolute inset-0"
            style={{ background: gradientFor("about-preview") }}
          />
        </div>

        <div className="pt-2 space-y-6 text-paper/70 leading-relaxed">
          <p>
            Expect unfiltered talks, hands-on workshops, and the kind of
            hallway conversations that turn into your next hire, customer, or
            co-founder.
          </p>
          <p>
            No vendor pitches, no recycled slides. Every session is curated
            around what&apos;s working right now: agent architectures, evals,
            distribution, fundraising, and the real economics of building an
            AI company in 2027.
          </p>
          <div className="flex items-center gap-2.5 pt-2">
            <a
              href="/checkout?tier=general"
              className="rounded-full bg-signal text-ink font-semibold px-6 py-3 text-sm hover:bg-signal-dim transition-colors"
            >
              Get ticket
            </a>
            <a
              href="/checkout?tier=general"
              aria-label="Get ticket"
              className="h-11 w-11 shrink-0 rounded-full bg-signal text-ink flex items-center justify-center hover:bg-signal-dim transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <AboutMedia />
      </div>
    </section>
  );
}
