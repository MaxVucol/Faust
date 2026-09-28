/**
 * Display currencies. Prices are stored in MDL; other currencies are converted for display only,
 * at fixed reference rates (update RATES_PER_UNIT when they drift).
 */
export const CURRENCIES = ["MDL", "RON", "EUR", "USD", "RUB"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "MDL";
export const CURRENCY_COOKIE = "currency";

/** How many MDL one unit of each currency is worth. */
export const RATES_PER_UNIT: Record<Currency, number> = {
  MDL: 1,
  RON: 3.9,
  EUR: 19.5,
  USD: 17.5,
  RUB: 0.21,
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}

export function fromMdl(amountMdl: number, currency: Currency): number {
  return amountMdl / RATES_PER_UNIT[currency];
}

export function toMdl(amount: number, currency: Currency): number {
  return amount * RATES_PER_UNIT[currency];
}

/** "299.99 MDL", "€15.38", "$17.14", "1428.52 ₽", "76.92 RON". */
export function formatMoney(amountMdl: number, currency: Currency): string {
  const v = fromMdl(amountMdl, currency).toFixed(2);
  if (currency === "EUR") return `€${v}`;
  if (currency === "USD") return "$" + v;
  if (currency === "RUB") return `${v} ₽`;
  if (currency === "RON") return `${v} RON`;
  return `${v} MDL`;
}
