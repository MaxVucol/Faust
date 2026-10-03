import { DEFAULT_LOCALE, type Locale } from "../config";
import { en } from "./en";
import { ro, type AdminDictionary } from "./ro";
import { ru } from "./ru";

export type { AdminDictionary };

/** The admin panel's texts per language (the storefront's are in ../dictionaries). */
export const adminDictionaries: Record<Locale, AdminDictionary> = { ro, ru, en };

/** The texts for `locale`, or the default language's if it has none (never undefined). */
export function adminDictionary(locale: Locale): AdminDictionary {
  return adminDictionaries[locale] ?? adminDictionaries[DEFAULT_LOCALE];
}
