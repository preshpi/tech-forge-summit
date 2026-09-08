// "use client";

// import type { PointerEvent } from "react";
// import { useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowUp, ArrowUpRight, 
//   Mail } from "lucide-react";
// import { FaInstagram } from "react-icons/fa";
// import Countdown from "./Countdown";
// import Logo from "./Logo";

// const sitemap = [
//   { label: "About", href: "/#about" },
//   { label: "Speakers", href: "/speakers" },
//   // { label: "Agenda", href: "/#agenda" },
//   { label: "Gallery", href: "/gallery" },
//   { label: "Pricing", href: "/#pricing" },
//   { label: "FAQs", href: "/#faq" },
// ];

// const legal = [
//   { label: "Privacy Policy", href: "#" },
//   { label: "Terms", href: "#" },
// ];

// export default function Footer() {
//   const footerRef = useRef<HTMLElement>(null);

//   function handlePointerMove(event: PointerEvent<HTMLElement>) {
//     if (event.pointerType !== "mouse") return;

//     const footer = footerRef.current;
//     if (!footer) return;

//     const rect = footer.getBoundingClientRect();
//     footer.style.setProperty(
//       "--footer-pointer-x",
//       `${event.clientX - rect.left}px`,
//     );
//     footer.style.setProperty(
//       "--footer-pointer-y",
//       `${event.clientY - rect.top}px`,
//     );
//     footer.style.setProperty("--footer-spotlight-size", "160px");
//     footer.style.setProperty("--footer-light-opacity", "1");
//   }

//   function handlePointerLeave() {
//     const footer = footerRef.current;
//     if (!footer) return;

//     footer.style.setProperty("--footer-spotlight-size", "0px");
//     footer.style.setProperty("--footer-light-opacity", "0");
//   }

//   return (
//     <footer
//       ref={footerRef}
//       className="techforge-footer relative isolate mt-auto flex min-h-[90svh] flex-col overflow-hidden"
//       onPointerMove={handlePointerMove}
//       onPointerLeave={handlePointerLeave}
//     >
//       <Image
//         src="/tf11.jpg"
//         alt=""
//         fill
//         sizes="100vw"
//         className="-z-30 object-cover object-[62%_center] md:object-center"
//         aria-hidden="true"
//       />
//       <div className="absolute inset-0 -z-20 bg-black/55" />
//       <div className="footer-glass-layer absolute inset-0 -z-10" />
//       <div className="footer-pointer-light pointer-events-none absolute inset-0 z-0" />

//       <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 md:py-14">
//         <div className="flex flex-col gap-12 md:gap-20">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-7 pb-6 font-mono text-[10px] uppercase tracking-wider text-paper/75 md:gap-10 md:pb-8 md:text-[11px]">
//             <div>
//               <p className="mb-2 text-paper/40">Date &amp; time</p>
//               <p>December 5, 2026</p>
//               <Countdown className="mt-1 block text-signal" />
//             </div>

//             <div>
//               <p className="mb-2 text-paper/40">Location</p>
//               <p>The Zone</p>
//               <p className="mt-1 text-signal">Lagos, Nigeria</p>
//             </div>

//             <a
//               href="#top"
//               className="inline-flex h-fit items-center gap-2 justify-self-start text-paper transition-colors hover:text-signal md:justify-self-end"
//             >
//               Scroll to top
//               <ArrowUp className="h-4 w-4" aria-hidden="true" />
//             </a>
//           </div>
//           <div className="max-w-3xl">
//             <h2 className="font-display text-[36px] font-bold leading-[1.04] tracking-tight text-paper sm:text-[48px] md:text-[64px] md:leading-[1.02] lg:text-[76px]">
//               Let&apos;s make an impact together
//             </h2>

//             <a
//               href="https://tix.africa/discover/the-tech-forge"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="mt-6 lg:mt-8 text-sm pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white p-3 pl-5 pr-2  font-semibold text-black transition-colors hover:bg-zinc-200"
//             >
//               <span>Get Your Ticket</span>
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
//                 <ArrowUpRight className="h-3.5 w-3.5" />
//               </div>
//             </a>
//           </div>
//         </div>

