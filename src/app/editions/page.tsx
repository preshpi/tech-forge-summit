'use client';

import { useEffect, useCallback } from 'react';
import Script from 'next/script';
import Image from 'next/image';

declare global {
  interface Window {
    TECHFORGE_ASSET_BASE?: string;
    TechForgeArchive?: {
      init: () => void;
    };
  }
}

export default function EditionsPage() {
  const triggerArchiveRender = useCallback(() => {
    window.TECHFORGE_ASSET_BASE = "/assets/";
    
    const renderEditions = () => {
      if (window.TechForgeArchive && typeof window.TechForgeArchive.init === 'function') {
        window.TechForgeArchive.init();
      } else {
        setTimeout(renderEditions, 50);
      }
    };

    renderEditions();
  }, []);

  useEffect(() => {
    triggerArchiveRender();
  }, [triggerArchiveRender]);

  return (
    <main id="top">
      {/* Load legacy scripts properly for Next.js SPA navigation */}
      <Script src="/editions-data.js" strategy="afterInteractive" />
      <Script 
        src="/editions-archive.js" 
        strategy="afterInteractive" 
        onLoad={triggerArchiveRender} 
      />

      <section className="page-intro" aria-labelledby="editions-heading">
        <div className="container page-intro__grid">
          <div className="page-intro__copy">
            <p className="eyebrow">
              <svg
                className="eyebrow__mark"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3 10h18M8 3v4M16 3v4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              Our Editions
            </p>
            <h1 className="heading-lg page-intro__title" id="editions-heading">
              A growing movement of{' '}
              <span className="text-blue">African builders.</span>
            </h1>
            <p className="page-intro__lede">
              From our first gathering to what’s next, each edition of Tech Forge
              has brought together an incredible community of builders, learners
              and leaders shaping the future of Africa’s tech ecosystem.
            </p>
          </div>

          <div className="page-intro__visual" aria-hidden="true">
            <span className="page-intro__star"></span>
            <span className="page-intro__sun"></span>
            <span className="page-intro__wedge"></span>
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

      <section
        className="editions-list section--compact"
        aria-label="Tech Forge editions"
      >
        <div className="container" id="editions-list">
          {/* Legacy script will dynamically inject the edition rows here */}
        </div>
      </section>
    </main>
  );
}