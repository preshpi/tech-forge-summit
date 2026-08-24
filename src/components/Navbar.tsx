"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { label: "Speakers", href: "#speakers" },
  { label: "Agenda", href: "#agenda" },
  { label: "Venue", href: "#venue" },
  { label: "Get DP", href: "/dp" },
  { label: "Contact", href: "#faq" },
];

const isRoute = (href: string) => href.startsWith("/");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-ink/90 backdrop-blur"
          : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-6 flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
          aria-label="The TechForge — home"
        >
          <Logo imgClassName="h-8 w-auto sm:h-9" eager />
        </a>

        <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-paper/90 lg:gap-10">
          {links.map((l) =>
            isRoute(l.href) ? (
              <Link
                key={l.href}
                href={l.href}
                transitionTypes={["nav-forward"]}
                className="hover:text-signal transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="hover:text-signal transition-colors">
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden md:block">
          <div className="ticket-switcher">
            <Link
              href="/checkout?tier=general"
              transitionTypes={["nav-forward"]}
              style={{ backgroundColor: "white", color: "black" }}
              className="ticket-switch-button ticket-switch-primary"
            >
              <span className="ticket-switch-text">Get ticket</span>
              <ArrowUpRight
                className="ticket-switch-symbol h-4 w-4"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/checkout?tier=general"
              transitionTypes={["nav-forward"]}
              aria-label="Get ticket"
              style={{ backgroundColor: "white", color: "black" }}
              className="ticket-switch-button ticket-switch-secondary"
            >
              <ArrowUpRight
                className="ticket-switch-symbol h-4 w-4"
                aria-hidden="true"
              />
              <span className="ticket-switch-text" aria-hidden="true">
                Get ticket
              </span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-paper/15 bg-paper/10 text-paper md:hidden"
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-5rem)] overflow-y-auto border-b border-line bg-ink/95 px-6 py-8 backdrop-blur-xl md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col"
          >
            {links.map((link) =>
              isRoute(link.href) ? (
                <Link
                  key={link.href}
                  href={link.href}
                  transitionTypes={["nav-forward"]}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-paper/10 py-4 font-display text-3xl font-bold tracking-tight text-paper transition-colors hover:text-signal"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-paper/10 py-4 font-display text-3xl font-bold tracking-tight text-paper transition-colors hover:text-signal"
                >
                  {link.label}
                </a>
              )
            )}

            <Link
              href="/checkout?tier=general"
              transitionTypes={["nav-forward"]}
              onClick={() => setMenuOpen(false)}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-bold text-ink"
            >
              Get ticket
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
