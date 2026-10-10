'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const navToggleRef = useRef<HTMLButtonElement>(null);

  const closeNavbar = () => {
    setNavOpen(false);
  };

  return (
    <header className="site-header" onKeyDown={event => {
      if (event.key === 'Escape' && navOpen) {
        setNavOpen(false);
        navToggleRef.current?.focus();
      }
    }}>
      <input
        type="checkbox"
        id="nav-toggle"
        className="nav-checkbox"
        aria-hidden="true"
        tabIndex={-1}
        checked={navOpen}
        readOnly
      />
      <div className="container site-header__inner">
        <Link className="logo js-nav-item" href="/">
          <Image
            className="logo__img logo__img--header"
            src="/assets/techforge-logo.png"
            alt="Tech Forge"
            width={1291}
            height={781}
            priority
          />
        </Link>

        <nav id="primary-navigation" className="nav js-stagger js-stagger--tight" aria-label="Primary">
          <Link 
            href="/" 
            aria-current={pathname === '/' ? 'page' : undefined}
            onClick={closeNavbar}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            aria-current={pathname === '/about' ? 'page' : undefined}
            onClick={closeNavbar}
          >
            About
          </Link>
          <Link 
            href="/pre-tech-forge" 
            aria-current={pathname === '/pre-tech-forge' ? 'page' : undefined}
            onClick={closeNavbar}
          >
            Pre-TechForge
          </Link>
          <Link 
            href="/editions" 
            aria-current={pathname === '/editions' ? 'page' : undefined}
            onClick={closeNavbar}
          >
            Editions
          </Link>
          <Link 
            href="/speakers" 
            aria-current={pathname === '/speakers' ? 'page' : undefined}
            onClick={closeNavbar}
          >
            Speakers
          </Link>
          <Link 
            href="/contact" 
            aria-current={pathname === '/contact' ? 'page' : undefined}
            onClick={closeNavbar}
          >
            Contact
          </Link>
          <Link href="/questions" aria-current={pathname.startsWith("/questions") ? "page" : undefined} onClick={closeNavbar}>Questions</Link>
          <Link href="/game" aria-current={pathname === '/game' ? 'page' : undefined} onClick={closeNavbar}>Spin & Win</Link>
        </nav>

        <Link className="btn btn--primary header-cta js-nav-item" target='_blank' href="https://tix.africa/discover/the-tech-forge">
          Get Your Ticket <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>

        <button
          ref={navToggleRef}
          type="button"
          className="nav-toggle"
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          onClick={() => setNavOpen(open => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
