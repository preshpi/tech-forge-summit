"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-12-05T09:00:00-06:00").getTime();

function getRemaining() {
  const now = Date.now();
  const diff = Math.max(0, EVENT_DATE - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    // Defer the first update to a microtask so we don't setState synchronously
    // during the effect body (avoids cascading render warnings) while still
    // showing real numbers as soon as possible after mount.
    Promise.resolve().then(() => setTime(getRemaining()));
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return <span className={`font-mono tabular-nums ${className}`}>--D.--H.--M.--s</span>;
  }

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {String(time.days).padStart(2, "0")}D.
      {String(time.hours).padStart(2, "0")}H.
      {String(time.minutes).padStart(2, "0")}M.
      {String(time.seconds).padStart(2, "0")}s
    </span>
  );
}
