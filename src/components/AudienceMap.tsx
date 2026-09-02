"use client";

import Image from "next/image";

const slides = [
  { image: "/tf6.jpg", label: "Exploring Tech", eyebrow: "01 / Newbie" },
  { image: "/tf7.jpg", label: "Developers & Engineers", eyebrow: "02 / Systems" },
  { image: "/tf8.jpg", label: "Designers & Product People", eyebrow: "03 / Product" },
  { image: "/tf9.jpg", label: "Founders & Builders", eyebrow: "04 / Builders" },
  { image: "/tf10.jpg", label: "Tech Professionals", eyebrow: "05 / Experts" },
  { image: "/tf11.jpg", label: "Students", eyebrow: "06 / Early age" },
];

export default function AudienceMap() {
  return (
    <div className="relative">
      <div
        className="mx-auto flex max-w-[96rem] snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-4 pb-2 scrollbar-none sm:gap-6 sm:px-6 lg:px-12 xl:gap-8"
      >
        {slides.map((slide) => (
          <article
            key={slide.image}
            className="relative aspect-4/5 w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 bg-ink shadow-2xl shadow-black/15 sm:w-[44%] lg:w-[30%]"
          >
            <Image
              src={slide.image}
              alt={`${slide.label} at TechForge`}
              fill
              sizes="(max-width: 639px) 82vw, (max-width: 1023px) 44vw, (max-width: 1535px) 30vw, 432px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/16 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-paper/75">
                {slide.eyebrow}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-paper sm:text-2xl">
                {slide.label}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
