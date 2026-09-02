import Image from "next/image";

const heroImages = [
  { src: "/tf20.jpg" },
  { src: "/tf2.jpg" },
  { src: "/tf3.jpg" },
  { src: "/tf4.jpg" },
  { src: "/tf5.jpg" },
];

type HeroBackdropProps = {
  activeIndex: number;
  nextIndex: number;
  isTransitioning: boolean;
  transitionKey: number;
  transitionMs: number;
};

export default function HeroBackdrop({
  activeIndex,
  nextIndex,
  isTransitioning,
  transitionKey,
  transitionMs,
}: HeroBackdropProps) {
  const activeImage = heroImages[activeIndex];
  const nextImage = heroImages[nextIndex];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      <div className="hero-image-carousel absolute inset-0" aria-hidden="true">
        <Image
          key={`active-${activeImage.src}`}
          src={activeImage.src}
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="100vw"
          className="hero-carousel-image hero-carousel-image-current object-cover"
        />

        {isTransitioning ? (
          <>
            <Image
              key={`next-${transitionKey}-${nextImage.src}`}
              src={nextImage.src}
              alt=""
              fill
              sizes="100vw"
              className="hero-carousel-image hero-carousel-image-next object-cover"
              style={{ animationDuration: `${transitionMs}ms` }}
            />
            <div
              key={`wipe-${transitionKey}`}
              className="hero-carousel-wipe"
              style={{ animationDuration: `${transitionMs}ms` }}
            />
          </>
        ) : null}
      </div>

      {/* A richer primary wash gives every slide the TechForge purple tone. */}
      <div className="absolute inset-0 bg-[var(--color-primary)]/35" />

      {/* A deep vignette keeps the hero content crisp over brighter images. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.42)_0%,rgba(10,10,12,0.52)_45%,rgba(10,10,12,0.82)_78%,rgba(10,10,12,0.95)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,0.42)_0%,rgba(10,10,12,0.16)_35%,rgba(10,10,12,0.16)_65%,rgba(10,10,12,0.38)_100%)]" />
    </div>
  );
}
