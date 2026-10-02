/**
 * Sale dates in the admin forms are typed in the shop's time zone (Chisinau), whatever the browser's or
 * the server's zone, and stored as instants. Pure Intl arithmetic, so the server and the browser render
 * the same field values.
 */
export const SHOP_TIME_ZONE = "Europe/Chisinau";

const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: SHOP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function wallParts(ms: number) {
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
  return p;
}

/** How far the shop's wall clock is ahead of UTC at `ms`. */
function offsetMs(ms: number): number {
  const p = wallParts(ms);
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - Math.floor(ms / 60_000) * 60_000;
}

/** An instant as a datetime-local value ("2026-10-02T18:30") in the shop's time zone; "" for none. */
export function toShopInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return "";
  const p = wallParts(ms);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** A datetime-local value typed in the shop's time zone, as an ISO instant; null when empty or invalid. */
export function fromShopInput(value: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!m) return null;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  let utc = wall - offsetMs(wall);
  utc = wall - offsetMs(utc); // second pass settles the hour around a DST change
  return new Date(utc).toISOString();
}
