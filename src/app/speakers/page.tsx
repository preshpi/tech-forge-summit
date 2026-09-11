import Image from "next/image";
import UpcomingSpeakerCard from "@/components/UpcomingSpeakerCard";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Speakers",
  description:
    "Meet the founders, engineers, product leaders, investors and creators speaking at Tech Forge 2026 in Lagos.",
  path: "/speakers",
});

const speakers = [
  {
    name: "Paul Edward",
    role: "Founder, TIC\nHost, The TechForge",
    session: "Beyond the Prompt: How AI Agents Are Changing the Way We Work, Build and Collaborate",
    image: "/assets/speakers/infinity-paul-1.jpeg",
    badge: "Speaker",
    badgeClass: "speaker-badge--keynote",
    ruleClass: "speaker-badge--keynote",
  },
  {
    name: "Iyinoluwa Aboyeji",
    role: "Founding Partner, Future Africa\nCo-founder, Andela",
    session: "The Next Chapter for African Builders",
    image: "/assets/speakers/iyinoluwa-aboyeji-1.jpeg",
    badge: "Fireside Chat",
    badgeClass: "speaker-badge--fireside",
    ruleClass: "speaker-badge--fireside",
  },
  {
    name: "Imam Abubakar",
    role: "Founder, Sqaleup\nFounder, Upsqaler",
    session: "Building Beyond Borders: Creating Global Tech Solutions from Africa",
    image: "/assets/speakers/imam.jpeg",
    badge: "Speaker",
    badgeClass: "speaker-badge--keynote",
    ruleClass: "speaker-badge--keynote",
  },
  {
    name: "Folashade Blessing",
    role: "Senior Product Designer, Interswitch Group\nFounder, Designer Fola Circle",
    session: "Designing for the Future: Building Products People Actually Need",
    image: "/assets/speakers/folashade.jpeg",
    badge: "Speaker",
    badgeClass: "speaker-badge--keynote",
    ruleClass: "speaker-badge--keynote",
  },
  {
    name: "Dominus Kelvin",
    role: "Founder & Lead Maintainer, Sails",
    session: "The Architecture of a Future-Proof Tech Career",
    image: "/assets/speakers/koo.jpg",
    badge: "Speaker",
    badgeClass: "speaker-badge--keynote",
    ruleClass: "speaker-badge--keynote",
  },
  {
    name: "Dabere Nnamani",
    role: "Founder, The Data Immersed (TDI)\nData Analyst, AI, Engineer",
    session: "To be revealed",
    image: "/assets/speakers/annie.jpeg",
    badge: "Speaker",
    badgeClass: "speaker-badge--keynote",
    ruleClass: "speaker-badge--keynote",
  },
  // {
  //   name: "Bosun Tijani",
  //   role: "Minister of Communications,\nInnovation & Digital Economy",
  //   session: "Policy, Talent & the Builder Economy",
  //   image: "/assets/speakers/bosun-tijani.png",
  //   badge: "Panel",
  //   badgeClass: "speaker-badge--panel",
  //   ruleClass: "speaker-badge--panel",
  // },
  // {
  //   name: "Fara Ashiru Jituboh",
  //   role: "Founder\nSoft Space",
  //   session: "From Idea to Investable Product",
  //   image: "/assets/speakers/fara-ashiru-jituboh.png",
  //   badge: "Panel",
  //   badgeClass: "speaker-badge--panel",
  //   ruleClass: "speaker-badge--panel",
  // },
  // {
  //   name: "Ayodeji Razaq",
  //   role: "Engineering Leader\nPaystack",
  //   session: "Agentic Engineering in Practice",
  //   image: "/assets/speakers/ayodeji-razaq.png",
  //   badge: "Speaker",
  //   badgeClass: "speaker-badge--workshop",
  //   ruleClass: "speaker-badge--workshop",
  // },
  // {
  //   name: "Segun Adeyemi",
  //   role: "Partner\nVentures Platform",
  //   session: "What Investors Look for in 2026",
  //   image: "/assets/speakers/segun-adeyemi.png",
  //   badge: "Panel",
  //   badgeClass: "speaker-badge--panel",
  //   ruleClass: "speaker-badge--panel",
  // },
  // {
  //   name: "Ada Nduka",
  //   role: "Founder\nShe Code Africa",
  //   session: "Building Communities that Last",
  //   image: "/assets/speakers/ada-nduka.png",
  //   badge: "Fireside",
  //   badgeClass: "speaker-badge--fireside",
  //   ruleClass: "speaker-badge--fireside",
  // },
  // {
  //   name: "Chuka Ikokwu",
  //   role: "Founder & CEO\nSeamlessHR",
  //   session: "Operating Systems for Growing Teams",
  //   image: "/assets/speakers/chuka-ikokwu.png",
  //   badge: "Panel",
  //   badgeClass: "speaker-badge--panel",
  //   ruleClass: "speaker-badge--panel",
  // },
  // {
  //   name: "Kehinde Bello",
  //   role: "Design Director\nFlutterwave",
  //   session: "Design Systems for Scale",
  //   image: "/assets/speakers/kehinde-bello.png",
  //   badge: "Speaker",
  //   badgeClass: "speaker-badge--workshop",
  //   ruleClass: "speaker-badge--workshop",
  // },
  // {
  //   name: "Jide Alade",
  //   role: "Founder\nTechCabal",
  //   session: "Narratives Shaping African Tech",
  //   image: "/assets/speakers/jide-alade.png",
  //   badge: "Panel",
  //   badgeClass: "speaker-badge--panel",
  //   ruleClass: "speaker-badge--panel",
  // },
];

