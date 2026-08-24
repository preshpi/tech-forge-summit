export type TierId = "general" | "vip" | "team";

export const tiers: Record<
  TierId,
  { name: string; price: number; unit: string; desc: string }
> = {
  general: {
    name: "General Admission",
    price: 15000,
    unit: "per attendee",
    desc: "Full access to all main-stage talks and the official networking event.",
  },
  vip: {
    name: "VIP Pass",
    price: 30000,
    unit: "per attendee",
    desc: "Everything in General, plus workshops, reserved seating, and the founders dinner.",
  },
  team: {
    name: "Team Pass",
    price: 65000,
    unit: "for 5 attendees",
    desc: "Bring your team. Five VIP-level passes at a meaningful discount.",
  },
};
