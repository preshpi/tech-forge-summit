import ContactClient from "./ContactClient";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Tech Forge about partnerships, speaking, media, volunteering and general enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactClient />;
}
