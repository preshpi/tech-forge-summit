export type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  size?: string;
};

export type EditionHighlights = {
  headlineDark: string;
  headlineBlue: string;
  retrospective: string;
  datePrimary?: string | null;
  dateSecondary?: string | null;
  venuePrimary?: string | null;
  venueSecondary?: string | null;
  heroImage: string;
  heroImageAlt: string;
  showNote?: boolean;
  gallery: GalleryItem[];
  fullGallery: GalleryItem[];
  galleryHref?: string;
};

export type Edition = {
  year: number;
  status: "upcoming" | "completed";
  title: string;
  theme: string;
  dateISO: string;
  datePrimary: string;
  dateSecondary?: string | null;
  venuePrimary: string;
  venueSecondary?: string | null;
  summary: string;
  listImage: string;
  listImageAlt: string;
  ticketHref?: string;
  highlights?: EditionHighlights | null;
};

const gallery2025: GalleryItem[] = [
  { src: "/tf1.jpg", alt: "Tech Forge 2025 event moment 1", width: 668, height: 1000, size: "wide" },
  { src: "/tf2.jpg", alt: "Tech Forge 2025 event moment 2", width: 1000, height: 668, size: "tall" },
  { src: "/tf3.jpg", alt: "Tech Forge 2025 event moment 3", width: 668, height: 1000, size: "square" },
  { src: "/tf4.jpg", alt: "Tech Forge 2025 event moment 4", width: 1000, height: 668, size: "square" },
  { src: "/tf5.jpg", alt: "Tech Forge 2025 event moment 5", width: 1000, height: 668, size: "square" },
  { src: "/tf6.jpg", alt: "Tech Forge 2025 event moment 6", width: 1000, height: 863 },
  { src: "/tf7.jpg", alt: "Tech Forge 2025 event moment 7", width: 1000, height: 637 },
  { src: "/tf8.jpg", alt: "Tech Forge 2025 event moment 8", width: 1000, height: 668 },
  { src: "/tf9.jpg", alt: "Tech Forge 2025 event moment 9", width: 1000, height: 668 },
  { src: "/tf10.jpg", alt: "Tech Forge 2025 event moment 10", width: 1000, height: 637 },
  { src: "/tf11.jpg", alt: "Tech Forge 2025 event moment 11", width: 668, height: 1000 },
  { src: "/tf12.jpg", alt: "Tech Forge 2025 event moment 12", width: 692, height: 1000 },
  { src: "/tf13.jpg", alt: "Tech Forge 2025 event moment 13", width: 692, height: 1000 },
  { src: "/tf14.jpg", alt: "Tech Forge 2025 event moment 14", width: 1000, height: 668 },
  { src: "/tf15.jpg", alt: "Tech Forge 2025 event moment 15", width: 1000, height: 668 },
  { src: "/tf16.jpg", alt: "Tech Forge 2025 event moment 16", width: 1000, height: 668 },
  { src: "/tf17.jpg", alt: "Tech Forge 2025 event moment 17", width: 1000, height: 668 },
  { src: "/tf18.jpg", alt: "Tech Forge 2025 event moment 18", width: 1000, height: 668 },
  { src: "/tf19.jpg", alt: "Tech Forge 2025 event moment 19", width: 1000, height: 668 },
  { src: "/tf20.jpg", alt: "Tech Forge 2025 event moment 20", width: 1000, height: 668 },
];

const editions: Edition[] = [
  {
    year: 2026,
    status: "upcoming",
    title: "Tech Forge 2026",
    theme: "The Builders’ Blueprint: Skills, Strategy & Innovation for the Future",
    dateISO: "2026-12-05",
    datePrimary: "December 5, 2026",
    dateSecondary: "9:00 AM – 5:00 PM (WAT)",
    venuePrimary: "The Zone",
    venueSecondary: "Gbagada, Lagos",
    summary:
      "Our biggest edition yet. Bringing together builders, founders, technology professionals, students and emerging talent for a full day of practical learning, meaningful conversations and connections.",
    listImage: "/tf18.jpg",
    listImageAlt: "Audience at Tech Forge",
    ticketHref: "https://tix.africa/discover/the-tech-forge",
    highlights: null,
  },
  {
    year: 2025,
    status: "completed",
    title: "Tech Forge 2025",
    theme: "Forging the tools of tomorrow today.",
    dateISO: "2025-09-13",
    datePrimary: "September 13, 2025",
    venuePrimary: "The Zone",
    venueSecondary: "Gbagada, Lagos",
    summary:
      "A gathering of builders, founders and technology talent coming together to learn, connect and push Africa’s tech ecosystem forward.",
    listImage: "/tf19.jpg",
    listImageAlt: "Panel discussion at Tech Forge 2025",
    highlights: {
      headlineDark: "Forging the tools of",
      headlineBlue: "tomorrow today.",
      retrospective:
        "Tech Forge 2025 brought builders, founders and technology professionals together for a day of practical learning, real conversations and meaningful connections across Africa’s tech community.",
      venuePrimary: "The Zone",
      venueSecondary: "Gbagada, Lagos",
      heroImage: "/tf15.jpg",
      heroImageAlt: "Speakers on stage at Tech Forge 2025",
      showNote: true,
      gallery: gallery2025.slice(0, 5),
      fullGallery: gallery2025,
      galleryHref: "/editions",
    },
  },
];

export function getEditions() {
  return [...editions].sort((a, b) => b.year - a.year);
}

export function getEditionByYear(year: string | number) {
  const numericYear = Number(year);
  return editions.find((edition) => edition.year === numericYear) ?? null;
}

export function getCompletedEditions() {
  return getEditions().filter(
    (edition) => edition.status === "completed" && edition.highlights,
  );
}
