'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MotionHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Ensure motion class is active
    try {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('motion-on');
        document.documentElement.classList.add('is-ready');
      } else {
        document.documentElement.classList.add('motion-reduce');
      }
    } catch {
      // Ignored
    }

    // 2. Re-run intersection observer bindings on route change
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    });

    const revealElements = document.querySelectorAll(
      '.js-reveal, .js-hero-item, .js-nav-item, .js-stagger, .about__heading, .community__copy, .page-intro'
    );

    revealElements.forEach((el) => observer.observe(el));

    // Force fallback: if elements don't intersect immediately, make sure they are visible after a short tick
    const timer = setTimeout(() => {
      revealElements.forEach((el) => {
        el.classList.add('is-in');
      });
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}