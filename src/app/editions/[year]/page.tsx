'use client';

import { use, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItem {
  src: string;
  alt?: string;
  size?: string;
  width?: number;
  height?: number;
}

interface Edition {
  year: number;
  status: string;
  title: string;
  highlights?: {
    headlineDark: string;
    headlineBlue: string;
    retrospective: string;
    datePrimary?: string;
    dateSecondary?: string;
    venuePrimary?: string;
    venueSecondary?: string;
    heroImage: string;
    heroImageAlt?: string;
    showNote?: boolean;
    gallery?: GalleryItem[];
    fullGallery?: GalleryItem[];
    galleryHref?: string;
  };
}

function getImageSrc(src: string) {
  return src.startsWith('/') || /^https?:\/\//i.test(src)
    ? src
    : `/assets/${src}`;
}

declare global {
  interface Window {
    TechForgeEditions?: {
      getAll: () => Edition[];
      getByYear: (year: number) => Edition | null;
      asset: (base: string, path: string) => string;
      page: (base: string, path: string) => string;
    };
    TECHFORGE_EDITION_YEAR?: number;
    TECHFORGE_ASSET_BASE?: string;
  }
}

export default function EditionDetailPage({ params }: { params: Promise<{ year: string }> }) {
  const resolvedParams = use(params);
  const yearNumber = Number(resolvedParams.year);

  // Initialize state directly via function call instead of setting state in useEffect
  const [edition, setEdition] = useState<Edition | null>(() => {
    if (typeof window !== 'undefined' && window.TechForgeEditions) {
      return window.TechForgeEditions.getByYear(yearNumber);
    }
    return null;
  });

  const [isLoaded, setIsLoaded] = useState(() => {
    return typeof window !== 'undefined' && !!window.TechForgeEditions;
  });
  const [isFullGalleryVisible, setIsFullGalleryVisible] = useState(false);

  const handleScriptLoad = () => {
    if (window.TechForgeEditions) {
      window.TECHFORGE_EDITION_YEAR = yearNumber;
      window.TECHFORGE_ASSET_BASE = "/assets/";
      
      const found = window.TechForgeEditions.getByYear(yearNumber);
      setEdition(found);
      setIsLoaded(true);
    }
  };

  if (isLoaded && (!edition || edition.status !== "completed" || !edition.highlights)) {
    return (
      <main id="top">
        <div className="container section--compact py-20 text-center">
          <p className="body-text mb-4 text-lg">This edition page is not available yet.</p>
          <Link className="btn btn--outline" href="/editions">
            ← Back to Editions
          </Link>
        </div>
      </main>
    );
  }

  const h = edition?.highlights;

  return (
    <main id="top">
      <Script 
        src="/editions-data.js" 
        strategy="beforeInteractive" 
        onLoad={handleScriptLoad} 
      />

      <div id="edition-page">
        {edition && h && (
          <>
            <nav className="breadcrumb container" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb__sep" aria-hidden="true">→</span>
              <Link href="/editions">Editions</Link>
              <span className="breadcrumb__sep" aria-hidden="true">→</span>
              <span aria-current="page">{edition.title}</span>
            </nav>

            <section className="edition-detail section--compact" aria-labelledby="edition-heading">
              <div className="container edition-detail__grid">
                <div className="edition-detail__copy">
                  <p className="eyebrow">Tech Forge {edition.year}</p>
                  <h1 className="heading-lg edition-detail__title" id="edition-heading">
                    {h.headlineDark} <span className="text-blue">{h.headlineBlue}</span>
                  </h1>
                  <p className="edition-detail__lede">{h.retrospective}</p>
                  
                  {(h.datePrimary || h.venuePrimary) && (
                    <div className="edition-detail__meta">
                      {h.datePrimary && (
                        <div className="edition-detail__meta-item">
                          <svg className="edition-detail__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                          <div>
                            <p className="edition-detail__meta-primary">{h.datePrimary}</p>
                            {h.dateSecondary && <p className="edition-detail__meta-secondary">{h.dateSecondary}</p>}
                          </div>
                        </div>
                      )}
                      {h.venuePrimary && (
                        <div className="edition-detail__meta-item">
                          <svg className="edition-detail__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                            <circle cx="12" cy="10.8" r="2.1" stroke="currentColor" strokeWidth="1.8"/>
                          </svg>
                          <div>
                            <p className="edition-detail__meta-primary">{h.venuePrimary}</p>
                            {h.venueSecondary && <p className="edition-detail__meta-secondary">{h.venueSecondary}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="edition-detail__media">
                  {h.showNote && (
                    <aside className="edition-detail__note script" aria-hidden="true">
                      Same People.<br />Bigger<br />Possibilities.
                    </aside>
                  )}
                  <span className="edition-detail__accent" aria-hidden="true"></span>
                  <figure className="edition-detail__photo relative aspect-16/10 overflow-hidden rounded-2xl">
                    <Image
                      src={getImageSrc(h.heroImage)}
                      alt={h.heroImageAlt || edition.title}
                      fill
                      className="object-cover"
                    />
                  </figure>
                </div>
              </div>
            </section>

            {h.gallery && h.gallery.length > 0 && (
              <section className="edition-gallery section--compact" aria-labelledby="gallery-heading">
                <div className="container edition-gallery__layout">
                  <div className="edition-gallery__intro">
                    <p className="eyebrow">Event Gallery</p>
                    <h2 className="heading-lg" id="gallery-heading">
                      Moments<br /><span className="text-blue">that mattered.</span>
                    </h2>
                    <p className="edition-gallery__lede">
                      A glimpse into the energy, conversations and community that made Tech Forge {edition.year} special.
                    </p>
                    {h.fullGallery && h.fullGallery.length > 0 ? (
                      <button
                        className="btn btn--outline"
                        type="button"
                        aria-expanded={isFullGalleryVisible}
                        aria-controls={`full-gallery-${edition.year}`}
                        onClick={() => setIsFullGalleryVisible(true)}
                      >
                        View Full Gallery →
                      </button>
                    ) : (
                      <Link className="btn btn--outline" href={h.galleryHref || "/editions"}>
                        View Full Gallery →
                      </Link>
                    )}
                  </div>
                  <div className="edition-gallery__collage">
                    {h.gallery.map((img, i) => (
                      <figure 
                        key={i} 
                        className={`edition-gallery__item edition-gallery__item--${img.size || "square"}${i === 0 ? " edition-gallery__item--lead" : ""}`}
                      >
                        <Image
                          src={getImageSrc(img.src)}
                          alt={img.alt || ""}
                          width={1536}
                          height={1024}
                          loading="lazy"
                        />
                      </figure>
                    ))}
                  </div>
                </div>

                {isFullGalleryVisible && h.fullGallery && (
                  <div
                    id={`full-gallery-${edition.year}`}
                    className="mt-20 columns-1 gap-4 sm:mt-24 sm:columns-2 lg:columns-3 xl:columns-4"
                    aria-label={`Full Tech Forge ${edition.year} event gallery`}
                  >
                    {h.fullGallery.map((img, i) => (
                      <figure
                        key={`${img.src}-${i}`}
                        className="mb-6 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl bg-[#0b1220]"
                      >
                        <Image
                          src={getImageSrc(img.src)}
                          alt={img.alt || ""}
                          width={img.width || 1000}
                          height={img.height || 668}
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                          className="block h-auto w-full"
                          loading="lazy"
                        />
                      </figure>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
