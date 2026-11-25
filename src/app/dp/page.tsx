import type { Metadata } from "next";
import DpEditor from "@/components/DpEditor";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Make Your TechForge 2.0 DP",
  description:
    "Add your photo and name to make your attendee DP for The TechForge 2.0, Sat 5 December 2026 at The Zone, Lagos. Everything happens in your browser.",
  path: "/dp",
});

export default function DpPage() {
  return (
    <main className="flex flex-1 flex-col">
      <DpEditor />
    </main>
  );
}
