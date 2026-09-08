// import localFont from "next/font/local";
// import type { Metadata } from "next";
// import "./globals.css";
// import './styles.css';
// import './motion.css';
// import Navbar from "@/components/Navbar";


// const BDOGrotesk = localFont({
//   src: "../../public/font/BDOGrotesk-VF.ttf",
//   variable: "--font-bdo-grotesk",
// });

// export const metadata: Metadata = {
//   title: "The TechForge 2026 — The Builders Summit",
//   description:
//     "A one-day tech gathering in Lagos for people learning, building, and growing their careers in tech. December 5, 2026.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={`${BDOGrotesk.variable} ${BDOGrotesk.className} h-full antialiased`}>
//       <body className="min-h-full flex flex-col bg-[#0a0a0c] text-[#f2f2f0]">
//         <Navbar />
//         {children}
//       </body>
      
//     </html>
//   );
// }



import './globals.css';
import './styles.css';
import './motion.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';
import Script from 'next/script';
import MotionHandler from "@/components/MotionHandler";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
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