//         <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-0">
//           <div className="flex flex-col gap-2 font-display text-lg font-bold md:mt-20">
//             <Link
//               href="/"
//               transitionTypes={["nav-back"]}
//               aria-label="The TechForge — home"
//               className="self-start"
//             >
//               <Logo imgClassName="h-9 w-auto" />
//             </Link>
//             <div className="mt-2 flex gap-4 text-paper/55">
//               {/* <Link2 className="h-5 w-5 transition-colors hover:text-signal" /> */}
//               <a href="mailto:empress@techforgesummit.com">
//                 <Mail className="h-5 w-5 transition-colors hover:text-signal" />
//               </a>
//               <a href="https://www.instagram.com/theinfinitecommunity" target="_blank" rel="noopener noreferrer">
//                 <FaInstagram className="h-5 w-5 transition-colors hover:text-signal" />
//               </a>
//             </div>
//           </div>

//           <div className="grid flex-1 grid-cols-1 items-start gap-10 py-0 md:grid-cols-[minmax(0,1.55fr)_minmax(10rem,0.55fr)_minmax(10rem,0.55fr)] md:gap-10 md:py-14 lg:py-20">
//             <div>
//               <div className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-paper/45">
//                 Site map
//               </div>
//               <ul className="space-y-3 font-display text-xl font-bold leading-tight text-paper/80 sm:text-2xl md:text-3xl">
//                 {sitemap.map((s) => (
//                   <li key={s.label}>
//                     <a
//                       href={s.href}
//                       className="hover:text-paper transition-colors"
//                     >
//                       {s.label}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//            {/* <div>
//               <div className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-paper/45">
//                 Legal
//               </div>
//               <ul className="space-y-3 font-display text-xl font-bold leading-tight text-paper/80 sm:text-2xl md:text-3xl">
//                 {legal.map((l) => (
//                   <li key={l.label}>
//                     <a
//                       href={l.href}
//                       className="transition-colors hover:text-paper"
//                     >
//                       {l.label}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div> */}
//           </div>
//         </div>
//       </div>

//       <div className="relative z-10 border-t border-white/15">
//         <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-5 font-mono text-[10px] text-paper/40 sm:px-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:py-6 md:text-xs">
//           <span>© 2026 The TechForge. All rights reserved.</span>
//           <span>Built for the people building it.</span>
//         </div>
//       </div>
//     </footer>
//   );
// }



import Link from 'next/link';

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
          <Link href="/#faq">FAQ</Link>
        </nav>

        <div className="footer-social" aria-label="Social links">
          <a href="#" aria-label="Instagram" rel="noopener">
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
          <a href="#" aria-label="X" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M6 5.5h3.1l3.1 4.3L16.2 5.5H19l-4.7 6.1L19.2 18.5h-3.1l-3.4-4.7-3.8 4.7H5.8l5-6.3L6 5.5Z"
              />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M6.4 9.2H3.8V20h2.6V9.2ZM5.1 4c-.9 0-1.6.7-1.6 1.6S4.2 7.2 5.1 7.2s1.6-.7 1.6-1.6S6 4 5.1 4ZM20.2 12.3c0-2.5-1.6-3.6-3.3-3.6-1.2 0-2 .5-2.5 1.3h-.1V9.2h-2.5c0 .6 0 10.8 0 10.8h2.5v-6c0-.3 0-.6.1-.8.3-.6.9-1.2 1.9-1.2 1.3 0 1.9.9 1.9 2.3V20h2.5v-7.7Z"
              />
            </svg>
          </a>
          <a href="#" aria-label="YouTube" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M21.5 8.2a3 3 0 0 0-2.1-2.1C17.6 5.6 12 5.6 12 5.6s-5.6 0-7.4.5A3 3 0 0 0 2.5 8.2 31.4 31.4 0 0 0 2 12a31.4 31.4 0 0 0 .5 3.8 3 3 0 0 0 2.1 2.1c1.8.5 7.4.5 7.4.5s5.6 0 7.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 22 12a31.4 31.4 0 0 0-.5-3.8ZM10.2 14.9V9.1L15.2 12l-5 2.9Z"
              />
            </svg>
          </a>
        </div>

        <p className="footer-closing">A stronger tech ecosystem for Africa.</p>
      </div>
    </footer>
  );
}