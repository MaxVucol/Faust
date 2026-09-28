"use server";

import { cookies } from "next/headers";
import { CURRENCY_COOKIE, isCurrency } from "../currency";
import { isLocale, LOCALE_COOKIE } from "./config";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Persists the chosen language; the server re-renders every page in it from then on. */
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
}

/** Persists the chosen display currency. */
export async function setCurrency(currency: string): Promise<void> {
  if (!isCurrency(currency)) return;
  (await cookies()).set(CURRENCY_COOKIE, currency, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
}
