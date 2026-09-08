(function (global) {
  "use strict";

  var GALLERY_2025 = [
    {
      src: "/tf1.jpg",
      alt: "Tech Forge 2025 event moment 1",
      width: 668,
      height: 1000,
      size: "wide",
    },
    {
      src: "/tf2.jpg",
      alt: "Tech Forge 2025 event moment 2",
      width: 1000,
      height: 668,
      size: "tall",
    },
    {
      src: "/tf3.jpg",
      alt: "Tech Forge 2025 event moment 3",
      width: 668,
      height: 1000,
      size: "square",
    },
    {
      src: "/tf4.jpg",
      alt: "Tech Forge 2025 event moment 4",
      width: 1000,
      height: 668,
      size: "square",
    },
    {
      src: "/tf5.jpg",
      alt: "Tech Forge 2025 event moment 5",
      width: 1000,
      height: 668,
      size: "square",
    },
    {
      src: "/tf6.jpg",
      alt: "Tech Forge 2025 event moment 6",
      width: 1000,
      height: 863,
    },
    {
      src: "/tf7.jpg",
      alt: "Tech Forge 2025 event moment 7",
      width: 1000,
      height: 637,
    },
    {
      src: "/tf8.jpg",
      alt: "Tech Forge 2025 event moment 8",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf9.jpg",
      alt: "Tech Forge 2025 event moment 9",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf10.jpg",
      alt: "Tech Forge 2025 event moment 10",
      width: 1000,
      height: 637,
    },
    {
      src: "/tf11.jpg",
      alt: "Tech Forge 2025 event moment 11",
      width: 668,
      height: 1000,
    },
    {
      src: "/tf12.jpg",
      alt: "Tech Forge 2025 event moment 12",
      width: 692,
      height: 1000,
    },
    {
      src: "/tf13.jpg",
      alt: "Tech Forge 2025 event moment 13",
      width: 692,
      height: 1000,
    },
    {
      src: "/tf14.jpg",
      alt: "Tech Forge 2025 event moment 14",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf15.jpg",
      alt: "Tech Forge 2025 event moment 15",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf16.jpg",
      alt: "Tech Forge 2025 event moment 16",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf17.jpg",
      alt: "Tech Forge 2025 event moment 17",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf18.jpg",
      alt: "Tech Forge 2025 event moment 18",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf19.jpg",
      alt: "Tech Forge 2025 event moment 19",
      width: 1000,
      height: 668,
    },
    {
      src: "/tf20.jpg",
      alt: "Tech Forge 2025 event moment 20",
      width: 1000,
      height: 668,
    },
  ];

  var EDITIONS = [
    {
      year: 2026,
      status: "upcoming",
      title: "Tech Forge 2026",
      theme:
        "The Builders’ Blueprint: Skills, Strategy & Innovation for the Future",
      datePrimary: "December 5, 2026",
      dateSecondary: "9:00 AM – 5:00 PM (WAT)",
      venuePrimary: "The Zone",
      venueSecondary: "Gbagada, Lagos",
      summary:
        "Our biggest edition yet. Bringing together builders, founders, technology professionals, students and emerging talent for a full day of practical learning, meaningful conversations and connections.",
      listImage: "second.png",
      listImageAlt: "Audience at Tech Forge",
      ticketHref: "#tickets",
      highlights: null,
    },
    {
      year: 2025,
      status: "completed",
      title: "Tech Forge 2025",
      theme: "Building for real impact.",
      datePrimary: "September 13, 2025",
      dateSecondary: null,
      venuePrimary: "The Zone",
      venueSecondary: "Gbagada, Lagos",
      summary:
        "A gathering of builders, founders and technology talent coming together to learn, connect and push Africa’s tech ecosystem forward.",
      listImage: "conference-stage-alt.png",
      listImageAlt: "Panel discussion at Tech Forge 2025",
      highlights: {
        headlineDark: "Building for",
        headlineBlue: "real impact.",
        retrospective:
          "Tech Forge 2025 brought builders, founders and technology professionals together for a day of practical learning, real conversations and meaningful connections across Africa’s tech community.",
        datePrimary: null,
        dateSecondary: null,
        venuePrimary: "Lagos, Nigeria",
        venueSecondary: null,
        heroImage: "conference-stage-alt.png",
        heroImageAlt: "Speakers on stage at Tech Forge 2025",
        showNote: true,
        stats: [],
        gallery: GALLERY_2025.slice(0, 5),
        fullGallery: GALLERY_2025,
        galleryHref: "/editions",
        speakers: [],
        speakersHref: null,
        recordings: [],
      },
    },
  ];

  function getEditions() {
    return EDITIONS.slice().sort(function (a, b) {
      return b.year - a.year;
    });
  }

  function getEditionByYear(year) {
    var y = Number(year);
    for (var i = 0; i < EDITIONS.length; i++) {
      if (EDITIONS[i].year === y) return EDITIONS[i];
    }
    return null;
  }

  function asset(base, path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path) || path.charAt(0) === "/") return path;
    return (base || "") + path;
  }

  function page(base, path) {
    return asset(base, path);
  }

  global.TechForgeEditions = {
    getAll: getEditions,
    getByYear: getEditionByYear,
    asset: asset,
    page: page,
  };
})(window);
