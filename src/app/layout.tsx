import "./globals.css";
import "./styles.css";
import "./motion.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Script from "next/script";
import MotionHandler from "@/components/MotionHandler";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import {
  DEFAULT_OG_IMAGE,
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: "The Infinite Community",
  publisher: "The Infinite Community",
  keywords: [
    "TechForge 2026",
    "technology conference Lagos",
    "tech conference Nigeria",
    "African technology conference",
    "startup conference Nigeria",
    "software engineering conference Lagos",
  ],
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    locale: "en_NG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${plusJakartaSans.variable}`}
    >
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
