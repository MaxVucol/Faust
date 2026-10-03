"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { adminDictionary, type AdminDictionary } from "@/lib/i18n/admin";

type AdminI18nValue = { locale: Locale; t: AdminDictionary };

const AdminI18nContext = createContext<AdminI18nValue | null>(null);

/**
 * Gives the panel's client components its texts in the language the server rendered with, as the
 * storefront's I18nProvider does for the shop. Only the locale crosses the boundary (texts hold functions).
 */
export function AdminI18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <AdminI18nContext.Provider value={{ locale, t: adminDictionary(locale) }}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n(): AdminI18nValue {
  const value = useContext(AdminI18nContext);
  if (!value) throw new Error("useAdminI18n must be used inside <AdminI18nProvider>");
  return value;
}
