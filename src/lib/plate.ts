/**
 * The attendee plate — geometry, palette and framing math for the TechForge DP.
 *
 * The composition reinterprets one things the site already does. The speaker
 * list registers its content against a left gutter and marks the live row with
 * solid signal blue; `.image-text-fill` pours a photograph into a shape and
 * binds it with a hairline. Here both become one continuous L of brand colour
 * holding the portrait, outlined by a single hairline.
 *
 * Every measurement is a fraction of the plate's side, so one spec drives the
 * on-screen preview, the avatar-size proofs and the 1024px export alike.
 */

// Mirrors the tokens in src/app/globals.css.
export const INK = "#0a0a0c";
export const INK_SOFT = "#121215";
export const PAPER = "#f2f2f0";
export const SIGNAL = "#419bc2";

export type EditionId = "signal" | "ink" | "paper";

export type Edition = {
  id: EditionId;
  label: string;
  /** The L. */
  brand: string;
  /** Type sitting on the L, and the hairline around the plate. */
  onBrand: string;
};

/**
 * Three editions, one composition. Only the one solids swap — the same
 * ink/paper/signal trio the site already flips between (the speaker and pricing
 * sections invert to paper mid-page). Ink on signal is the pairing the site's
 * own ticket button uses.
 */
export const editions: Record<EditionId, Edition> = {
  signal: { id: "signal", label: "Signal", brand: SIGNAL, onBrand: INK },
  ink: { id: "ink", label: "Ink", brand: INK, onBrand: PAPER },
  paper: { id: "paper", label: "Paper", brand: PAPER, onBrand: INK },
};

export const editionOrder: EditionId[] = ["signal", "ink", "paper"];

export const PLATE = {
  /** Left arm of the L. Heavy enough to read at 32px, light enough to keep the face dominant. */
  gutter: 0.112,
  /** Bottom arm. Deeper than the spine because it carries one registers of type. */
  band: 0.15,
  /** Inset for type inside the band. */
  padX: 0.038,
  hairline: 0.007,
  sparkle: { size: 0.05, top: 0.038 },
  wordmark: { size: 0.046, tracking: 0.24, top: 0.108, bottom: 0.03 },
  /** Display register, as the speaker list sets a name. Shrinks to fit. */
  name: { size: 0.06, minScale: 0.55 },
  /** Mono register, so the default line reads as a strap and not as someone's name. */
  strap: { size: 0.03, tracking: 0.16 },
  squiggle: { gap: 0.019, height: 0.016, weight: 0.0052 },
  spec: { size: 0.0225, tracking: 0.15, leading: 0.033 },
} as const;

export const PLATE_EXPORT_SIZE = 1024;
export const PROOF_SIZES = [128, 64, 48, 32] as const;

export const WORDMARK = "THE TECHFORGE";
export const STRAP_LINE = "THE BUILDERS SUMMIT";
export const SPEC_LINES = ["DEC 5, 2026", "LAGOS, NIGERIA"] as const;

export const NAME_MAX_LENGTH = 24;
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 3;
export const ZOOM_STEP = 0.01;

/** The four-point mark from src/lib/icons.tsx, as a polygon in its 80×80 box. */
export const SPARKLE_POINTS: readonly [number, number][] = [
  [40, 12],
  [47.92, 32.08],
  [68, 40],
  [47.92, 47.92],
  [40, 68],
  [32.08, 47.92],
  [12, 40],
  [32.08, 32.08],
];

/** Stroke weight of that mark, as a fraction of its box. */
export const SPARKLE_STROKE = 4 / 80;

/**
 * The hand-drawn rule from src/components/About.tsx, in its 200×14 box, with
 * the shorthand `T` segments resolved to explicit quadratic control points.
 * Original: M0 10 Q20 2 45 8 T95 6 T150 9 T200 4
 */
export const SQUIGGLE_START = 10;
export const SQUIGGLE_SEGMENTS: readonly [number, number, number, number][] = [
  [20, 2, 45, 8],
  [70, 14, 95, 6],
  [120, -2, 150, 9],
  [180, 20, 200, 4],
];
export const SQUIGGLE_BOX = { width: 200, height: 14 } as const;

export type Frame = {
  zoom: number;
  /** Pan, in multiples of the portrait notch — resolution independent. */
  offsetX: number;
  offsetY: number;
};

export const DEFAULT_FRAME: Frame = { zoom: 1, offsetX: 0, offsetY: 0 };

export type Rect = { x: number; y: number; w: number; h: number };

/** The portrait opening: everything the L does not cover. */
export function notchOf(size: number): Rect {
  const x = PLATE.gutter * size;
  return { x, y: 0, w: size - x, h: size - PLATE.band * size };
}

/** How far the portrait can pan before it stops covering the notch. */
export function offsetBounds(imageW: number, imageH: number, zoom: number) {
  if (!imageW || !imageH) return { x: 0, y: 0 };
  const n = notchOf(1);
  const scale = Math.max(n.w / imageW, n.h / imageH) * zoom;
  const w = imageW * scale;
  const h = imageH * scale;
  return {
    x: Math.max(0, (w - n.w) / 2 / n.w),
    y: Math.max(0, (h - n.h) / 2 / n.h),
  };
}

export function clampFrame(frame: Frame, imageW: number, imageH: number): Frame {
  const zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, frame.zoom));
  const bounds = offsetBounds(imageW, imageH, zoom);
  return {
    zoom,
    offsetX: Math.min(bounds.x, Math.max(-bounds.x, frame.offsetX)),
    offsetY: Math.min(bounds.y, Math.max(-bounds.y, frame.offsetY)),
  };
}

/** Cover-fit the portrait in the notch, then apply zoom and pan. */
export function placeImage(
  size: number,
  imageW: number,
  imageH: number,
  frame: Frame,
): Rect {
  const n = notchOf(size);
  const scale = Math.max(n.w / imageW, n.h / imageH) * frame.zoom;
  const w = imageW * scale;
  const h = imageH * scale;
  return {
    x: n.x + (n.w - w) / 2 + frame.offsetX * n.w,
    y: n.y + (n.h - h) / 2 + frame.offsetY * n.h,
    w,
    h,
  };
}

/** Collapse the typed name to a single clean line. */
export function tidyName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function plateFileName(name: string): string {
  const slug = tidyName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `techforge-2026-${slug || "plate"}.png`;
}
