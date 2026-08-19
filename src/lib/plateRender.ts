/**
 * Canvas painter for the attendee plate.
 *
 * The preview, the avatar-size proofs and the downloaded PNG are all the same
 * drawing at different scales — one painter means what you see is exactly what
 * you get, down to the letter tracking.
 *
 * Tracking is applied per character rather than through `ctx.letterSpacing`,
 * which is unevenly supported and pads the trailing edge, which would throw off
 * every centring calculation here.
 */

import {
  INK_SOFT,
  PLATE,
  SPARKLE_POINTS,
  SPARKLE_STROKE,
  SPEC_LINES,
  SQUIGGLE_BOX,
  SQUIGGLE_SEGMENTS,
  SQUIGGLE_START,
  STRAP_LINE,
  WORDMARK,
  notchOf,
  placeImage,
  tidyName,
  type Edition,
  type Frame,
} from "./plate";

export type PlateContent = {
  edition: Edition;
  image: CanvasImageSource | null;
  imageW: number;
  imageH: number;
  frame: Frame;
  name: string;
  /** Resolved family string, read off the document so canvas matches the DOM. */
  fontFamily: string;
};

function measureTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  tracking: number,
): number {
  let width = 0;
  for (const char of text) width += ctx.measureText(char).width + tracking;
  return text.length ? width - tracking : 0;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}

