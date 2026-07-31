import { Building2, LineChart, Rocket, Code2 } from "lucide-react";

const audience = [
  { icon: Building2, label: "Business", desc: "Operators applying AI inside established teams." },
  { icon: LineChart, label: "Investors", desc: "VCs and angels scouting the next AI category." },
  { icon: Rocket, label: "Founders", desc: "Builders shipping 0→1 AI products this year." },
  { icon: Code2, label: "Engineers", desc: "People building with LLMs, agents, and evals." },
];

const orbitTags = ["Innovation", "Networking", "Distribution", "Learning"];

export default function Audience() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-6">
        For whom?
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
        Built for the people building it
      </h2>

      <div className="mt-16 grid lg:grid-cols-[1fr_320px] gap-14 items-center">
        <div className="grid sm:grid-cols-2 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          {audience.map((a) => (
            <div key={a.label} className="bg-ink p-8 flex flex-col gap-4">
              <a.icon className="h-5 w-5 text-signal" strokeWidth={1.5} />
              <div>
                <div className="font-display font-bold text-lg">{a.label}</div>
                <p className="text-sm text-paper/50 mt-1 leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* signature orbit element */}
        <div className="relative mx-auto h-72 w-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-8 rounded-full border border-line" />
          <div className="h-20 w-20 rounded-full bg-signal flex items-center justify-center font-display font-bold text-ink text-sm text-center">
            NOVA
          </div>
          {orbitTags.map((tag, i) => {
            const dot = [
              "bg-signal",
              "bg-accent-2",
              "bg-accent-3",
              "bg-signal",
            ][i % 4];
            return (
              <div
                key={tag}
                className="absolute animate-orbit"
                style={
                  {
                    "--radius": "128px",
                    "--duration": `${24 + i * 6}s`,
                    animationDelay: `${i * -6}s`,
                  } as React.CSSProperties
                }
              >
                <span className="rounded-full border border-line bg-ink-soft pl-2 pr-3 py-1.5 text-xs font-mono text-paper/70 whitespace-nowrap inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  {tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