export default function SpeakersPage() {
  return (
    <main id="top">
      {/* Speakers intro */}
      <section className="speakers-intro" aria-labelledby="speakers-heading">
        <div className="container speakers-intro__grid">
          <div className="speakers-intro__copy">
            <p className="eyebrow">
              <svg
                className="eyebrow__mark"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="16" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M4.5 19c.8-2.6 2.7-4 4.5-4s3.7 1.4 4.5 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M13.2 15.2c1.1-.7 2.4-1 3.5-.8 1.5.3 2.9 1.4 3.6 3.6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              Speakers
            </p>

            <h1 className="heading-lg speakers-intro__title" id="speakers-heading">
              Meet the people{' '}
              <span className="text-blue">building what’s next.</span>
            </h1>

            <p className="speakers-intro__lede">
              Founders, engineers, product leaders, investors and creators
              sharing real insights, practical lessons and bold ideas for the
              future.
            </p>
          </div>

          <div className="speakers-intro__visual" aria-hidden="true">
            <span className="speakers-intro__star"></span>
            <span className="speakers-intro__sun"></span>
            <span className="speakers-intro__tri"></span>
            <Image
              className="speakers-intro__skyline"
              src="/assets/lagos-skyline.png"
              alt=""
              width={2172}
              height={724}
              priority
            />
            <p className="speakers-intro__script script">
              Ideas<br />
              People<br />
              <span className="script--highlight">Progress</span>
            </p>
          </div>
        </div>
      </section>

      {/* Speaker grid */}
      <section className="speakers-grid-section" aria-label="Speaker line-up">
        <div className="container">
          <ul className="speakers-grid">
            {speakers.map((speaker, index) => (
              <li key={index} className="speaker-card">
                <div className="speaker-card__media">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    width={618}
                    height={318}
                  />
                  <span className={`speaker-badge ${speaker.badgeClass}`}>
                    {speaker.badge}
                  </span>
                </div>
                <div className="speaker-card__body">
                  <h2 className="speaker-card__name">{speaker.name}</h2>
                  <p className="speaker-card__role" style={{ whiteSpace: "pre-line" }}>
                    {speaker.role}
                  </p>
                  <span className={`speaker-card__rule speaker-card__rule--${speaker.ruleClass}`}></span>
                  <p className="speaker-card__session">{speaker.session}</p>
                </div>
              </li>
            ))}
            {Array.from({ length: 3 }, (_, index) => (
              <UpcomingSpeakerCard key={`upcoming-speaker-${index + 1}`} />
            ))}
          </ul>

          <p className="speakers-grid__note">More speakers to be announced soon.</p>
        </div>
      </section>
    </main>
  );
}