/** True cap height of the set text, for optical centring instead of a guessed ratio. */
function capHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
): number {
  const ascent = ctx.measureText(text).actualBoundingBoxAscent;
  return Number.isFinite(ascent) && ascent > 0 ? ascent : fontSize * 0.72;
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
) {
  const unit = size / 80;
  ctx.save();
  ctx.beginPath();
  SPARKLE_POINTS.forEach(([px, py], index) => {
    const x = cx + (px - 40) * unit;
    const y = cy + (py - 40) * unit;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = SPARKLE_STROKE * size;
  ctx.lineJoin = "round";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawSquiggle(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  width: number,
  height: number,
  weight: number,
  color: string,
) {
  const sx = width / SQUIGGLE_BOX.width;
  const sy = height / SQUIGGLE_BOX.height;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, top + SQUIGGLE_START * sy);
  for (const [cx, cy, px, py] of SQUIGGLE_SEGMENTS) {
    ctx.quadraticCurveTo(x + cx * sx, top + cy * sy, x + px * sx, top + py * sy);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

/** The bottom arm: who you are on the left, where and when on the right. */
function drawBand(
  ctx: CanvasRenderingContext2D,
  size: number,
  content: PlateContent,
) {
  const { edition, fontFamily } = content;
  const name = tidyName(content.name);
  const center = size - (PLATE.band * size) / 2;
  const leftX = (PLATE.gutter + PLATE.padX) * size;
  const rightX = size - PLATE.padX * size;

  ctx.fillStyle = edition.onBrand;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Right: the fixed facts, in the mono register the footer and eyebrows use.
  const specSize = PLATE.spec.size * size;
  ctx.font = `700 ${specSize}px ${fontFamily}`;
  const specTracking = PLATE.spec.tracking * specSize;
  const specWidths = SPEC_LINES.map((line) =>
    measureTracked(ctx, line, specTracking),
  );
  const specCap = capHeight(ctx, SPEC_LINES[0], specSize);
  const leading = PLATE.spec.leading * size;

  const specBlock = Math.max(...specWidths);
  const available = rightX - specBlock - PLATE.padX * size - leftX;

  // Measure the left-hand block before anything is drawn, so both halves can
  // hang off one shared baseline — the registration the whole plate is about.
  const gap = PLATE.squiggle.gap * size;
  const rule = PLATE.squiggle.height * size;

  let nameSize = 0;
  let nameWidth = 0;
  let leftCap: number;
  let below = 0;

  if (name) {
    nameSize = PLATE.name.size * size;
    ctx.font = `700 ${nameSize}px ${fontFamily}`;
    nameWidth = ctx.measureText(name).width;
    if (nameWidth > available) {
      nameSize = Math.max(
        PLATE.name.size * size * PLATE.name.minScale,
        (nameSize * available) / nameWidth,
      );
      ctx.font = `700 ${nameSize}px ${fontFamily}`;
      nameWidth = ctx.measureText(name).width;
    }
    leftCap = capHeight(ctx, name, nameSize);
    below = gap + rule;
  } else {
    const strapSize = PLATE.strap.size * size;
    ctx.font = `700 ${strapSize}px ${fontFamily}`;
    leftCap = capHeight(ctx, STRAP_LINE, strapSize);
  }

  const above = Math.max(leftCap, specCap + leading);
  const baseline = center + (above - below) / 2;

  SPEC_LINES.forEach((line, index) => {
    ctx.font = `700 ${specSize}px ${fontFamily}`;
    drawTracked(
      ctx,
      line,
      rightX - specWidths[index],
      baseline - (SPEC_LINES.length - 1 - index) * leading,
      specTracking,
    );
  });

  if (!name) {
    // No name yet: a strap in the mono register, so it never reads as a person.
    const strapSize = PLATE.strap.size * size;
    ctx.font = `700 ${strapSize}px ${fontFamily}`;
    drawTracked(
      ctx,
      STRAP_LINE,
      leftX,
      baseline,
      PLATE.strap.tracking * strapSize,
    );
    return;
  }

  // Display register, set the way the speaker list sets a name, with the
  // hand-drawn rule from the about section carried underneath it.
  ctx.font = `700 ${nameSize}px ${fontFamily}`;
  ctx.fillText(name, leftX, baseline);
  drawSquiggle(
    ctx,
    leftX,
    baseline + gap,
    Math.min(nameWidth, available),
    rule,
    PLATE.squiggle.weight * size,
    edition.onBrand,
  );
}

export function drawPlate(
  ctx: CanvasRenderingContext2D,
  size: number,
  content: PlateContent,
) {
  const { edition, fontFamily } = content;

  ctx.save();
  ctx.clearRect(0, 0, size, size);

  // The L. Flooded first, then the portrait opening is cut back out of it.
  ctx.fillStyle = edition.brand;
  ctx.fillRect(0, 0, size, size);

  const notch = notchOf(size);
  ctx.save();
  ctx.beginPath();
  ctx.rect(notch.x, notch.y, notch.w, notch.h);
  ctx.clip();
  ctx.fillStyle = INK_SOFT;
  ctx.fillRect(notch.x, notch.y, notch.w, notch.h);
  if (content.image && content.imageW && content.imageH) {
    const box = placeImage(size, content.imageW, content.imageH, content.frame);
    ctx.drawImage(content.image, box.x, box.y, box.w, box.h);
  }
  ctx.restore();

  // The section mark from the site's eyebrows, at the head of the spine.
  drawSparkle(
    ctx,
    (PLATE.gutter * size) / 2,
    (PLATE.sparkle.top + PLATE.sparkle.size / 2) * size,
    PLATE.sparkle.size * size,
    edition.onBrand,
  );

  // The wordmark, running up the spine.
  const spineTop = PLATE.wordmark.top * size;
  const spineBottom = (1 - PLATE.band - PLATE.wordmark.bottom) * size;
  const markSize = PLATE.wordmark.size * size;
  ctx.font = `700 ${markSize}px ${fontFamily}`;
  ctx.fillStyle = edition.onBrand;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const tracking = PLATE.wordmark.tracking * markSize;
  const markWidth = measureTracked(ctx, WORDMARK, tracking);
  const markCap = capHeight(ctx, WORDMARK, markSize);
  ctx.save();
  ctx.translate((PLATE.gutter * size) / 2, (spineTop + spineBottom) / 2);
  ctx.rotate(-Math.PI / 2);
  drawTracked(ctx, WORDMARK, -markWidth / 2, markCap / 2, tracking);
  ctx.restore();

  drawBand(ctx, size, content);

  // One hairline binding the whole plate, as `.image-text-fill` binds a photo.
  const weight = PLATE.hairline * size;
  ctx.lineWidth = weight;
  ctx.strokeStyle = edition.onBrand;
  ctx.strokeRect(weight / 2, weight / 2, size - weight, size - weight);

  ctx.restore();
}

let halfA: HTMLCanvasElement | null = null;
let halfB: HTMLCanvasElement | null = null;

/**
 * Copy the master plate into a smaller canvas, halving in steps on the way
 * down. A single big downscale frays the hairline and the tracked type; this is
 * what the proof strip needs in order to be an honest test.
 */
export function blitPlate(
  master: HTMLCanvasElement,
  target: HTMLCanvasElement,
  cssSize: number,
  dpr: number,
) {
  const pixels = Math.max(1, Math.round(cssSize * dpr));
  if (target.width !== pixels || target.height !== pixels) {
    target.width = pixels;
    target.height = pixels;
  }
  const ctx = target.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, pixels, pixels);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  let source: HTMLCanvasElement = master;
  let current = master.width;
  let flip = false;
  while (current / 2 >= pixels * 1.4) {
    const next = Math.round(current / 2);
    if (!halfA) halfA = document.createElement("canvas");
    if (!halfB) halfB = document.createElement("canvas");
    const scratch = flip ? halfB : halfA;
    scratch.width = next;
    scratch.height = next;
    const scratchCtx = scratch.getContext("2d");
    if (!scratchCtx) break;
    scratchCtx.imageSmoothingEnabled = true;
    scratchCtx.imageSmoothingQuality = "high";
    scratchCtx.clearRect(0, 0, next, next);
    scratchCtx.drawImage(source, 0, 0, next, next);
    source = scratch;
    current = next;
    flip = !flip;
  }

  ctx.drawImage(source, 0, 0, pixels, pixels);
}

/** The family string canvas needs — next/font generates a hashed name. */
export function resolveFontFamily(): string {
  if (typeof window === "undefined") return "sans-serif";
  const family = getComputedStyle(document.documentElement).fontFamily;
  return family || "sans-serif";
}
