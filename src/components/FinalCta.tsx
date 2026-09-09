import Image from 'next/image';
import Link from 'next/link';

export default function FinalCta() {
  return (
    <section
      className="final-cta"
      id="tickets"
      aria-labelledby="cta-heading"
    >
      <div className="container final-cta__inner">
        <div className="final-cta__brand">
          <Image
            className="final-cta__logo"
            src="/assets/techforge-logo.png"
            alt="Tech Forge"
            width={1291}
            height={781}
          />
        </div>

        <div className="final-cta__copy js-reveal">
          <p className="final-cta__eyebrow">December 5, 2026. Lagos.</p>
          <h2 className="final-cta__title" id="cta-heading">
            <span className="reveal-line">Come build with us.</span>
          </h2>
          <div className="btn-row js-reveal">
            <a className="btn btn--primary" target="_blank" href="https://tix.africa/discover/the-tech-forge">
              Get Your Ticket <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <Link className="btn btn--outline" href="/contact">
              Become a Sponsor
            </Link>
          </div>
        </div>

        <Image
          className="final-cta__skyline js-reveal js-reveal--from-right"
          src="/assets/lagos-skyline.png"
          alt=""
          width={2172}
          height={724}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}