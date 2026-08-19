import type { Metadata } from "next";
import PlateStudio from "@/components/PlateStudio";

export const metadata: Metadata = {
  title: "Get your DP — The TechForge 2026",
  description:
    "Make your attendee plate for The TechForge 2026: your portrait, your name, and the summit's own type and blue. Renders in your browser and downloads at 1024 × 1024.",
};

export default function DpPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PlateStudio />
    </main>
  );
}
