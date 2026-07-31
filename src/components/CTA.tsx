import Countdown from "./Countdown";

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <div className="rounded-3xl border border-line bg-ink-soft grain relative overflow-hidden px-8 py-16 md:py-24 text-center">
        <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-signal/10 blur-[100px]" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-[220px] w-[260px] rounded-full bg-accent-2/10 blur-[90px]" />
        <div className="relative flex flex-wrap justify-center gap-4 text-xs font-mono uppercase tracking-wider text-paper/50 mb-8">
          <span>March 12, 2027</span>
          <Countdown className="text-signal" />
          <span>Austin, Texas</span>
        </div>
        <h2 className="relative font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
          Let&apos;s make an impact together
        </h2>
        <a
          href="/checkout?tier=general"
          className="relative inline-block mt-10 rounded-full bg-signal text-ink font-semibold px-8 py-4 text-sm hover:bg-signal-dim transition-colors"
        >
          Get ticket
        </a>
      </div>
    </section>
  );
}
