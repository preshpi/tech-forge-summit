const stats = [
  {
    value: "1,400+",
    label: "Builders",
    desc: "A curated room of founders, engineers, designers, and AI-native operators.",
  },
  {
    value: "90+",
    label: "Startups",
    desc: "Teams shipping the next wave of products, tools, and infrastructure.",
  },
  {
    value: "22",
    label: "Sessions",
    desc: "Keynotes, panels, workshops, and demos built for depth, not filler.",
  },
];

export default function Stats() {
  return (
    <section className="border-y border-line bg-ink-soft/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-14 max-w-xl">
          The numbers behind a day at NOVA
        </h2>
        <div className="grid sm:grid-cols-3 gap-10">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-line pt-6">
              <div className="font-display text-4xl sm:text-5xl font-bold text-signal">
                {s.value}
              </div>
              <div className="mt-2 font-semibold">{s.label}</div>
              <p className="mt-2 text-sm text-paper/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
