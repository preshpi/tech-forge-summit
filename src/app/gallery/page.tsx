import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDownRight, Fan } from "lucide-react";
import GalleryFooter from "@/components/GalleryFooter";
import GalleryTypewriter from "@/components/GalleryTypewriter";

export const metadata: Metadata = {
  title: "Gallery | The TechForge",
  description: "A look back at the first edition of The TechForge.",
};

const moments = [
  { src: "/tf1.jpg", ratio: "aspect-[2/3]" },
  { src: "/tf2.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf3.jpg", ratio: "aspect-[2/3]" },
  { src: "/tf4.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf5.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf6.jpg", ratio: "aspect-[6/5]" },
  { src: "/tf7.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf8.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf9.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf10.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf11.jpg", ratio: "aspect-[2/3]" },
  { src: "/tf12.jpg", ratio: "aspect-[2/3]" },
  { src: "/tf13.jpg", ratio: "aspect-[2/3]" },
  { src: "/tf14.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf15.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf16.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf17.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf18.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf19.jpg", ratio: "aspect-[3/2]" },
  { src: "/tf20.jpg", ratio: "aspect-[3/2]" },
];

export default function GalleryPage() {
  return (
    <main className="overflow-hidden bg-paper text-ink">
      <section className="relative h-[460px] bg-ink px-6 pb-14 text-paper sm:px-10 lg:h-[720px]">
        <Image
          src="/tf20.jpg"
          alt="TechForge attendees together at the previous edition"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.42)_0%,rgba(10,10,12,0.52)_45%,rgba(10,10,12,0.82)_78%,rgba(10,10,12,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,0.42)_0%,rgba(10,10,12,0.16)_35%,rgba(10,10,12,0.16)_65%,rgba(10,10,12,0.38)_100%)]" />
        <div className="relative mx-auto flex h-[500px] lg:min-h-[610px] max-w-7xl flex-col justify-end">
          <div className="px-5 py-2 mb-5 text-[10px] lg:text-sm bg-white w-fit rounded-full text-ink flex gap-3 items-center">
            <Fan
              className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>TechForge 1.0: TechForge 2025</span>
            <Fan
              className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
              aria-hidden="true"
            />
          </div>
          <GalleryTypewriter />
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-paper/25 pt-5">
            <p className="max-w-md text-base leading-relaxed text-paper/75 sm:text-lg">
              A look back at the conversations, curiosity and collective energy
              that shaped our first edition.
            </p>
            <a
              href="#moments"
              className="group inline-flex items-center gap-3 text-sm font-semibold"
            >
              Explore the archive
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 transition-colors group-hover:bg-paper group-hover:text-ink">
                <ArrowDownRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:py-32">
        <div className="px-5 py-2 mb-5 text-[10px] lg:text-sm bg-[var(--color-primary)] text-white h-fit w-fit rounded-full text-ink flex gap-3 items-center">
          <Fan
            className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span>01 / In review</span>
          <Fan
            className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>
        <div>
          <h2 className="max-w-3xl font-display  font-bold leading-[1.08] tracking-tight lg:leading-[1.2] text-[24px] lg:text-[75px]">
            More than an event. A shared starting point.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/65 sm:text-xl">
            TechForge&apos;s first edition made room for practical ideas, honest
            questions and the kind of chance conversations that keep a community
            moving forward. These frames hold a little of that momentum.
          </p>
          <div className="mt-12 grid grid-cols-3 border-y border-ink/15 py-6">
            {[
              ["01", "First edition"],
              [moments.length, "Captured moments"],
              ["∞", "What comes next"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="border-l border-ink/15 px-3 first:border-l-0 first:pl-0 sm:px-5"
              >
                <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="moments"
        className="bg-[#e8e6e0] px-4 py-16 sm:px-6 lg:py-24"
      >
        <div className="mx-auto max-w-[1560px]">
          <div className="mb-9 flex items-end justify-between gap-6 px-2 sm:mb-12">
            <div>
              <div className="px-5 py-2 mb-5 text-[10px] lg:text-sm bg-[var(--color-primary)] text-white h-fit w-fit rounded-full text-ink flex gap-3 items-center">
                <Fan
                  className="animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span>02 / The archive</span>
                <Fan
                  className="animate-[spin_1.2s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-3 font-display font-bold leading-[1.08] tracking-tight lg:leading-[1.2] text-[24px] lg:text-[75px]">
                All the moments.
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-relaxed text-ink/60 sm:block">
              Twenty photos from the people, ideas and atmosphere of
              TechForge&apos;s first gathering.
            </p>
          </div>
          <div className="columns-2 gap-2 sm:gap-3 md:columns-3 lg:columns-4">
            {moments.map((moment, index) => (
              <figure
                key={moment.src}
                className={`group relative mb-2 inline-block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-ink align-top shadow-[0_14px_40px_rgba(30,28,84,0.12)] sm:mb-3 sm:rounded-[24px] ${moment.ratio}`}
              >
                <Image
                  src={moment.src}
                  alt={`Moment ${String(index + 1).padStart(2, "0")} from TechForge 2025`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <figcaption className="absolute bottom-3 left-3 translate-y-2 font-mono text-xs tracking-[0.18em] text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  TF / {String(index + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <GalleryFooter />
    </main>
  );
}
