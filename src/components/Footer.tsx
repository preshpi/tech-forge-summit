"use client";

import { Link2, Mail } from "lucide-react";

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
  return (
    <footer className="border-t border-line mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid md:grid-cols-[1.2fr_1fr_1fr] gap-12">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal" />
            The TechForge
          </div>
          <p className="mt-4 text-sm text-paper/50 max-w-xs leading-relaxed">
            Sign up to stay informed about The TechForge 2027 and future builder events.
          </p>
          <form className="mt-4 flex gap-2 max-w-xs" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 min-w-0 rounded-full bg-ink-soft border border-line px-4 py-2 text-sm placeholder:text-paper/30 focus:outline-none focus:border-signal/50"
            />
            <button className="rounded-full bg-signal text-ink px-4 py-2 text-sm font-semibold shrink-0">
              Join
            </button>
          </form>
          <div className="flex gap-4 mt-6 text-paper/40">
            <Link2 className="h-4 w-4 hover:text-signal transition-colors" />
            <Mail className="h-4 w-4 hover:text-signal transition-colors" />
          </div>
        </div>

        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-4">
            Site map
          </div>
          <ul className="space-y-3 text-sm text-paper/60">
            {sitemap.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hover:text-paper transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-4">
            Legal
          </div>
          <ul className="space-y-3 text-sm text-paper/60">
            {legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-paper transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-2 text-xs text-paper/30 font-mono">
          <span>© 2027 The TechForge. All rights reserved.</span>
          <a href="#top" className="hover:text-paper transition-colors">
            Scroll to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
