import { SITE_URL } from "@/lib/site";
import { VIP_EVENT } from "@/lib/vipInvites";

export const dynamic = "force-static";

// "2026-12-05T09:00:00+01:00" → "20261205T080000Z"
const icsTime = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// Commas and semicolons must be escaped in iCalendar text values.
const icsText = (text: string) => text.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1");

export function GET() {
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Infinite Community//TechForge//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:techforge-2026@techforgesummit.com",
    `DTSTAMP:${icsTime("2026-11-25T00:00:00Z")}`,
    `DTSTART:${icsTime(VIP_EVENT.start)}`,
    `DTEND:${icsTime(VIP_EVENT.end)}`,
    `SUMMARY:${icsText(VIP_EVENT.name)}`,
    `LOCATION:${icsText(`${VIP_EVENT.venue}, ${VIP_EVENT.address}`)}`,
    `DESCRIPTION:${icsText(`A full day of skills, strategy and innovation. ${SITE_URL}`)}`,
    `URL:${SITE_URL}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(`${VIP_EVENT.name} is tomorrow`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="techforge-2026.ics"',
    },
  });
}
