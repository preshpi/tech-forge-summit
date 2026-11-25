// Colors mirror public/assets/tokens.css. Canvas can't read CSS variables
// reliably across browsers, so the values are repeated here.
export type ThemeId = "light" | "blue" | "yellow" | "pink";

type Sparkle = "pink" | "yellow" | "blue";

export type DpTheme = {
  id: ThemeId;
  label: string;
  text: string;
  muted: string;
  /** Solid color, or a [from, to] pair drawn as a 145° linear gradient. */
  ring: string | [string, string];
  /** Big sparkle, small sparkle. */
  sparkles: [Sparkle, Sparkle];
  /** The "2.0" sticker. */
  tag: { background: string; text: string };
  /** Swatch shown on the theme button. */
  swatch: string;
  background: string;
  logo: string;
  placeholder: string;
  placeholderLabel: string;
};

export const PINK = "#D90F57";
export const YELLOW = "#FFD400";

export const THEMES: Record<ThemeId, DpTheme> = {
  light: {
    id: "light",
    label: "Light",
    text: "#151A2D",
    muted: "#4A5272",
    ring: ["#3A47D5", "#7C6CF0"],
    sparkles: ["pink", "yellow"],
    tag: { background: PINK, text: "#FFFFFF" },
    swatch: "#E9EDFB",
    background: "/assets/background-light.svg",
    logo: "/assets/techforge-logo-blue.png",
    placeholder: "/assets/photo-placeholder-light.svg",
    placeholderLabel: "#151A2D",
  },
  blue: {
    id: "blue",
    label: "Blue",
    text: "#FFFFFF",
    muted: "#DCE1FF",
    ring: "#FFFFFF",
    sparkles: ["yellow", "pink"],
    tag: { background: PINK, text: "#FFFFFF" },
    swatch: "#3340C8",
    background: "/assets/background-blue.svg",
    logo: "/assets/techforge-logo-white.png",
    placeholder: "/assets/photo-placeholder-blue.svg",
    placeholderLabel: "#FFFFFF",
  },
  yellow: {
    id: "yellow",
    label: "Yellow",
    text: "#151A2D",
    muted: "#574A00",
    ring: ["#3A47D5", "#7C6CF0"],
    sparkles: ["pink", "blue"],
    tag: { background: PINK, text: "#FFFFFF" },
    swatch: "#FFD400",
    background: "/assets/background-yellow.svg",
    logo: "/assets/techforge-logo-blue.png",
    placeholder: "/assets/photo-placeholder-yellow.svg",
    placeholderLabel: "#151A2D",
  },
  pink: {
    id: "pink",
    label: "Pink",
    text: "#FFFFFF",
    muted: "#FFF0F5",
    ring: "#FFFFFF",
    sparkles: ["yellow", "blue"],
    // A pink sticker would vanish on the pink background.
    tag: { background: YELLOW, text: "#151A2D" },
    swatch: "#D90E57",
    background: "/assets/background-pink.svg",
    logo: "/assets/techforge-logo-white.png",
    placeholder: "/assets/photo-placeholder-pink.svg",
    placeholderLabel: "#FFFFFF",
  },
};

export const SPARKLE_SRC = {
  pink: "/assets/sparkle-pink.svg",
  yellow: "/assets/sparkle-yellow.svg",
  blue: "/assets/sparkle-blue.svg",
} as const;
