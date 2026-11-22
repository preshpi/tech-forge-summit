import { SPARKLE_SRC, THEMES, type ThemeId } from "./themes";

export const SIZE = 1080;
export const MAX_NAME = 28;

// Vertical stack: label → logo → photo ring → name → date.
const LABEL = { top: 58, line: 24 };
// tagX/tagY: center of the "2.0" sticker, relative to the logo's top-left corner.
const LOGO = { top: 98, height: 140, tagX: 14, tagY: 18 };
// Photo geometry. The ring's outer circle is 544px wide with its top at y=256.
export const RING = { cx: 540, cy: 528, outer: 272, thickness: 12 };
export const PHOTO_RADIUS = RING.outer - RING.thickness; // 260 → 520px circle

const DATE_LINE = "Sat, 5 December 2026 · The Zone, Lagos";
const NAME_PLACEHOLDER = "Your Name";
const NAME_MAX_WIDTH = 760;

export type Photo = { source: CanvasImageSource; width: number; height: number };

export type DpAssets = Record<string, HTMLImageElement>;

export type DpState = {
  theme: ThemeId;
  name: string;
  photo: Photo | null;
  zoom: number; // 1–3
  /** Photo offset from the circle center, in canvas px. Clamped when drawn. */
  offsetX: number;
  offsetY: number;
  font: string; // resolved CSS font-family list
};

export const ASSET_PATHS = [
  ...new Set([
    ...Object.values(THEMES).flatMap(theme => [theme.background, theme.placeholder, theme.logo]),
    ...Object.values(SPARKLE_SRC),
  ]),
];

export function loadAssets(): Promise<DpAssets> {
  return Promise.all(
    ASSET_PATHS.map(
      src =>
        new Promise<[string, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => resolve([src, img]);
          img.onerror = () => reject(new Error(`Could not load ${src}`));
          img.src = src;
        }),
    ),
  ).then(Object.fromEntries);
}

/** Size of the photo at the given zoom, scaled to cover the circle. */
export function coverSize(photo: Photo, zoom: number) {
  const scale = ((PHOTO_RADIUS * 2) / Math.min(photo.width, photo.height)) * zoom;
  return { width: photo.width * scale, height: photo.height * scale };
}

/** Keep the photo covering the whole circle: no empty gaps at the edges. */
export function clampOffset(photo: Photo, zoom: number, x: number, y: number) {
  const { width, height } = coverSize(photo, zoom);
  const maxX = width / 2 - PHOTO_RADIUS;
  const maxY = height / 2 - PHOTO_RADIUS;
  return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
}

const supportsLetterSpacing = (ctx: CanvasRenderingContext2D) => "letterSpacing" in ctx;

/** Width of text with letter spacing applied between characters (not after the last one). */
function spacedWidth(ctx: CanvasRenderingContext2D, text: string, spacing: number) {
  if (supportsLetterSpacing(ctx)) {
    ctx.letterSpacing = `${spacing}px`;
    const width = ctx.measureText(text).width - spacing;
    ctx.letterSpacing = "0px";
    return width;
  }
  return [...text].reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) + spacing * ([...text].length - 1);
}

/** Draw text starting at x on the alphabetic baseline, with letter spacing. */
function drawSpaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  if (supportsLetterSpacing(ctx)) {
    ctx.letterSpacing = `${spacing}px`;
    ctx.fillText(text, x, y);
    ctx.letterSpacing = "0px";
    return;
  }
  // Older Safari: place each character by hand.
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + spacing;
  }
}

function centered(ctx: CanvasRenderingContext2D, text: string, y: number, spacing: number) {
  drawSpaced(ctx, text, SIZE / 2 - spacedWidth(ctx, text, spacing) / 2, y, spacing);
}

/** Height of capital letters in the current font, used to center text in its line box. */
const capHeight = (ctx: CanvasRenderingContext2D) => ctx.measureText("H").actualBoundingBoxAscent;

/** Alphabetic baseline that visually centers cap-height text inside a line box. */
function baselineIn(ctx: CanvasRenderingContext2D, top: number, lineHeight: number) {
  return top + lineHeight / 2 + capHeight(ctx) / 2;
}

