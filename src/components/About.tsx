import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Fan } from "lucide-react";
import { Icons } from "@/lib/icons";

export default function About() {
  return (
    <section
      id="about"
      className="overflow-x-clip bg-white text-ink"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-6 py-5 lg:py-10">
        <div className="px-5 py-2 mb-5 lg:mb-10 text-sm lg:text-lg bg-muted w-fit rounded-full text-ink flex gap-3 items-center">
            <Fan
              className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>Get To Know The TechForge</span>
            <Fan
              className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
              aria-hidden="true"
            />
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:col-start-1 lg:col-end-8 lg:row-start-1 lg:h-[620px] lg:aspect-auto">
            <Image
              src="/tf12.jpg"
              alt="Attendees at The TechForge summit"
              fill
              sizes="(max-width: 1023px) calc(100vw - 2rem), 58vw"
              className="object-cover object-[center_25%]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/15"
              aria-hidden="true"
            />
          </div>

          <article className="relative z-10 mx-4 -mt-12 bg-white p-6 sm:mx-8 sm:-mt-16 sm:p-10 lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:mx-0 lg:mt-0 lg:p-12 xl:p-16">
            <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Lagos · December 2026
            </p>
            <h2 className="max-w-xl font-display text-[24px] font-bold leading-[1.02] tracking-tight text-ink sm:text-[48px] lg:text-[44px]">
              The TechForge is returning in 2026.
            </h2>

            <div className="mt-7 space-y-5 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                The first edition showed us how much people value a space where
                they can ask real questions, hear directly from people in the
                industry, and meet others figuring things out too.
              </p>
              <p>
                This December, over 1,000 attendees and 10+ speakers will come
                together for one focused day of practical conversations about
                technology, careers, building, and meaningful connection.
              </p>
            </div>

            <Link
              href="https://tix.africa/discover/the-tech-forge"
              target="_blank"
              rel="noopener noreferrer"
              transitionTypes={["nav-forward"]}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-black py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <span>Get your ticket</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-signal)] text-black">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
