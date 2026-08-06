import Image from "next/image";

const heroImages = [
  { src: "/tf1.jpg" },
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

      {/* warm key light, upper right — stands in for a stage spotlight */}
      <div className="absolute -top-24 right-[-10%] h-155 w-155 rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.16),transparent_70%)]" />
      {/* cool fill light, left */}
      <div className="absolute top-1/3 -left-32 h-120 w-120 rounded-full bg-[radial-gradient(closest-side,rgba(185,140,255,0.12),transparent_70%)]" />

      {/* vignette so the headline stays legible over the crowd */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.2)_0%,rgba(10,10,12,0.55)_45%,rgba(10,10,12,0.95)_78%,#0a0a0c_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,0.55)_0%,transparent_35%,transparent_65%,rgba(10,10,12,0.4)_100%)]" />
    </div>
  );
}
