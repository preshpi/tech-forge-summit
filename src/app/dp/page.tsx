import type { Metadata } from "next";
import PlateStudio from "@/components/PlateStudio";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Create Your Tech Forge 2026 DP",
  description:
    "Make your attendee plate for The TechForge 2026: your portrait, your name, and the summit's own type and blue. Renders in your browser and downloads at 1024 × 1024.",
  path: "/dp",
});

export default function DpPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PlateStudio />
    </main>
  );
}
