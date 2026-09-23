import Link from "next/link";
import { currentYear, formatDate, formatTime, getUpcoming, type PreTechForgeSession } from "@/lib/preTechForge";

function roleLine(session: PreTechForgeSession) {
  return [session.speaker.role, session.speaker.company].filter(Boolean).join(", ");
}

function SessionMedia({ session, className }: { session: PreTechForgeSession; className: string }) {
  const badge = <span className="speaker-badge speaker-badge--online">Online session</span>;
  return session.speaker.image ? (
    <div className={className}>
      {/* Preserve the supplied image treatment, including external speaker images. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={session.speaker.image} alt={session.speaker.name} width={400} height={400} loading="lazy" />
      {badge}
    </div>
  ) : <div className={`${className} ptf-media--empty`} role="img" aria-label={session.speaker.name}>{badge}</div>;
}

function SessionCta({ session }: { session: PreTechForgeSession }) {
  if (session.status === "upcoming" && session.registrationUrl) {
    const external = session.registrationUrl.startsWith("http");
    return <a className="btn btn--primary ptf-card__cta" href={session.registrationUrl} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>Add to Calendar →</a>;
  }
  if (session.status === "completed" && session.recordingUrl) {
    return <a className="btn btn--outline ptf-card__cta" href={session.recordingUrl} target="_blank" rel="noopener noreferrer">Watch Session →</a>;
  }
  return null;
}

export function PreTechForgeHome() {
  const upcoming = getUpcoming(currentYear, 2);
  return (
    <section className="ptf-home section js-reveal" id="pre-tech-forge" aria-labelledby="ptf-home-heading">
      <div id="ptf-home">
        <div className="container ptf-home__grid">
          <div className="ptf-home__copy">
            <p className="section-label">Pre-Tech Forge</p>
            <h2 className="heading-md" id="ptf-home-heading">The conversations start before December 5.</h2>
            <p className="body-text">Join our online sessions with builders and industry experts in the lead-up to Tech Forge 2026.</p>
            <p className="ptf-meta">Online · Google Meet</p>
            <Link className="btn btn--outline" href="/pre-tech-forge">Explore Pre-Tech Forge →</Link>
          </div>
          {upcoming.length > 0 && <div className="ptf-home__previews">
            {upcoming.map((session) => <article key={session.id} className={`ptf-preview${session.isPlaceholder ? " ptf-preview--placeholder" : ""}`}>
              <SessionMedia session={session} className="ptf-preview__media" />
              <div className="ptf-preview__body">
                <p className="ptf-preview__name">{session.speaker.name}</p>
                <p className="ptf-preview__role">{roleLine(session)}</p>
                <h3 className="ptf-preview__title">{session.title}</h3>
                <p className="ptf-preview__meta">{formatDate(session.date)} · {formatTime(session)}</p>
                <p className="ptf-preview__platform">Online · {session.platform || "Google Meet"}</p>
                <SessionCta session={session} />
              </div>
            </article>)}
          </div>}
        </div>
      </div>
    </section>
  );
}

export function SessionRow({ session }: { session: PreTechForgeSession }) {
  return <article className={`ptf-session${session.isPlaceholder ? " ptf-session--placeholder" : ""}`}>
    <SessionMedia session={session} className="ptf-session__media" />
    <div className="ptf-session__copy">
      <p className="ptf-session__speaker">{session.speaker.name}</p>
      <p className="ptf-session__role">{roleLine(session)}</p>
      <h3 className="ptf-session__title">{session.title}</h3>
      {session.description && <p className="ptf-session__desc">{session.description}</p>}
      <div className="ptf-session__meta">
        <span>{formatDate(session.date)}</span><span>{formatTime(session)}</span><span>Online · {session.platform || "Google Meet"}</span>
      </div>
      <SessionCta session={session} />
    </div>
  </article>;
}

export function PastSessionRow({ session }: { session: PreTechForgeSession }) {
  return <article className={`ptf-past${session.isPlaceholder ? " ptf-past--placeholder" : ""}`}>
    <div className="ptf-past__main">
      <p className="ptf-past__speaker">{session.speaker.name}</p>
      <h3 className="ptf-past__title">{session.title}</h3>
      <p className="ptf-past__date">{formatDate(session.date)}</p>
    </div>
    {session.recordingUrl && <div className="ptf-past__action"><a className="link-arrow" href={session.recordingUrl} target="_blank" rel="noopener noreferrer">Watch Session <span className="link-arrow__glyph" aria-hidden="true">→</span></a></div>}
  </article>;
}
