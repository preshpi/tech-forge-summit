import type { MetadataRoute } from "next";
import { getCompletedEditions } from "@/lib/editions";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/speakers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/editions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/dp`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const editionPages: MetadataRoute.Sitemap = getCompletedEditions().map(
    (edition) => ({
      url: `${SITE_URL}/editions/${edition.year}`,
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  return [...staticPages, ...editionPages];
}
