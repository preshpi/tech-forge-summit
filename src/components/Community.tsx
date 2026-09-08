import Image from 'next/image';
import Link from 'next/link';

export default function Community() {
  return (
    <section
      className="community section"
      id="editions"
      aria-labelledby="community-heading"
    >
      <div className="container community__grid">
        <div className="community__copy js-reveal">
          <h2 className="heading-lg" id="community-heading">
            <span className="reveal-line">A growing community.</span>
            <span className="reveal-line">A bigger tomorrow.</span>
          </h2>
          <p className="body-text">
            Tech Forge is growing into a larger gathering of builders, thinkers
            and technology professionals coming together to learn, connect and
            build.
          </p>
          <Link className="btn btn--light" href="/editions">
            Explore past editions <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="community__gallery js-stagger" id="gallery">
          <figure className="media community__main js-reveal--image">
            <Image
              src="/assets/conference-wide.png"
              alt="Tech Forge audience smiling together"
              width={1536}
              height={1024}
            />
          </figure>
          <figure className="media community__side community__side--top">
            <Image
              src="/assets/conference-stage-alt.png"
              alt="Conference stage from a past Tech Forge"
              width={1536}
              height={1024}
            />
          </figure>
          <figure className="media community__side community__side--bottom">
            <Image
              src="/assets/networking.png"
              alt="Networking at Tech Forge"
              width={1536}
              height={1024}
            />
          </figure>

          <p className="community__script script js-reveal--script">
            <span className="script--highlight">
              Same People. Bigger Possibilities.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}