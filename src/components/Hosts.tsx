"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

export default function Hosts() {
  return (
    <section
      id="hosts"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-16 bg-black text-white"
    >
      {/* Top Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            <Plus className="h-3.5 w-3.5 text-[#86efac]" />
            <span>Host</span>
          </div>

          <h2 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
            Curated by{" "}
            <span className="relative inline-block">
              builders,
              {/* Green Scribble/Underline SVG Accent */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#86efac]"
                viewBox="0 0 100 20"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 12 Q 25 2, 50 12 T 98 10"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            for builders.
          </h2>
          <p className="mt-6 text-paper/60 leading-relaxed max-w-md">
            The TechForge is run by a small independent team of operators and
            researchers who&apos;ve shipped AI products at every stage, from
            research labs to public companies. We pick the speakers, write the
            agenda, and run the show ourselves.
          </p>
        </div>
      </div>

      {/* Image Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 h-auto md:h-[620px]">
        {/* Column 1: Tall Vertical Image */}
        <div className="md:col-span-4 relative min-h-[380px] md:min-h-0 rounded-[28px] overflow-hidden border border-zinc-800/60">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
            alt="Team collaborating at table"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Column 2: Two Stacked Images */}
        <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Wide Photo */}
          <div className="relative h-[200px] md:h-[220px] rounded-[24px] overflow-hidden border border-zinc-800/60 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
              alt="Group selfie of the team"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bottom Tall Photo */}
          <div className="relative flex-1 min-h-[260px] md:min-h-0 rounded-[28px] overflow-hidden border border-zinc-800/60">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
              alt="Researcher sitting in red seats"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Column 3: Two Stacked Images */}
        <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Tall Photo */}
          <div className="relative flex-1 min-h-[300px] md:min-h-0 rounded-[28px] overflow-hidden border border-zinc-800/60">
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
              alt="Co-founders working outside"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Bottom Wide Photo */}
          <div className="relative h-[180px] md:h-[190px] rounded-[24px] overflow-hidden border border-zinc-800/60 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800"
              alt="Panel speakers at conference"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
