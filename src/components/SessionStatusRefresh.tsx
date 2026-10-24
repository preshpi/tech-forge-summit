"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SessionStatusRefresh({ deadlines }: { deadlines: number[] }) {
  const router = useRouter();
  const nextDeadline = deadlines.filter(Boolean).sort((a, b) => a - b)[0];

  useEffect(() => {
    if (!nextDeadline) return;
    const timer = window.setTimeout(() => router.refresh(), Math.max(0, nextDeadline - Date.now() + 1000));
    return () => window.clearTimeout(timer);
  }, [nextDeadline, router]);

  return null;
}
