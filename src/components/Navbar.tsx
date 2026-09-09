'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <input
        type="checkbox"
        id="nav-toggle"
        className="nav-checkbox"
        aria-hidden="true"
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

        <nav className="nav js-stagger js-stagger--tight" aria-label="Primary">
          <Link 
            href="/" 
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            About
          </Link>
          <Link 
            href="/editions" 
            aria-current={pathname === '/editions' ? 'page' : undefined}
          >
            Editions
          </Link>
          <Link 
            href="/speakers" 
            aria-current={pathname === '/speakers' ? 'page' : undefined}
          >
            Speakers
          </Link>
          <Link 
            href="/contact" 
            aria-current={pathname === '/contact' ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        <Link className="btn btn--primary header-cta js-nav-item" target='_blank' href="https://tix.africa/discover/the-tech-forge">
          Get Your Ticket <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>

        <label
          className="nav-toggle"
          htmlFor="nav-toggle"
          aria-label="Open navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
    </header>
  );
}