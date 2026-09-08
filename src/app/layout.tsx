import './globals.css';
import './styles.css';
import './motion.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';
import Script from 'next/script';
import MotionHandler from "@/components/MotionHandler";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tech Forge 2026 — The Builders' Blueprint",
  description: "Tech Forge brings together builders across Africa for a full day of skills, strategy and innovation. December 5, 2026 · Lagos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${caveat.variable} ${plusJakartaSans.variable}`}>
      <head>
        <Script
          id="motion-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    document.documentElement.classList.add("motion-on");
                    window.setTimeout(function () {
                      if (!window.__tfMotionBooted) {
                        document.documentElement.classList.remove("motion-on");
                      }
                    }, 1600);
                  } else {
                    document.documentElement.classList.add("motion-reduce");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <MotionHandler />
        <Navbar />
        {children}
        <Footer />
        <Script src="/home-motion.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}