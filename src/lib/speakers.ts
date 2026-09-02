export type Speaker = {
  name: string;
  role: string;
  org: string;
  image: string;
  track?: string;
};

export const mainEventSpeakers: Speaker[] = [
  {
    name: "Imam Abubakar",
    role: "Founder",
    org: "Sqaleup Inc",
    image: "/imam.jpeg",
    track: "Innovation and Scale",
  },
  {
    name: "Folashade Blessing",
    role: "Senior Product Designer",
    org: "Interswitch Group",
    image: "/folashade.jpeg",
    track: "Product and Experience",
  },
  {
    name: "Dominus Kelvin",
    role: "Lead maintainer",
    org: "Sails",
    image: "/koo.jpg",
    track: "Engineering Systems",
  },
];

export const preEventSpeakerSlots = [
  {
    id: "pre-event-01",
    title: "Pre-event keynote",
    focus: "Setting the tone before the forge opens.",
  },
  {
    id: "pre-event-02",
    title: "Community catalyst",
    focus: "A practical voice for builders finding their edge.",
  },
  {
    id: "pre-event-03",
    title: "Career clinic lead",
    focus: "Portfolio, positioning and the next serious move.",
  },
  {
    id: "pre-event-04",
    title: "Founder spotlight",
    focus: "Lessons from turning problems into products.",
  },
] as const;
