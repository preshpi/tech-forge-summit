import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Armchair, CalendarPlus, Crown, Handshake, MapPin, UtensilsCrossed } from "lucide-react";
import { VipCountdown, VipReveal, VipTilt } from "@/components/VipClient";
import { formatDate } from "@/lib/preTechForge";
import { createPageMetadata } from "@/lib/site";
import { getVipInvite, getVipInvites, VIP_EVENT, VIP_PERKS } from "@/lib/vipInvites";

type Props = { params: Promise<{ code: string }> };

export function generateStaticParams() {
  return getVipInvites().map(({ code }) => ({ code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const invite = getVipInvite((await params).code);
  if (!invite) return { title: "Invite not found", robots: { index: false, follow: false } };
  const base = createPageMetadata({
    title: `Welcome, ${invite.greetAs}`,
    description: `${invite.session.speaker.name}, you're invited as a VIP guest to ${VIP_EVENT.name} on December 5, 2026 at The Zone, Lagos.`,
    path: `/vip/${invite.code}`,
    noIndex: true,
  });
  // Drop the site-wide share image so this page's own opengraph-image is used.
  return {
    ...base,
    openGraph: { ...base.openGraph, images: undefined },
    twitter: { ...base.twitter, images: undefined },
  };
}

const SPARKLE = "M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z";
const PERK_ICONS = { seat: Armchair, lunch: UtensilsCrossed, network: Handshake } as const;

function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d={SPARKLE} />
    </svg>
  );
}

export default async function VipPage({ params }: Props) {
  const invite = getVipInvite((await params).code);
  if (!invite) notFound();
  const { session, greetAs } = invite;
  const { speaker } = session;
  const roleLine = [speaker.role, speaker.company].filter(Boolean).join(", ");

  return (
    <main className="vip" id="top">
      <VipReveal />

      {/* Welcome */}
      <section className="vip-hero" aria-labelledby="vip-title">
        <div className="vip-hero__shapes" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="container vip-hero__grid">
          <div className="vip-hero__copy">
            <p className="section-label vip-eyebrow vip-in" style={{ "--d": 0 } as React.CSSProperties}>
              <Crown size={15} strokeWidth={2.2} aria-hidden="true" />
              VIP Invitation
            </p>
            <h1 className="heading-xl vip-title" id="vip-title">
              <span className="vip-line" style={{ "--d": 1 } as React.CSSProperties}>
                <span>Welcome to</span>
              </span>
              <span className="vip-line" style={{ "--d": 2 } as React.CSSProperties}>
                <span>The TechForge 2.0,</span>
              </span>
              <span className="vip-line" style={{ "--d": 3 } as React.CSSProperties}>
                <span className="text-blue">{greetAs}.</span>
              </span>
            </h1>
            <p className="lede vip-in" style={{ "--d": 4 } as React.CSSProperties}>
              You opened the conversation at Pre-TechForge. On December 5, we’d love to have you in the room as our VIP
              guest.
            </p>

            <div className="event-meta vip-meta vip-in" style={{ "--d": 5 } as React.CSSProperties}>
              <div className="event-meta__col">
                <CalendarPlus className="event-meta__icon" aria-hidden="true" />
                <div className="event-meta__text">
                  <p className="event-meta__primary">{VIP_EVENT.dateLabel}</p>
                  <p className="event-meta__secondary">{VIP_EVENT.timeLabel}</p>
                </div>
              </div>
              <div className="event-meta__col">
                <MapPin className="event-meta__icon" aria-hidden="true" />
                <div className="event-meta__text">
                  <p className="event-meta__primary">{VIP_EVENT.venue}</p>
                  <p className="event-meta__secondary">{VIP_EVENT.address}</p>
                </div>
              </div>
            </div>

            <div className="btn-row vip-in" style={{ "--d": 6 } as React.CSSProperties}>
              <a className="btn btn--primary" href="/api/calendar">
                Add to calendar <span aria-hidden="true">→</span>
              </a>
              <a className="btn btn--outline" href={VIP_EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">
                Get directions
              </a>
            </div>
            <p className="script vip-script vip-in" style={{ "--d": 7 } as React.CSSProperties}>
              <span className="script--highlight">See you in the room.</span>
            </p>
          </div>

          <div className="vip-stage">
            <VipTilt className="vip-tilt">
              <figure className="vip-portrait">
                <div className="vip-portrait__frame">
                  {/* Speaker photos are local files with mixed sizes and formats. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={speaker.image} alt={speaker.name} width={520} height={620} fetchPriority="high" />
                  <span className="vip-portrait__sheen" aria-hidden="true" />
                  <span className="vip-portrait__glare" aria-hidden="true" />
                </div>
                <figcaption className="vip-portrait__caption">
                  <span className="vip-portrait__name">{speaker.name}</span>
                  <span className="vip-portrait__role">{roleLine}</span>
                </figcaption>
              </figure>

              <div className="vip-note" aria-hidden="true">
                <span>VIP</span>
                <span>Guest</span>
                <span className="vip-note__rule" />
                <small>Pre-TechForge speaker</small>
              </div>

              <svg className="vip-seal" viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <path id="vip-seal-path" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
                </defs>
                <circle cx="60" cy="60" r="58" className="vip-seal__disc" />
                <g className="vip-seal__ring">
                  <text>
                    {/* textLength = the circle's circumference (2π × 44), so the phrase meets itself evenly */}
                    <textPath href="#vip-seal-path" textLength="276" lengthAdjust="spacing">
                      VIP GUEST • THE TECHFORGE 2.0 • DEC 5 2026 •{" "}
                    </textPath>
                  </text>
                </g>
                <path d={SPARKLE} transform="translate(44 44) scale(.32)" className="vip-seal__star" />
              </svg>
            </VipTilt>

            <Sparkle className="vip-sparkle vip-sparkle--pink" />
            <Sparkle className="vip-sparkle vip-sparkle--yellow" />
            <Sparkle className="vip-sparkle vip-sparkle--ink" />
            <Sparkle className="vip-sparkle vip-sparkle--blue" />
          </div>
        </div>
      </section>

      {/* Thank-you note */}
      <section className="vip-story" aria-labelledby="vip-story-title">
        <div className="container">
          <article className="vip-letter vip-reveal">
            <p className="section-label">Where it started</p>
            <h2 className="heading-md" id="vip-story-title">
              Thank you for opening the conversation.
            </h2>
            <blockquote className="vip-letter__session">
              <span className="vip-letter__mark" aria-hidden="true">
                “
              </span>
              <p>{session.title.trim()}</p>
            </blockquote>
            <p className="vip-letter__meta">
              Pre-TechForge · {formatDate(session.date)} · Online
            </p>
            <p className="body-text">
              Your session set the tone for what we’re building on December 5. Before the main stage lights up, we wanted
              to say it properly: thank you. Come as our guest, and let’s keep the conversation going in person.
            </p>
            <p className="script vip-letter__sign">With gratitude, the TechForge team</p>
          </article>
        </div>
      </section>

      {/* VIP access */}
      <section className="vip-perks" aria-labelledby="vip-perks-title">
        <div className="vip-perks__glow" aria-hidden="true" />
        <div className="container">
          <div className="vip-perks__head vip-reveal">
            <p className="section-label">Your VIP access</p>
            <h2 className="heading-lg" id="vip-perks-title">
              Everything’s ready for you.
            </h2>
          </div>
          <ul className="vip-perks__grid">
            {VIP_PERKS.map((perk, index) => {
              const Icon = PERK_ICONS[perk.id];
              return (
                <li className="vip-perk vip-reveal" key={perk.id} style={{ "--i": index } as React.CSSProperties}>
                  <span className="vip-perk__icon">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="vip-perk__time">{perk.time}</span>
                  <h3>{perk.title}</h3>
                  <p>{perk.detail}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Countdown and the day */}
      <section className="vip-day" aria-labelledby="vip-day-title">
        <div className="container vip-day__inner vip-reveal">
          <p className="section-label">The countdown</p>
          <h2 className="heading-md" id="vip-day-title">
            December 5 at The Zone, Lagos.
          </h2>
          <VipCountdown start={VIP_EVENT.start} />
          <div className="btn-row vip-day__actions">
            <a className="btn btn--primary" href="/api/calendar">
              Add to calendar <span aria-hidden="true">→</span>
            </a>
            <a className="btn btn--outline" href={VIP_EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </div>
          <p className="vip-day__help">
            Questions before the day? <Link href="/contact">Get in touch</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
