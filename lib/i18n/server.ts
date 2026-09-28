import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { CURRENCY_COOKIE, DEFAULT_CURRENCY, isCurrency, type Currency } from "../currency";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

/** The visitor's chosen language, from the cookie set by the language selector. */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
});

/** The visitor's chosen display currency, from the cookie set by the currency selector. */
export const getCurrency = cache(async (): Promise<Currency> => {
  const value = (await cookies()).get(CURRENCY_COOKIE)?.value;
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
});

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}

/** Locale and dictionary together, for server components that also format dates. */
export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
