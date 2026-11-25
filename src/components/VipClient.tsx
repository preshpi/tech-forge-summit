"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

/** Tilts its children toward the pointer (mouse and pen only, so phones scroll normally). */
export function VipTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
      el.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  }

  function reset() {
    cancelAnimationFrame(frame.current);
    ref.current?.style.removeProperty("--tilt-x");
    ref.current?.style.removeProperty("--tilt-y");
  }

  return (
    <div ref={ref} className={className} onPointerMove={onPointerMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}

/** Adds .is-visible to every .vip-reveal element as it scrolls into view. */
export function VipReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".vip-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return null;
}

const UNITS = [
  { label: "Days", ms: 86_400_000, mod: Infinity },
  { label: "Hours", ms: 3_600_000, mod: 24 },
  { label: "Minutes", ms: 60_000, mod: 60 },
  { label: "Seconds", ms: 1_000, mod: 60 },
];

export function VipCountdown({ start }: { start: string }) {
  const target = new Date(start).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 1000);
    Promise.resolve().then(tick);
    return () => window.clearInterval(id);
  }, []);

  const remaining = now === null ? null : Math.max(0, target - now);
  if (remaining === 0) return <p className="vip-countdown__live">It’s today. We can’t wait to welcome you.</p>;

  const values = UNITS.map(({ label, ms, mod }) => ({
    label,
    value: remaining === null ? null : Math.floor(remaining / ms) % mod,
  }));
  const spoken = remaining === null ? "" : values.map(({ value, label }) => `${value} ${label.toLowerCase()}`).join(", ");

  return (
    <div className="vip-countdown" role="timer" aria-label={spoken ? `${spoken} until The TechForge 2.0` : "Countdown loading"}>
      {values.map(({ label, value }) => (
        <div className="vip-countdown__unit" key={label} aria-hidden="true">
          {/* key on the value re-mounts the digit so it plays its flip-in animation */}
          <span className="vip-countdown__value" key={value ?? "x"}>
            {value === null ? "--" : String(value).padStart(2, "0")}
          </span>
          <span className="vip-countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
