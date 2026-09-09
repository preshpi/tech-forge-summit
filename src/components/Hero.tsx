// 

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__shape hero__shape--1"></span>
        <span className="hero__shape hero__shape--2"></span>
        <span className="hero__shape hero__shape--3"></span>
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow js-hero-item">
            <svg
              className="eyebrow__mark"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="2.2" fill="currentColor" />
              <circle cx="7.5" cy="15.5" r="2.2" fill="currentColor" />
              <circle cx="16.5" cy="15.5" r="2.2" fill="currentColor" />
              <path
                d="M8.2 13.6c1.4 1.5 3 2.2 3.8 2.2s2.4-.7 3.8-2.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            The Infinite Community Presents
          </p>

          <h1 className="hero__title js-hero-item" id="hero-heading">
            <span className="hero__title-line  js-hero-item">The Builders’</span>
            <span className="text-blue hero__title-line js-hero-item">Blueprint</span>
          </h1>

          <p className="hero__support js-hero-item">
            Skills, Strategy &amp; Innovation for the future.
          </p>

          <div className="event-meta js-hero-item js-stagger js-stagger--tight">
            <div className="event-meta__col">
              <svg
                className="event-meta__icon"
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
              <div className="event-meta__text">
                <p className="event-meta__primary">Saturday, December 5, 2026</p>
                <p className="event-meta__secondary">9:00 AM – 5:00 PM (WAT)</p>
              </div>
            </div>
            <div className="event-meta__col">
              <svg
                className="event-meta__icon"
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
              <div className="event-meta__text">
                <p className="event-meta__primary">The Zone</p>
                <p className="event-meta__secondary">
                  Plot 9, Gbagada Industrial Scheme, beside UPS,
                  Gbagada-Oworonshoki Expressway, Lagos State
                </p>
              </div>
            </div>
          </div>

          <div className="btn-row js-hero-item">
            <a className="btn btn--primary" href="https://tix.africa/discover/the-tech-forge">
              Get Your Ticket <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <Link className="btn-play" href="https://www.instagram.com/reel/DOl6KDHDQPF/?stkn=MWhqMTNraHJ6cHo5eA==">
              <span className="btn-play__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
                </svg>
              </span>
              Watch 2025 Highlights
            </Link>
          </div>

          <p className="hero__script script js-hero-item js-reveal--script">
            <span className="script--highlight">A More Human Tech Tomorrow</span>
          </p>
        </div>

        <div className="hero__visual">
          <div className="hero__stack">
            <svg
              className="hero__spark js-hero-item js-parallax"
              data-parallax="8"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path fill="#e83a5c" d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8Z" />
              <path fill="#f5c518" d="M36 2l2.4 7.2L46 12l-7.6 2.8L36 22l-2.4-7.2L26 12l7.6-2.8Z" />
              <path fill="#0b1220" d="M12 26l2.4 7.2L22 36l-7.6 2.8L12 46l-2.4-7.2L2 36l7.6-2.8Z" />
              <path fill="#1e4fd8" d="M36 26l2.4 7.2L46 36l-7.6 2.8L36 46l-2.4-7.2L26 36l7.6-2.8Z" />
            </svg>

            <figure
              className="hero__photo js-hero-item js-parallax"
              data-parallax="12"
            >
              <Image
                src="/tf9.jpg"
                alt="Speaker on stage at Tech Forge"
                width={1400}
                height={1810}
                priority
              />
            </figure>

            <aside
              className="hero__yellow js-hero-item js-reveal--note js-parallax"
              data-parallax="6"
              aria-hidden="true"
            >
              <p>People</p>
              <p>Ideas</p>
              <p>Products</p>
              <p>A Brighter</p>
              <p className="hero__yellow-accent">Tomorrow</p>
            </aside>

            <span
              className="hero__pink js-hero-item js-parallax"
              data-parallax="10"
              aria-hidden="true"
            ></span>

            <figure
              className="hero__inset js-hero-item js-reveal--inset js-parallax"
              data-parallax="22"
            >
              <Image
                src="/tf10.jpg"
                alt="Audience member at Tech Forge"
                width={900}
                height={836}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}