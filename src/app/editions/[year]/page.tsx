import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditionGallery from "@/components/EditionGallery";
import { getCompletedEditions, getEditionByYear } from "@/lib/editions";
import { createPageMetadata } from "@/lib/site";

type EditionPageProps = {
  params: Promise<{ year: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCompletedEditions().map((edition) => ({
    year: String(edition.year),
  }));
}

export async function generateMetadata({
  params,
}: EditionPageProps): Promise<Metadata> {
  const { year } = await params;
  const edition = getEditionByYear(year);

  if (!edition || edition.status !== "completed" || !edition.highlights) {
    return createPageMetadata({
      title: "Edition Not Found",
      description: "This Tech Forge edition is not available.",
      path: `/editions/${year}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${edition.title} Highlights`,
    description: edition.highlights.retrospective,
    path: `/editions/${edition.year}`,
  });
}

export default async function EditionDetailPage({ params }: EditionPageProps) {
  const { year } = await params;
  const edition = getEditionByYear(year);

  if (!edition || edition.status !== "completed" || !edition.highlights) {
    notFound();
  }

  const highlights = edition.highlights;

  return (
    <main id="top">
      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb__sep" aria-hidden="true">
          →
        </span>
        <Link href="/editions">Editions</Link>
        <span className="breadcrumb__sep" aria-hidden="true">
          →
        </span>
        <span aria-current="page">{edition.title}</span>
      </nav>

      <section
        className="edition-detail section--compact"
        aria-labelledby="edition-heading"
      >
        <div className="container edition-detail__grid">
          <div className="edition-detail__copy">
            <p className="eyebrow">Tech Forge {edition.year}</p>
            <h1
              className="heading-lg edition-detail__title"
              id="edition-heading"
            >
              {highlights.headlineDark}{" "}
              <span className="text-blue">{highlights.headlineBlue}</span>
            </h1>
            <p className="edition-detail__lede">
              {highlights.retrospective}
            </p>

            {(highlights.datePrimary || highlights.venuePrimary) && (
              <div className="edition-detail__meta">
                {highlights.datePrimary && (
                  <div className="edition-detail__meta-item">
                    <svg
                      className="edition-detail__icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M3 10h18M8 3v4M16 3v4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div>
                      <p className="edition-detail__meta-primary">
                        {highlights.datePrimary}
                      </p>
                      {highlights.dateSecondary && (
                        <p className="edition-detail__meta-secondary">
                          {highlights.dateSecondary}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {highlights.venuePrimary && (
                  <div className="edition-detail__meta-item">
                    <svg
                      className="edition-detail__icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="10.8"
                        r="2.1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                    <div>
                      <p className="edition-detail__meta-primary">
                        {highlights.venuePrimary}
                      </p>
                      {highlights.venueSecondary && (
                        <p className="edition-detail__meta-secondary">
                          {highlights.venueSecondary}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="edition-detail__media">
            {highlights.showNote && (
              <aside
                className="edition-detail__note script"
                aria-hidden="true"
              >
                Same People.
                <br />
                Bigger
                <br />
                Possibilities.
              </aside>
            )}
            <span className="edition-detail__accent" aria-hidden="true" />
            <figure className="edition-detail__photo relative aspect-16/10 overflow-hidden rounded-2xl">
              <Image
                src={highlights.heroImage}
                alt={highlights.heroImageAlt}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </figure>
          </div>
        </div>
      </section>

      {highlights.gallery.length > 0 && (
        <EditionGallery
          year={edition.year}
          gallery={highlights.gallery}
          fullGallery={highlights.fullGallery}
          galleryHref={highlights.galleryHref}
        />
      )}
    </main>
  );
}
