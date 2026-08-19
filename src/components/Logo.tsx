import Image from "next/image";

// Intrinsic size of the cropped logo asset (public/techforge-logo-dark.png).
const LOGO_WIDTH = 1372;
const LOGO_HEIGHT = 912;

type LogoProps = {
  /** Extra classes for the wrapper (e.g. `self-start` inside a column). */
  className?: string;
  /** Controls the rendered logo size; set the height and keep width auto. */
  imgClassName?: string;
  /** Load immediately instead of lazily — use above the fold (e.g. navbar). */
  eager?: boolean;
};

/**
 * The TechForge wordmark, tuned for the site's dark ink background.
 *
 * The source aronerk uses black tags ("THE", "2026") and a black cursor motif
 * that vanish against dark backgrounds, so this uses a dark-optimized variant
 * where those elements are inverted to stay legible without a backing plate.
 */
export default function Logo({
  className,
  imgClassName = "h-8 w-auto",
  eager = false,
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center${
        className ? ` ${className}` : ""
      }`}
    >
      <Image
        src="/techforge-logo-dark.png"
        alt="The TechForge 2026"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes="56px"
        className={imgClassName}
        loading={eager ? "eager" : "lazy"}
      />
    </span>
  );
}
