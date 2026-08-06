"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Grid2x2 } from "lucide-react";

const links = [
  { label: "Speakers", href: "#speakers" },
  { label: "Agenda", href: "#agenda" },
  { label: "Venue", href: "#venue" },
  { label: "Contact", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/80 backdrop-blur border-b border-line" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-lg bg-paper/10 flex items-center justify-center">
            <Grid2x2 className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="font-display font-bold text-xl tracking-tight">The TechForge</span>
        </a>

        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-paper/90">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-signal transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ticket-switcher">
              <a
                href="/checkout?tier=general"
                style={{backgroundColor: "white"}}
                className="ticket-switch-button ticket-switch-primary"
              >
                <span className="ticket-switch-text">Get ticket</span>
                <ArrowUpRight className="ticket-switch-symbol h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/checkout?tier=general"
                aria-label="Get ticket"
                style={{backgroundColor: "white"}}
                className="ticket-switch-button ticket-switch-secondary"
              >
                <ArrowUpRight className="ticket-switch-symbol h-4 w-4" aria-hidden="true" />
                <span className="ticket-switch-text" aria-hidden="true">
                  Get ticket
                </span>
              </a>
            </div>
      </div>
    </header>
  );
}
