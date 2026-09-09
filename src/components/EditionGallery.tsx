"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/lib/editions";

type EditionGalleryProps = {
  year: number;
  gallery: GalleryItem[];
  fullGallery: GalleryItem[];
  galleryHref?: string;
};

export default function EditionGallery({
  year,
  gallery,
  fullGallery,
  galleryHref = "/editions",
}: EditionGalleryProps) {
  const [isFullGalleryVisible, setIsFullGalleryVisible] = useState(false);

  return (
    <section
      className="w-full edition-gallery section--compact"
      aria-labelledby="gallery-heading"
    >
      <div className="container edition-gallery__layout">
        <div className="edition-gallery__intro">
          <p className="eyebrow">Event Gallery</p>
          <h2 className="heading-lg" id="gallery-heading">
            Moments
            <br />
            <span className="text-blue">that mattered.</span>
          </h2>
          <p className="edition-gallery__lede">
            A glimpse into the energy, conversations and community that made
            Tech Forge {year} special.
          </p>
          {fullGallery.length > 0 ? (
            <button
              className="btn btn--outline"
              type="button"
              aria-expanded={isFullGalleryVisible}
              aria-controls={`full-gallery-${year}`}
              onClick={() => setIsFullGalleryVisible((visible) => !visible)}
            >
              {isFullGalleryVisible ? "Hide Full Gallery" : "View Full Gallery"}
              {" →"}
            </button>
          ) : (
            <Link className="btn btn--outline" href={galleryHref}>
              View Full Gallery →
            </Link>
          )}
        </div>

        <div className="edition-gallery__collage">
          {gallery.map((image, index) => (
            <figure
              key={image.src}
              className={`edition-gallery__item edition-gallery__item--${image.size || "square"}${index === 0 ? " edition-gallery__item--lead" : ""}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>

      {isFullGalleryVisible && fullGallery.length > 0 && (
        <div
          id={`full-gallery-${year}`}
          className="mx-auto mt-20 columns-2 px-5 [column-gap:0.75rem] sm:mt-24 sm:px-8 sm:[column-gap:1rem] lg:columns-3 lg:px-10 lg:[column-gap:1.5rem] xl:columns-4"
          aria-label={`Full Tech Forge ${year} event gallery`}
        >
          {fullGallery.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className="mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl bg-[#0b1220] sm:mb-4 lg:mb-6"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                className="block h-auto w-full"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
