import invites from "./vipInvites.json";
import { getAll, type PreTechForgeSession } from "./preTechForge";

// Each pre-TechForge speaker gets a personal welcome page at /vip/<code>, linked
// from the QR code on their printed VIP card. The random ending stops people from
// reaching other pages by guessing names. Codes are printed, so never change one
// after its card has gone out. Regenerate QR codes with `npm run vip:qr`.

export type VipInvite = { code: string; session: PreTechForgeSession; greetAs: string };
type InviteRow = { code: string; sessionId: string; greetAs: string };

export const VIP_EVENT = {
  name: "The TechForge 2.0",
  dateLabel: "Saturday, December 5, 2026",
  timeLabel: "9:00 AM – 5:00 PM (WAT)",
  start: "2026-12-05T09:00:00+01:00",
  end: "2026-12-05T17:00:00+01:00",
  venue: "The Zone",
  address: "Plot 9, Gbagada Industrial Scheme, beside UPS, Gbagada-Oworonshoki Expressway, Lagos State",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("The Zone, Plot 9, Gbagada Industrial Scheme, Gbagada-Oworonshoki Expressway, Lagos"),
};

// From the Premium Experience in the main event agenda.
export const VIP_PERKS = [
  { id: "seat", title: "Front-row reserved seating", detail: "Your seat is held in the front rows of the main stage, all day.", time: "All day" },
  { id: "lunch", title: "Premium Lunch", detail: "An exclusive lunch experience with fellow VIP guests.", time: "3:30 – 4:15 PM" },
  { id: "network", title: "Exclusive Speaker Networking", detail: "Dedicated time with TechForge speakers and VIP attendees.", time: "4:15 – 5:00 PM" },
] as const;

// greetAs is set by hand: some names on the site are listed surname first.
function toInvite({ code, sessionId, greetAs }: InviteRow): VipInvite | null {
  const session = getAll().find((item) => item.id === sessionId);
  return session ? { code, session, greetAs } : null;
}

export function getVipInvites(): VipInvite[] {
  return (invites as InviteRow[]).map(toInvite).filter((invite): invite is VipInvite => invite !== null);
}

export function getVipInvite(code: string): VipInvite | null {
  const match = (invites as InviteRow[]).find((invite) => invite.code === code);
  return match ? toInvite(match) : null;
}
