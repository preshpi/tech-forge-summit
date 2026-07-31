const palette = [
  ["var(--color-signal)", "var(--color-ink-soft)"],
  ["var(--color-accent-2)", "var(--color-ink-soft)"],
  ["var(--color-accent-3)", "var(--color-ink-soft)"],
  ["var(--color-signal)", "var(--color-accent-2)"],
  ["var(--color-accent-2)", "var(--color-accent-3)"],
] as const;

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function gradientFor(seed: string) {
  const [from, to] = palette[hash(seed) % palette.length];
  const angle = 100 + (hash(seed + "a") % 180);
  return `linear-gradient(${angle}deg, ${from}22, ${to}55)`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
