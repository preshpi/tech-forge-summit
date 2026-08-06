export default function Hosts() {
  return (
    <section id="venue" className="mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-6">
            Hosts
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Curated by builders, for builders
          </h2>
          <p className="mt-6 text-paper/60 leading-relaxed max-w-md">
            The TechForge is run by a small independent team of operators and researchers
            who&apos;ve shipped AI products at every stage, from research labs to
            public companies. We pick the speakers, write the agenda, and run
            the show ourselves.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-[3/4] rounded-xl bg-gradient-to-br from-line to-ink-soft ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
