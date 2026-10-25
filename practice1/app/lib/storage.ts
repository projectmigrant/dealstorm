import { useSyncExternalStore } from "react";

type Area = "local" | "session";

const listeners = new Set<() => void>();

function storageOf(area: Area) {
  return area === "local" ? window.localStorage : window.sessionStorage;
}

export function readItem(area: Area, key: string): string | null {
  try {
    return storageOf(area).getItem(key);
  } catch {
    return null;
  }
}

export function writeItem(area: Area, key: string, value: string | null) {
  try {
    if (value === null) storageOf(area).removeItem(key);
    else storageOf(area).setItem(key, value);
  } catch {
    // 瀏覽器封鎖儲存空間時就略過，網站照常運作
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// 伺服器端與水合期間回傳 undefined，代表「還不知道」
export function useStoredItem(area: Area, key: string) {
  return useSyncExternalStore(
    subscribe,
    () => readItem(area, key),
    () => undefined
  );
}

export const STORAGE_KEYS = {
  name: "dealstorm:name",
  skipName: "dealstorm:skip-name",
  draw: "dealstorm:lucky-draw",
  gameBest: "dealstorm:catch-best",
} as const;
