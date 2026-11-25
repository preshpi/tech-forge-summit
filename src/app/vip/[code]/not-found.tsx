import Link from "next/link";

export default function VipNotFound() {
  return (
    <main className="vip vip-missing">
      <div className="container vip-missing__inner">
        <p className="section-label">VIP Invitation</p>
        <h1 className="heading-lg">We couldn’t find this invite.</h1>
        <p className="body-text">
          The link may be incomplete. Try scanning the QR code on your card again, or get in touch and we’ll sort it out.
        </p>
        <div className="btn-row">
          <Link className="btn btn--primary" href="/contact">
            Contact us <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn btn--outline" href="/">
            Visit TechForge
          </Link>
        </div>
      </div>
    </main>
  );
}
