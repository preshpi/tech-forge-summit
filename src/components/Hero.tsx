import Countdown from "./Countdown";
import Marquee from "./Marquee";
import HeroBackdrop from "./HeroBackdrop";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-28 pb-10 sm:pt-32"
    >
      <HeroBackdrop />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10 flex-1 flex flex-col">
        {/* date / location meta, upper third */}
        <div className="mt-10 sm:mt-16 flex items-start justify-between font-mono text-sm uppercase tracking-wider text-paper/80">
          <div className="space-y-1">
            <div>March 12, 2027</div>
            <div className="text-signal">
              <Countdown />
            </div>
          </div>
          <div className="text-right space-y-1">
            <div>Downtown</div>
            <div>Austin, Texas</div>
          </div>
        </div>

        {/* headline anchored to the bottom of the viewport */}
        <div className="mt-auto pt-16">
          <Marquee />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <a
                href="/checkout?tier=general"
                className="rounded-full bg-signal text-ink font-semibold px-7 py-3.5 text-sm hover:bg-signal-dim transition-colors"
              >
                Get ticket
              </a>
              <a
                href="/checkout?tier=general"
                aria-label="Get ticket"
                className="h-12 w-12 shrink-0 rounded-full bg-signal text-ink flex items-center justify-center hover:bg-signal-dim transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <a
              href="#about"
              className="text-sm font-medium text-paper/70 hover:text-paper transition-colors inline-flex items-center gap-2"
            >
              Scroll to explore
              <span className="inline-block animate-bounce">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
