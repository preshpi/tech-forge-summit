import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVA 2027 — The Builders Summit",
  description:
    "A one-day gathering in Austin for founders, engineers, and researchers actually shipping AI products. March 12, 2027.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-[#f2f2f0]">
        {children}
      </body>
    </html>
  );
}
