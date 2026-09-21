export interface PreTechForgeSession {
  id: string;
  year: number;
  isPlaceholder?: boolean;
  speaker: { name: string; role: string; company: string; image: string };
  title: string;
  description: string;
  date: string;
  time: string;
  timezone: string;
  platform: string;
  registrationUrl: string | null;
  recordingUrl: string | null;
  status: "upcoming" | "completed";
}

export const currentYear = 2026;

// Replace placeholders with real sessions and remove isPlaceholder when publishing.
// Leave this array empty to hide cards until sessions are announced.
const sessions: PreTechForgeSession[] = [
  {
    id: `ptf-2026-1`,
    year: 2026,
    isPlaceholder: true,
    speaker: { name: "Tofunmi Adeniyi", role: "Principal Engineer & Product Architect", company: "Gopaddi", image: "/assets/speakers/pre-techforge/tofunmi-adeniyi.png" },
    title: "Inclusive Developer Experience: Building Frontend Infrastructure When Everyone Can Prototype",
    description: "How should team build the frontend infrastructure that supports them? ",
    date: "2026-10-24",
    time: "20:00",
    timezone: "WAT",
    platform: "Google Meet",
    registrationUrl: "https://calendar.app.google/QcnioMk1wHmGaei4A",
    recordingUrl: null,
    status: "upcoming",
  },
  {
    id: `ptf-2026-2`,
    year: 2026,
    isPlaceholder: true,
    speaker: { name: "Sodunke Moyinoluwa", role: "Founder & Brand Strategist", company: "Creova Academy", image: "/assets/speakers/pre-techforge/sodunke-moyinoluwa.jpeg" },
    title: "How Do You Stay Relevant When Everything Is Changing",
    description: "How do you decide what deserves your attention and what you can afford to leave alone.",
    date: "2026-11-07",
    time: "20:00",
    timezone: "WAT",
    platform: "Google Meet",
    registrationUrl: "#",
    recordingUrl: null,
    status: "upcoming",
  },
  {
    id: `ptf-2026-3`,
    year: 2026,
    isPlaceholder: true,
    speaker: { name: "Okafor Bukola", role: "Founder", company: "BMARK Studio", image: "/assets/speakers/pre-techforge/Okafor-bukola.jpg" },
    title: "Technology as a Tool for Change: Building Startups That Matter in Africa",
    description: "Who are the people you want to serve, and how do you build products that actually help them?",
    date: "2026-11-14",
    time: "20:00",
    timezone: "WAT",
    platform: "Google Meet",
    registrationUrl: "#",
    recordingUrl: null,
    status: "upcoming",
  },
];

export function parseDate(session: PreTechForgeSession) {
  if (!session.date) return 0;
  return Date.parse(`${session.date}T${session.time || "00:00"}:00`) || 0;
}

export function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[Number(parts[1]) - 1] || parts[1]} ${Number(parts[2])}, ${parts[0]}`;
}

export function formatTime(session: PreTechForgeSession) {
  return session.time ? session.time + (session.timezone ? ` ${session.timezone}` : "") : "";
}

export function getAll() { return sessions.slice(); }
export function getByYear(year: number) { return sessions.filter((session) => session.year === Number(year)); }
export function getUpcoming(year = currentYear, limit?: number) {
  const list = getByYear(year).filter((session) => session.status === "upcoming").sort((a, b) => parseDate(a) - parseDate(b));
  return typeof limit === "number" ? list.slice(0, limit) : list;
}
export function getPast(year = currentYear) {
  return getByYear(year).filter((session) => session.status === "completed").sort((a, b) => parseDate(b) - parseDate(a));
}
