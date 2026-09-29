export const BLESSING_KEY = "khramam.blessings.v1";
export type Blessings = { count: number; lastDay: string };
export const EMPTY_BLESSINGS: Blessings = { count: 0, lastDay: "" };

export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function readBlessings(raw: string | null): Blessings {
  if (!raw) return EMPTY_BLESSINGS;
  try {
    const value = JSON.parse(raw);
    if (Number.isSafeInteger(value?.count) && value.count >= 0 && typeof value.lastDay === "string" && (value.lastDay === "" || /^\d{4}-\d{2}-\d{2}$/.test(value.lastDay))) return { count: value.count, lastDay: value.lastDay };
  } catch {}
  return EMPTY_BLESSINGS;
}

export function receiveBlessing(current: Blessings, day: string): Blessings {
  if (current.lastDay >= day || current.count === Number.MAX_SAFE_INTEGER) return current;
  return { count: current.count + 1, lastDay: day };
}
