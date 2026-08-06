import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";


const BDOGrotesk = localFont({
  src: "../../public/font/BDOGrotesk-VF.ttf",
  variable: "--font-bdo-grotesk",
});

export const metadata: Metadata = {
  title: "The TechForge 2027 — The Builders Summit",
  description:
    "A one-day gathering in Austin for founders, engineers, and researchers actually shipping AI products. March 12, 2027.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${BDOGrotesk.variable} ${BDOGrotesk.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-[#f2f2f0]">
        {children}
      </body>
      
    </html>
  );
}
