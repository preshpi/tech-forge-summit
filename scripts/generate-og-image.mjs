import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const outputPath = path.join(
  projectRoot,
  "public",
  "og-tech-forge-2026.png",
);

const background = await sharp(path.join(projectRoot, "public", "tf19.jpg"))
  .resize(1200, 630, {
    fit: "cover",
    position: "attention",
  })
  .modulate({ saturation: 0.9, brightness: 0.86 })
  .png()
  .toBuffer();

const logo = await sharp(
  path.join(projectRoot, "public", "tech-forge-white-logo.png"),
)
  .trim()
  .resize({ width: 118 })
  .png()
  .toBuffer();

const artwork = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brand-overlay" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#153bb0" stop-opacity="1" />
        <stop offset="52%" stop-color="#153bb0" stop-opacity="0.96" />
        <stop offset="78%" stop-color="#0b1220" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#0b1220" stop-opacity="0.28" />
      </linearGradient>
    </defs>

    <rect width="1200" height="630" fill="#0b1220" fill-opacity="0.2" />
    <rect width="1200" height="630" fill="url(#brand-overlay)" />

    <circle cx="1110" cy="84" r="62" fill="#f5c518" />
    <path d="M1068 520 L1160 470 L1160 570 Z" fill="#e83a5c" />

    <text x="72" y="236" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="57" font-weight="800" letter-spacing="-2">
      THE BUILDERS’
    </text>
    <text x="72" y="314" fill="#f5c518" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="900" letter-spacing="-3">
      BLUEPRINT
    </text>
    <text x="76" y="367" fill="#ffffff" fill-opacity="0.92" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600">
      Skills, Strategy &amp; Innovation for the Future
    </text>

    <rect x="72" y="430" width="485" height="68" rx="34" fill="#ffffff" fill-opacity="0.13" stroke="#ffffff" stroke-opacity="0.3" />
    <text x="106" y="473" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="0.5">
      DEC 5, 2026  ·  THE ZONE, LAGOS
    </text>

    <text x="74" y="568" fill="#ffffff" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="3">
      TECHFORGESUMMIT.COM
    </text>
  </svg>
`);

await sharp(background)
  .composite([
    { input: artwork, top: 0, left: 0 },
    { input: logo, top: 54, left: 72 },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile(outputPath);

console.log(outputPath);
