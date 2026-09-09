import Image from "next/image";
import Link from "next/link";
import { getEditions, type Edition } from "@/lib/editions";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Editions",
  description:
    "Explore past Tech Forge highlights and discover what is planned for Tech Forge 2026, the gathering for Africa’s builders and technology leaders.",
  path: "/editions",
});

function CalendarIcon() {
  return (
    <svg
      className="edition-row__icon"
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
  );
}

function PinIcon() {
  return (
    <svg
      className="edition-row__icon"
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
  );
}

function EditionMeta({ edition }: { edition: Edition }) {
  return (
    <div className="edition-row__meta">
      <div className="edition-row__meta-item">
        <CalendarIcon />
        <div>
          <p className="edition-row__meta-primary">
            <time dateTime={edition.dateISO}>{edition.datePrimary}</time>
          </p>
          {edition.dateSecondary && (
            <p className="edition-row__meta-secondary">
              {edition.dateSecondary}
            </p>
          )}
        </div>
      </div>

      <div className="edition-row__meta-item">
        <PinIcon />
        <div>
          <p className="edition-row__meta-primary">{edition.venuePrimary}</p>
          {edition.venueSecondary && (
            <p className="edition-row__meta-secondary">
              {edition.venueSecondary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditionsPage() {
  const editions = getEditions();

  return (
    <main id="top">
      <section className="page-intro" aria-labelledby="editions-heading">
        <div className="container page-intro__grid">
          <div className="page-intro__copy">
            <p className="eyebrow">
              <svg
                className="eyebrow__mark"
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
              Our Editions
            </p>
            <h1
              className="heading-lg page-intro__title"
              id="editions-heading"
            >
              A growing movement of{" "}
              <span className="text-blue">African builders.</span>
            </h1>
            <p className="page-intro__lede">
              From our first gathering to what’s next, each edition of Tech
              Forge has brought together an incredible community of builders,
              learners and leaders shaping the future of Africa’s tech
              ecosystem.
            </p>
          </div>

          <div className="page-intro__visual" aria-hidden="true">
            <span className="page-intro__star" />
            <span className="page-intro__sun" />
            <span className="page-intro__wedge" />
            <Image
              className="page-intro__skyline"
              src="/assets/lagos-skyline.png"
              alt=""
              width={2172}
              height={724}
            />
            <p className="page-intro__script script">
              Ideas
              <br />
              People
              <br />
              <span className="script--highlight">Progress</span>
            </p>
          </div>
        </div>
      </section>

      <section
        className="editions-list section--compact"
        aria-label="Tech Forge editions"
      >
        <div className="container" id="editions-list">
          {editions.map((edition, index) => (
            <article
              className={`edition-row${index % 2 === 1 ? " edition-row--flip" : ""}`}
              id={`edition-${edition.year}`}
              key={edition.year}
            >
              <div className="edition-row__media">
                <figure className="edition-row__photo">
                  <Image
                    src={edition.listImage}
                    alt={edition.listImageAlt}
                    width={1536}
                    height={1024}
                    sizes="(max-width: 960px) 100vw, 50vw"
                  />
                </figure>
              </div>

              <div className="edition-row__copy">
                <span
                  className={`edition-badge ${
                    edition.status === "upcoming"
                      ? "edition-badge--latest"
                      : "edition-badge--past"
                  }`}
                >
                  {edition.status === "upcoming"
                    ? "Latest edition"
                    : "Past edition"}
                </span>
                <h2 className="edition-row__title">{edition.title}</h2>
                <p className="edition-row__theme">{edition.theme}</p>
                <EditionMeta edition={edition} />
                <p className="edition-row__summary">{edition.summary}</p>

                {edition.status === "upcoming" ? (
                  <a
                    className="btn btn--primary"
                    href={edition.ticketHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Your Ticket →
                  </a>
                ) : (
                  <Link
                    className="btn btn--outline"
                    href={`/editions/${edition.year}`}
                  >
                    View Highlights →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
