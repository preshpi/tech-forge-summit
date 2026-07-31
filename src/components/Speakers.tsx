import { Link2, Mail } from "lucide-react";
import { gradientFor, initials } from "@/lib/avatar";

const speakers = [
  { name: "Aiko Tanaka", role: "Head of Research", org: "Lumen AI" },
  { name: "Marcus Alvarado", role: "Chief Technology Officer", org: "Quantum Solutions" },
  { name: "Priya Kapoor", role: "Lead Scientist", org: "Neural Dynamics" },
  { name: "Daniel Okafor", role: "Principal Engineer", org: "Insight Analytics" },
  { name: "Sofia Andersson", role: "VP of Research", org: "TechSphere" },
  { name: "Wei Zhang", role: "Co-Founder", org: "FutureTech Labs" },
];

const tickerNames = [
  "Aiko Tanaka", "Marcus Alvarado", "Priya Kapoor", "Daniel Okafor",
  "Sofia Andersson", "Wei Zhang", "Liam Chen", "Isabella Martinez",
];

export default function Speakers() {
  return (
    <section id="speakers" className="mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-6">
            Meet the speakers
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            20+ people worth your afternoon
          </h2>
        </div>
        <a
          href="#speakers"
          className="text-sm font-semibold text-paper/70 hover:text-paper inline-flex items-center gap-2 border-b border-line pb-1"
        >
          View all speakers →
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((s) => (
          <div
            key={s.name}
            className="group rounded-2xl border border-line bg-ink-soft p-6 flex flex-col gap-4 hover:border-signal/40 transition-colors"
          >
            <div
              className="aspect-[4/5] rounded-xl flex items-center justify-center overflow-hidden border border-line/60"
              style={{ background: gradientFor(s.name) }}
            >
              <span className="font-display text-3xl font-bold text-paper/40">
                {initials(s.name)}
              </span>
            </div>
            <div>
              <div className="font-display font-bold">{s.name}</div>
              <div className="text-sm text-paper/50 mt-0.5">
                {s.role}, {s.org}
              </div>
            </div>
            <div className="flex gap-3 text-paper/30">
              <Link2 className="h-4 w-4 group-hover:text-signal transition-colors" />
              <Mail className="h-4 w-4 group-hover:text-signal transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 relative overflow-hidden border-y border-line py-5">
        <div className="flex gap-10 whitespace-nowrap animate-marquee-slow">
          {[...tickerNames, ...tickerNames].map((n, i) => (
            <span key={i} className="font-display text-xl text-paper/20">
              {n} <span className="text-signal/40 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
