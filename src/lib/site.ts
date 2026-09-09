import type { Metadata } from "next";

export const SITE_NAME = "Tech Forge";
export const SITE_URL = "https://www.techforgesummit.com";
export const HOME_TITLE = "Tech Forge 2026 — The Builders' Blueprint";
export const HOME_DESCRIPTION =
  "Tech Forge brings together builders across Africa for a full day of skills, strategy and innovation. December 5, 2026 · Lagos.";
export const TICKET_URL = "https://tix.africa/discover/the-tech-forge";

export const DEFAULT_OG_IMAGE = {
  url: "/og-tech-forge-2026.png",
  width: 1200,
  height: 630,
  alt: "Tech Forge 2026 — The Builders' Blueprint",
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [DEFAULT_OG_IMAGE],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": `${SITE_URL}/#tech-forge-2026`,
  name: "Tech Forge 2026 — The Builders' Blueprint",
  description: HOME_DESCRIPTION,
  startDate: "2026-12-05T09:00:00+01:00",
  endDate: "2026-12-05T17:00:00+01:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: SITE_URL,
  image: [`${SITE_URL}${DEFAULT_OG_IMAGE.url}`],
  location: {
    "@type": "Place",
    name: "The Zone",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Plot 9, Gbagada Industrial Scheme, beside UPS, Gbagada-Oworonshoki Expressway",
      addressLocality: "Lagos",
      addressRegion: "Lagos State",
      addressCountry: "NG",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "The Infinite Community",
    url: SITE_URL,
  },
  offers: [
    {
      "@type": "Offer",
      name: "The Builder",
      price: "0",
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: TICKET_URL,
    },
    {
      "@type": "Offer",
      name: "The Founder",
      price: "10000",
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: TICKET_URL,
    },
    {
      "@type": "Offer",
      name: "The Founder Squad",
      price: "40000",
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: TICKET_URL,
    },
  ],
};
