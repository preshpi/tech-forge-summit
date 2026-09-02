"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-12-05T09:00:00-06:00").getTime();

function getRemaining() {
  const now = Date.now();
  const diff = Math.max(0, EVENT_DATE - now);
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { day, hours, minutes, seconds };
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
      {String(time.day).padStart(2, "0")}D.
      {String(time.hours).padStart(2, "0")}H.
      {String(time.minutes).padStart(2, "0")}M.
      {String(time.seconds).padStart(2, "0")}s
    </span>
  );
}

type CountdownTickerProps = {
  className?: string;
};

export function CountdownTicker({ className = "" }: CountdownTickerProps) {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    const updateTime = () => setTime(getRemaining());
    const id = window.setInterval(updateTime, 1000);

    Promise.resolve().then(updateTime);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time?.day },
    { label: "Hours", value: time?.hours },
    { label: "Minutes", value: time?.minutes },
    { label: "Seconds", value: time?.seconds },
  ];

  const accessibleTime = time
    ? `${time.day} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds until TechForge`
    : "Countdown loading";

  return (
    <div
      className={`hero-countdown ${className}`}
      role="timer"
      aria-label={accessibleTime}
    >
      {units.map(({ label, value }) => {
        const displayValue = value == null ? "--" : String(value).padStart(2, "0");

        return (
          <div key={label} className="hero-countdown-unit" aria-hidden="true">
            <span className="hero-countdown-value-window">
              <span key={displayValue} className="hero-countdown-value">
                {displayValue}
              </span>
            </span>
            <span className="hero-countdown-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
