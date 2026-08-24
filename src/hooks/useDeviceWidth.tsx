"use client";

import { useSyncExternalStore } from "react";

const SERVER_WIDTH = 0;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);

  return () => window.removeEventListener("resize", onStoreChange);
}

function getSnapshot() {
  return window.innerWidth;
}

function getServerSnapshot() {
  return SERVER_WIDTH;
}

/**
 * Returns the current browser viewport width in pixels.
 *
 * During server rendering and the initial hydration pass, the width is `0`.
 */
export function useDeviceWidth(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useDeviceWidth;
