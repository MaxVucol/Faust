import type { Metadata } from "next";
import { AdminI18nProvider } from "@/components/admin/AdminI18n";
import { getAdminI18n } from "@/lib/i18n/server";

/** Everything under /admin: never indexed. Access is checked by each page and action (lib/admin/auth.ts). */
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return {
    title: { default: t.meta.admin, template: t.meta.template },
    robots: { index: false, follow: false },
  };
}

/** The panel's texts follow the site's language (the `lang` cookie); client components read them from here. */
export default async function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  const { locale } = await getAdminI18n();
  return <AdminI18nProvider locale={locale}>{children}</AdminI18nProvider>;
}
