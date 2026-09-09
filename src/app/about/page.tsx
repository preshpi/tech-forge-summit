import Image from "next/image";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Discover how Tech Forge brings African builders, founders and technology professionals together to learn, connect and create lasting impact.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <main id="top">
        {/* About introduction */}
        <section className="page-intro" aria-labelledby="about-heading">
          <div className="container page-intro__grid">
            <div className="page-intro__copy">
              <p className="eyebrow">About Tech Forge</p>
              <h1 className="heading-lg page-intro__title" id="about-heading">
                We’re building more than{' '}
                <span className="text-blue">an event.</span>
              </h1>
              <p className="page-intro__lede">
                Tech Forge is where builders, thinkers and technology professionals
                come together to learn, connect and build what’s next.
              </p>
            </div>

            <div className="page-intro__visual" aria-hidden="true">
              <span className="page-intro__star"></span>
              <span className="page-intro__sun"></span>
              <span className="page-intro__tri"></span>
              <Image
                className="page-intro__skyline"
                src="/assets/lagos-skyline.png"
                alt=""
                width={2172}
                height={724}
              />
              <p className="page-intro__script script">
                Ideas<br />
                People<br />
                <span className="script--highlight">Progress</span>
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="about-story section--compact" aria-labelledby="story-heading">
          <div className="container about-story__grid">
            <div className="about-story__media">
              <span className="about-story__accent" aria-hidden="true"></span>
              <figure className="about-story__photo">
                <Image
                  src="/tf18.jpg"
                  alt="Audience at a Tech Forge gathering"
                  width={1536}
                  height={1024}
                />
              </figure>
              <aside className="about-story__note script" aria-hidden="true">
                Same People.<br />
                Bigger<br />
                Possibilities.
              </aside>
            </div>

            <div className="about-story__copy">
              <p className="eyebrow">Our Story</p>
              <h2 className="heading-lg about-story__title" id="story-heading">
                A platform born{' '}
                <span className="text-blue">from community.</span>
              </h2>
              <div className="about-story__body">
                <p>
                  Tech Forge started with a simple idea, to create a space where
                  Africa’s builders can learn from each other, share real
                  experiences and get access to the people and opportunities that
                  move them forward.
                </p>
                <p>
                  What began as a community-driven gathering has grown into an
                  annual conference, bringing together developers, founders,
                  product leaders, investors and creators from across Africa and
                  beyond.
                </p>
                <p>
                  We’re still guided by the same belief: that when people learn,
                  connect and build together, Africa’s tech ecosystem goes further.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Purpose */}
        <section className="about-purpose section--compact" aria-labelledby="purpose-heading">
          <div className="container">
            <div className="about-purpose__panel">
              <div className="about-purpose__copy">
                <p className="eyebrow">Our Purpose</p>
                <h2 className="heading-lg about-purpose__title" id="purpose-heading">
                  More builders.{' '}
                  <span className="text-blue">A brighter tomorrow.</span>
                </h2>
                <p className="about-purpose__lede">
                  We exist to equip, connect and inspire the next generation of
                  African builders with the skills, knowledge and networks to solve
                  real problems and create lasting impact.
                </p>
              </div>

              <ol className="about-purpose__list">
                <li className="purpose-item">
                  <span className="purpose-item__icon purpose-item__icon--learn" aria-hidden="true">
                    <svg viewBox="0 0 32 32" fill="none">
                      <path
                        d="M6 10.5 16 6l10 4.5v9.2c0 3.4-4.2 5.8-10 7.3-5.8-1.5-10-3.9-10-7.3V10.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 16v7.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="purpose-item__num">01</p>
                    <h3 className="purpose-item__title">Practical Learning</h3>
                    <p className="purpose-item__text">
                      Real-world insights from people building at scale.
                    </p>
                  </div>
                </li>

                <li className="purpose-item">
                  <span className="purpose-item__icon purpose-item__icon--connect" aria-hidden="true">
                    <svg viewBox="0 0 32 32" fill="none">
                      <circle cx="11" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="21" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M5.5 23c1-3.2 3.2-4.8 5.5-4.8S15.5 19.8 16.5 23M15.5 23c1-3.2 3.2-4.8 5.5-4.8s4.5 1.6 5.5 4.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="purpose-item__num">02</p>
                    <h3 className="purpose-item__title">Meaningful Connections</h3>
                    <p className="purpose-item__text">
                      A community of builders, collaborators and opportunity.
                    </p>
                  </div>
                </li>

                <li className="purpose-item">
                  <span className="purpose-item__icon purpose-item__icon--impact" aria-hidden="true">
                    <svg viewBox="0 0 32 32" fill="none">
                      <path
                        d="M6 22 13 15l5 5 8-10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 10h6v6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="purpose-item__num">03</p>
                    <h3 className="purpose-item__title">Greater Impact</h3>
                    <p className="purpose-item__text">
                      More solutions, more jobs, a stronger tech ecosystem for
                      Africa.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Infinite Community */}
        <section
          className="about-community section--compact"
          aria-labelledby="community-people-heading"
        >
          <div className="container about-community__grid">
            <div className="about-community__copy">
              <p className="eyebrow">The People Behind It</p>
              <h2 className="heading-lg about-community__title" id="community-people-heading">
                Built by{' '}
                <span className="text-blue">The Infinite Community.</span>
              </h2>
              <div className="about-community__body">
                <p>
                  Tech Forge is an initiative of The Infinite Community, a
                  community of builders, tech professionals and lifelong learners
                  committed to Africa’s growth through technology.
                </p>
                <p>
                  We create spaces, resources and opportunities for people to
                  learn, collaborate and build meaningful solutions for the
                  continent and beyond.
                </p>
              </div>
              <Link className="btn btn--outline" href="https://chat.whatsapp.com/COxRQs88FdvIuA9bKjuKlc">
                Join the Community →
              </Link>
            </div>

           <div className="about-community__media">
              <span className="about-community__blob" aria-hidden="true"></span>
              <figure className="about-community__photo">
                <Image
                  src="/tf11.jpg"
                  alt="Builders connecting at Tech Forge"
                  width={1536}
                  height={1024}
                />
              </figure>
              <span className="about-community__chip" aria-hidden="true"></span>
              <p className="about-community__script script">
                Build.<br />
                Connect.<br />
                <span className="script--highlight">Belong.</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
