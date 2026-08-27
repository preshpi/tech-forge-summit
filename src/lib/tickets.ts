export type TierId = "builder" | "founder" | "founder-squad";

export const tiers: Record<
  TierId,
  { name: string; price: number; unit: string; desc: string }
> = {
  builder: {
    name: "The Builder",
    price: 0,
    unit: "per attendee",
    desc: "Access to all sessions and expo/exhibition access.",
  },
  founder: {
    name: "The Founder",
    price: 10000,
    unit: "per attendee",
    desc: "Everything in Builder, plus merch and front-row reserved seating.",
  },
  "founder-squad": {
    name: "The Founder Squad",
    price: 40000,
    unit: "for 5 attendees (20% off)",
    desc: "Bring four others. Five Founder-tier passes at a group discount.",
  },
};
