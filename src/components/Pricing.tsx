import { Check } from "lucide-react";
import type { TierId } from "@/lib/tickets";

const tiers: {
  id: TierId;
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  highlight: boolean;
}[] = [
  {
    id: "general",
    name: "General Admission",
    price: "$299",
    unit: "per attendee",
    desc: "Full access to all main-stage talks and the official networking event.",
    features: [
      "All Day 2 main-stage sessions",
      "Lunch & refreshments included",
      "Evening networking event",
      "Post-event session recordings",
    ],
    highlight: false,
  },
  {
    id: "vip",
    name: "VIP Pass",
    price: "$599",
    unit: "per attendee",
    desc: "Everything in General, plus workshops, reserved seating, and the founders dinner.",
    features: [
      "All 3 days including workshops",
      "Reserved front-section seating",
      "Private founders dinner invite",
      "1:1 speaker office hours",
    ],
    highlight: true,
  },
  {
    id: "team",
    name: "Team Pass",
    price: "$1,299",
    unit: "for 5 attendees",
    desc: "Bring your team. Five VIP-level passes at a meaningful discount.",
    features: [
      "5 × VIP-level passes",
      "Dedicated team check-in",
      "Group photo with speakers",
      "Shared Slack channel access",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-6 text-center">
        Early bird
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
        Secure your spot
      </h2>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl p-8 flex flex-col border ${
              t.highlight
                ? "border-signal bg-ink-soft relative"
                : "border-line bg-ink-soft/40"
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-8 rounded-full bg-signal text-ink text-xs font-bold font-mono px-3 py-1">
                MOST POPULAR
              </span>
            )}
            <h3 className="font-display font-bold text-lg">{t.name}</h3>
            <p className="mt-2 text-sm text-paper/50 leading-relaxed h-12">{t.desc}</p>

            <ul className="mt-6 space-y-3 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-paper/70">
                  <Check className="h-4 w-4 text-signal mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-line">
              <div className="font-display text-3xl font-bold">{t.price}</div>
              <div className="text-xs text-paper/40 font-mono">{t.unit}</div>
              <a
                href={`/checkout?tier=${t.id}`}
                className={`mt-5 block text-center rounded-full py-3 text-sm font-semibold transition-colors ${
                  t.highlight
                    ? "bg-signal text-ink hover:bg-signal-dim"
                    : "border border-line hover:border-signal/50"
                }`}
              >
                Buy ticket
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
