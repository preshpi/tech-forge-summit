// Generates a print-ready QR code for every VIP invite in src/lib/vipInvites.json.
//
//   npm run vip:qr
//
// Output goes to vip-qr/ (git-ignored): one SVG (for print, scales to any size)
// and one PNG (2048px, for quick previews) per speaker, plus links.csv listing
// every URL. Black on white with high error correction: if the card designer
// recolours a code, keep it dark on a light background and leave the white
// margin around it.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";

const SITE = "https://www.techforgesummit.com";
const root = new URL("..", import.meta.url).pathname;
const out = join(root, "vip-qr");
const invites = JSON.parse(await readFile(join(root, "src/lib/vipInvites.json"), "utf8"));

const options = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#000000", light: "#FFFFFF" } };

await mkdir(out, { recursive: true });
const rows = [["name", "url", "svg", "png"]];

for (const { code } of invites) {
  const url = `${SITE}/vip/${code}`;
  // File names drop the random ending so they're easy to match to cards.
  const name = code.replace(/-[a-z0-9]{5}$/, "");
  await writeFile(join(out, `${name}.svg`), await QRCode.toString(url, { ...options, type: "svg" }));
  await QRCode.toFile(join(out, `${name}.png`), url, { ...options, width: 2048 });
  rows.push([name, url, `${name}.svg`, `${name}.png`]);
  console.log(`✓ ${name}  ${url}`);
}

await writeFile(join(out, "links.csv"), rows.map((row) => row.join(",")).join("\n") + "\n");
console.log(`\n${invites.length} QR codes written to vip-qr/`);
