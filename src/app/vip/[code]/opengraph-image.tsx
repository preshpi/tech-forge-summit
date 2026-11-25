import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { getVipInvite, getVipInvites } from "@/lib/vipInvites";

export const alt = "VIP invitation to The TechForge 2.0";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getVipInvites().map(({ code }) => ({ code }));
}

const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
const SPARKLE = "M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z";

async function asDataUrl(publicPath: string) {
  const file = await readFile(join(process.cwd(), "public", publicPath));
  return `data:${MIME[extname(publicPath).toLowerCase()] ?? "image/png"};base64,${file.toString("base64")}`;
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const invite = getVipInvite((await params).code);
  const name = invite?.session.speaker.name ?? "Our VIP guest";
  const photo = invite ? await asDataUrl(invite.session.speaker.image) : null;
  const logo = await asDataUrl("/techforge-logo.png");

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f3f6fb", padding: 64, gap: 64, alignItems: "center" }}>
        {photo && (
          <div style={{ display: "flex", width: 400, height: 480, borderRadius: 48, border: "6px solid #ffffff", overflow: "hidden", transform: "rotate(-2deg)", boxShadow: "0 30px 60px rgba(21,59,176,0.3)", flexShrink: 0 }}>
            <img src={photo} alt="" width={400} height={480} style={{ objectFit: "cover", objectPosition: "50% 20%", width: "100%", height: "100%" }} />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <img src={logo} alt="" width={96} height={64} style={{ width: 96, height: 64, marginBottom: 36 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, letterSpacing: 3, color: "#1e4fd8", marginBottom: 18 }}>
            <svg width="22" height="22" viewBox="0 0 100 100">
              <path d={SPARKLE} fill="#e83a5c" />
            </svg>
            VIP INVITATION
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#0b1220" }}>
            <span>Welcome to</span>
            <span>The TechForge 2.0,</span>
            <span style={{ color: "#1e4fd8" }}>{name}</span>
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 24, fontWeight: 600, color: "#3d4658" }}>
            Saturday, December 5, 2026 · The Zone, Lagos
          </div>
        </div>
      </div>
    ),
    size,
  );
}