/** Single source of truth for the DP. Used by both the live preview and the download. */
export function drawDP(ctx: CanvasRenderingContext2D, state: DpState, assets: DpAssets) {
  const theme = THEMES[state.theme];
  const font = (weight: number, size: number) => `${weight} ${size}px ${state.font}`;
  const { cx, cy, outer } = RING;

  ctx.save();
  ctx.clearRect(0, 0, SIZE, SIZE);

  // 1–2. Background (glow circle is part of the SVG).
  ctx.drawImage(assets[theme.background], 0, 0, SIZE, SIZE);

  // 3. Top: "I'LL BE ATTENDING", then the logo with a pink "2.0" sticker on its corner.
  ctx.fillStyle = theme.muted;
  ctx.font = font(600, 20);
  centered(ctx, "I'LL BE ATTENDING", baselineIn(ctx, LABEL.top, LABEL.line), 20 * 0.24);

  const logo = assets[theme.logo];
  const logoWidth = (LOGO.height * logo.naturalWidth) / logo.naturalHeight;
  const logoLeft = SIZE / 2 - logoWidth / 2;
  ctx.drawImage(logo, logoLeft, LOGO.top, logoWidth, LOGO.height);

  ctx.font = font(800, 22);
  const tagText = ctx.measureText("2.0");
  const tagWidth = tagText.width + 28;
  const tagHeight = 40; // 22px text on a normal line (~28px) + 6px padding top and bottom
  ctx.save();
  // Tucked into the empty top-left corner of the logo, tilted like a sticker.
  ctx.translate(logoLeft + LOGO.tagX, LOGO.top + LOGO.tagY);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.fillStyle = theme.tag.background;
  ctx.fillRect(-tagWidth / 2, -tagHeight / 2, tagWidth, tagHeight);
  ctx.fillStyle = theme.tag.text;
  drawSpaced(ctx, "2.0", -tagText.width / 2, tagText.actualBoundingBoxAscent / 2, 0);
  ctx.restore();

  // 4. Ring
  ctx.beginPath();
  ctx.arc(cx, cy, outer, 0, Math.PI * 2);
  if (Array.isArray(theme.ring)) {
    // CSS 145°: 0° points up, angles turn clockwise.
    const angle = (145 * Math.PI) / 180;
    const dx = Math.sin(angle);
    const dy = -Math.cos(angle);
    const half = outer * (Math.abs(dx) + Math.abs(dy));
    const gradient = ctx.createLinearGradient(cx - dx * half, cy - dy * half, cx + dx * half, cy + dy * half);
    gradient.addColorStop(0, theme.ring[0]);
    gradient.addColorStop(1, theme.ring[1]);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = theme.ring;
  }
  ctx.fill();

  // 5. Photo (or placeholder) clipped to the inner circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, PHOTO_RADIUS, 0, Math.PI * 2);
  ctx.clip();
  if (state.photo) {
    const { width, height } = coverSize(state.photo, state.zoom);
    const { x, y } = clampOffset(state.photo, state.zoom, state.offsetX, state.offsetY);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(state.photo.source, cx - width / 2 + x, cy - height / 2 + y, width, height);
  } else {
    ctx.drawImage(assets[theme.placeholder], cx - PHOTO_RADIUS, cy - PHOTO_RADIUS, PHOTO_RADIUS * 2, PHOTO_RADIUS * 2);
    ctx.fillStyle = theme.placeholderLabel;
    ctx.font = font(700, 20);
    centered(ctx, "YOUR PHOTO", cy + PHOTO_RADIUS - 72, 20 * 0.2);
  }
  ctx.restore();

  // 6. Sparkles, lower right of the ring
  ctx.drawImage(assets[SPARKLE_SRC[theme.sparkles[0]]], 696, cy + 123, 76, 76);
  ctx.drawImage(assets[SPARKLE_SRC[theme.sparkles[1]]], 770, cy + 77, 40, 40);

  // 7. Name: one line, shrink to fit 760px (min 40px)
  const name = state.name.trim().slice(0, MAX_NAME) || NAME_PLACEHOLDER;
  let nameSize = 68;
  ctx.font = font(800, nameSize);
  const fullWidth = spacedWidth(ctx, name, nameSize * -0.03);
  if (fullWidth > NAME_MAX_WIDTH) {
    nameSize = Math.max(40, Math.floor((68 * NAME_MAX_WIDTH) / fullWidth));
    ctx.font = font(800, nameSize);
  }
  // A shrunk name stays centered in the full 68px line box, so nothing below it moves.
  const nameTop = cy + outer + 26;
  const nameLine = 68 * 1.1;
  ctx.fillStyle = theme.text;
  centered(ctx, name, baselineIn(ctx, nameTop, nameLine), nameSize * -0.03);

  // 8. Date line
  const dateTop = nameTop + nameLine + 12;
  ctx.fillStyle = theme.muted;
  ctx.font = font(500, 24);
  centered(ctx, DATE_LINE, baselineIn(ctx, dateTop, 32), 0);

  ctx.restore();
}
