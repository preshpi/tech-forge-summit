"use client";

import type { PointerEvent } from "react";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Link2, Mail } from "lucide-react";
import Countdown from "./Countdown";
import Logo from "./Logo";

const sitemap = [
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Agenda", href: "#agenda" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faq" },
];

const legal = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;

    const footer = footerRef.current;
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    footer.style.setProperty(
      "--footer-pointer-x",
      `${event.clientX - rect.left}px`,
    );
    footer.style.setProperty(
      "--footer-pointer-y",
      `${event.clientY - rect.top}px`,
    );
    footer.style.setProperty("--footer-spotlight-size", "160px");
    footer.style.setProperty("--footer-light-opacity", "1");
  }

  function handlePointerLeave() {
    const footer = footerRef.current;
    if (!footer) return;

    footer.style.setProperty("--footer-spotlight-size", "0px");
    footer.style.setProperty("--footer-light-opacity", "0");
  }

  return (
    <footer
      ref={footerRef}
      className="techforge-footer relative isolate mt-auto flex min-h-[90svh] flex-col overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Image
        src="/tf11.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover object-[62%_center] md:object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-20 bg-black/55" />
      <div className="footer-glass-layer absolute inset-0 -z-10" />
      <div className="footer-pointer-light pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 md:py-14">
        <div className="flex flex-col gap-12 md:gap-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-7 pb-6 font-mono text-[10px] uppercase tracking-wider text-paper/75 md:gap-10 md:pb-8 md:text-[11px]">
            <div>
              <p className="mb-2 text-paper/40">Date &amp; time</p>
              <p>December 5, 2026</p>
              <Countdown className="mt-1 block text-signal" />
            </div>

            <div>
              <p className="mb-2 text-paper/40">Location</p>
              <p>Downtown</p>
              <p className="mt-1 text-signal">Lagos, Nigeria</p>
            </div>

            <a
              href="#top"
              className="inline-flex h-fit items-center gap-2 justify-self-start text-paper transition-colors hover:text-signal md:justify-self-end"
            >
              Scroll to top
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="max-w-3xl">
            <h2 className="font-display text-[36px] font-bold leading-[1.04] tracking-tight text-paper sm:text-[48px] md:text-[64px] md:leading-[1.02] lg:text-[76px]">
              Let&apos;s make an impact together
            </h2>

            <div className="mt-6 ticket-switcher md:mt-8">
              <Link
                href="/checkout?tier=general"
                transitionTypes={["nav-forward"]}
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
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-0">
          <div className="flex flex-col gap-2 font-display text-lg font-bold md:mt-20">
            <Logo className="self-start" imgClassName="h-9 w-auto" />
            <div className="mt-2 flex gap-4 text-paper/55">
              <Link2 className="h-5 w-5 transition-colors hover:text-signal" />
              <Mail className="h-5 w-5 transition-colors hover:text-signal" />
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 items-start gap-10 py-0 md:grid-cols-[minmax(0,1.55fr)_minmax(10rem,0.55fr)_minmax(10rem,0.55fr)] md:gap-10 md:py-14 lg:py-20">
            <div>
              <div className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-paper/45">
                Site map
              </div>
              <ul className="space-y-3 font-display text-xl font-bold leading-tight text-paper/80 sm:text-2xl md:text-3xl">
                {sitemap.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="hover:text-paper transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-paper/45">
                Legal
              </div>
              <ul className="space-y-3 font-display text-xl font-bold leading-tight text-paper/80 sm:text-2xl md:text-3xl">
                {legal.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="transition-colors hover:text-paper"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-5 font-mono text-[10px] text-paper/40 sm:px-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:py-6 md:text-xs">
          <span>© 2026 The TechForge. All rights reserved.</span>
          <span>Built for the people building it.</span>
        </div>
      </div>
    </footer>
  );
}
