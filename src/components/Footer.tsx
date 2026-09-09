import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer" id="partners">
      <div className="container site-footer__grid" id="faq">
        <div className="footer-brand">
          <span className="footer-brand__mark" aria-hidden="true">
            <svg viewBox="0 0 56 40" fill="none">
              <circle cx="20" cy="8" r="3.2" fill="currentColor" />
              <circle cx="28" cy="5.5" r="3.2" fill="currentColor" />
              <circle cx="36" cy="8" r="3.2" fill="currentColor" />
              <path
                d="M18 28c-6.5 0-10-4.2-10-9s3.5-9 10-9c3.2 0 5.6 1.1 8 3.4C28.4 11.1 30.8 10 34 10c6.5 0 10 4.2 10 9s-3.5 9-10 9c-3.2 0-5.6-1.1-8-3.4C23.6 26.9 21.2 28 18 28Z"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="footer-brand__text">
            <p className="footer-brand__sub">The Infinite Community</p>
            <p className="footer-brand__tag">Build. Connect. Belong.</p>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/editions">Editions</Link>
          <Link href="/speakers">Speakers</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="footer-social" aria-label="Social links">
          <a href="https://www.instagram.com/theinfinitecommunity" aria-label="Instagram" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle
                cx="12"
                cy="12"
                r="4.2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/the.infinite.comm" aria-label="Tiktok" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor"
              >
                <path d="M0 0h640v640H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M544.5 273.9c-44 .1-87-13.6-122.8-39.2v178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6s-64.8 13.5-96.9 5.3s-60.9-25.9-82.7-50.8s-35.3-56-39-88.9s2.9-66.1 18.6-95.2s40-52.7 69.6-67.7s62.9-20.5 95.7-16v89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3s-14 28.1-13.9 43.9s5.2 31 14.5 43.7s22.4 22.1 37.4 26.9s31.1 4.8 46-.1s28-14.4 37.2-27.1s14.2-28.1 14.2-43.8V64h88c-.1 7.4.6 14.9 1.9 22.2c3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1V274z"
                />
              </svg>
            </svg>
          </a>
          {/* <a href="#" aria-label="LinkedIn" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M6.4 9.2H3.8V20h2.6V9.2ZM5.1 4c-.9 0-1.6.7-1.6 1.6S4.2 7.2 5.1 7.2s1.6-.7 1.6-1.6S6 4 5.1 4ZM20.2 12.3c0-2.5-1.6-3.6-3.3-3.6-1.2 0-2 .5-2.5 1.3h-.1V9.2h-2.5c0 .6 0 10.8 0 10.8h2.5v-6c0-.3 0-.6.1-.8.3-.6.9-1.2 1.9-1.2 1.3 0 1.9.9 1.9 2.3V20h2.5v-7.7Z"
              />
            </svg>
          </a> */}
          {/* <a href="#" aria-label="YouTube" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M21.5 8.2a3 3 0 0 0-2.1-2.1C17.6 5.6 12 5.6 12 5.6s-5.6 0-7.4.5A3 3 0 0 0 2.5 8.2 31.4 31.4 0 0 0 2 12a31.4 31.4 0 0 0 .5 3.8 3 3 0 0 0 2.1 2.1c1.8.5 7.4.5 7.4.5s5.6 0 7.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 22 12a31.4 31.4 0 0 0-.5-3.8ZM10.2 14.9V9.1L15.2 12l-5 2.9Z"
              />
            </svg>
          </a> */}
        </div>

        <p className="footer-closing">A stronger tech ecosystem for Africa.</p>
      </div>
    </footer>
  );
}
