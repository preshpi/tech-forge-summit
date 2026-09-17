import Link from "next/link";
import { PastSessionRow, SessionRow } from "@/components/PreTechForge";
import { getPast, getUpcoming } from "@/lib/preTechForge";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Pre-Tech Forge — Tech Forge 2026",
  description: "Pre-Tech Forge is a series of online conversations with builders and industry experts leading up to Tech Forge 2026.",
  path: "/pre-tech-forge",
});

export default function PreTechForgePage() {
  const upcoming = getUpcoming();
  const past = getPast();
  return <main id="top">
    <section className="ptf-hero" aria-labelledby="ptf-heading">
      <div className="container ptf-hero__inner">
        <p className="section-label">Pre-Tech Forge</p>
        <h1 className="heading-md" id="ptf-heading">The conversations start before the conference.</h1>
        <p className="body-text ptf-hero__lede">A series of online conversations with builders and industry experts leading up to Tech Forge 2026.</p>
        <p className="ptf-meta">Online · Google Meet</p>
        <div className="ptf-hero__actions">
          <a className="btn btn--primary" href="#upcoming">View Upcoming Sessions ↓</a>
          <Link className="btn btn--outline" href="https://tix.africa/discover/the-tech-forge">Get Your Tech Forge Ticket →</Link>
        </div>
      </div>
    </section>
    <section className="ptf-list section" id="upcoming" aria-labelledby="ptf-upcoming-heading">
      <div className="container">
        <div className="ptf-list__head"><h2 className="heading-md" id="ptf-upcoming-heading">Upcoming Sessions</h2></div>
        <div className="ptf-list__items" id="ptf-upcoming">
          {upcoming.length ? upcoming.map((session) => <SessionRow session={session} key={session.id} />) : <p className="body-text">Upcoming sessions will be announced soon.</p>}
        </div>
      </div>
    </section>
    <section className="ptf-list ptf-list--past section" id="past" aria-labelledby="ptf-past-heading">
      <div className="container">
        <div className="ptf-list__head">
          <h2 className="heading-md" id="ptf-past-heading">Past Sessions</h2>
          <p className="body-text">Completed sessions stay here as part of the Tech Forge archive.</p>
        </div>
        <div className="ptf-list__past" id="ptf-past">
          {past.length ? past.map((session) => <PastSessionRow session={session} key={session.id} />) : <p className="body-text">Past sessions will appear here after they go live.</p>}
        </div>
      </div>
    </section>
  </main>;
}
