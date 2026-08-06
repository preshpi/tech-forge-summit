import { Check, Globe, Crown, Users, ArrowUpRight } from "lucide-react";
import type { TierId } from "@/lib/tickets";

const tiers: {
  id: TierId;
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  highlight: boolean;
  icon: any;
}[] = [
  {
    id: "general",
    name: "General Admission",
    price: "$299",
    unit: "Per attendee",
    desc: "Full access to all main-stage talks and the official networking event.",
    features: [
      "All Day 2 main-stage sessions",
      "Lunch & refreshments included",
      "Evening networking event",
      "Post-event session recordings",
    ],
    highlight: false,
    icon: Globe,
  },
  {
    id: "vip",
    name: "VIP Pass",
    price: "$599",
    unit: "Per attendee",
    desc: "Everything in General plus workshops, reserved seating, and the founders dinner.",
    features: [
      "All 3 days including workshops",
      "Reserved front-section seating",
      "Private founders dinner invite",
      "1:1 speaker office hours access",
    ],
    highlight: true,
    icon: Crown,
  },
  {
    id: "team",
    name: "Team Pass",
    price: "$1299",
    unit: "for 5 attendees",
    desc: "Bring your team. Five VIP-level passes at a meaningful discount.",
    features: [
      "5 × VIP-level passes",
      "Dedicated team check-in",
      "Group photo with speakers",
      "Shared Slack channel access",
    ],
    highlight: false,
    icon: Users,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.name}
              className={`rounded-[28px] p-8 flex flex-col justify-between transition-all duration-200 ${
                t.highlight
                  ? "bg-[#0f0f0f] text-white shadow-2xl scale-[1.02]"
                  : "bg-[#eaeaea] text-zinc-900"
              }`}
            >
              {/* Header Elements: Icon + Early Bird Tag */}
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      t.highlight
                        ? "bg-[#86efac] text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase ${
                      t.highlight
                        ? "bg-zinc-800 text-[#86efac]"
                        : "bg-zinc-300/70 text-zinc-700"
                    }`}
                  >
                    Early Bird
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-sans font-bold text-2xl mt-6 tracking-tight">
                  {t.name}
                </h3>
                <p
                  className={`mt-3 text-xs leading-relaxed min-h-[40px] ${
                    t.highlight ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {t.desc}
                </p>

                {/* Features List */}
                <ul className="mt-8 space-y-3.5">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-xs font-semibold"
                    >
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                          t.highlight
                            ? "bg-zinc-800 text-white"
                            : "bg-white text-zinc-900"
                        }`}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span
                        className={
                          t.highlight ? "text-zinc-200" : "text-zinc-800"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Section: Pricing + CTA Button */}
              <div className="mt-10 pt-6 border-t border-zinc-500/20">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight">
                    {t.price}
                  </span>
                  <span
                    className={`font-mono text-xs ${
                      t.highlight ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {t.unit}
                  </span>
                </div>

                {/* Split Pill Button */}
                <a
                  href={`/checkout?tier=${t.id}`}
                  className={`inline-flex items-center gap-2 rounded-full p-1.5 pl-5 pr-1.5 font-semibold text-xs transition-colors ${
                    t.highlight
                      ? "bg-[#86efac] text-black hover:bg-[#76e09c]"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  <span>Buy ticket</span>
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center ${
                      t.highlight
                        ? "bg-black text-[#86efac]"
                        : "bg-white text-black"
                    }`}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
