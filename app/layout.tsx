import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, EB_Garamond, Forum } from "next/font/google";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SITE_NAME } from "@/lib/catalog";
import { getFavorites } from "@/lib/favorites-server";
import { INTL_LOCALES, OG_LOCALES } from "@/lib/i18n/config";
import { getCurrency, getI18n } from "@/lib/i18n/server";
import "./globals.css";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"] });
// Forum: the drop-cap initial on the About page (Latin + Cyrillic).
const forum = Forum({ variable: "--font-forum", subsets: ["latin", "latin-ext", "cyrillic"], weight: "400" });
// EB Garamond: the whole interface, in every language.
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
// High-contrast editorial serif for brand statements (has Cyrillic).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: `${SITE_NAME} — ${t.meta.siteSuffix}`, template: `%s — ${SITE_NAME}` },
    description: t.meta.description,
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale],
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: t.meta.description,
      images: [{ url: "/images/hero-vault.png", width: 1983, height: 793, alt: t.meta.heroAlt }],
    },
  };
}

export const viewport: Viewport = { themeColor: "#0E0D0B", colorScheme: "dark" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [{ locale, t }, currency, favorites] = await Promise.all([getI18n(), getCurrency(), getFavorites()]);
  const fonts = [cinzel, forum, garamond, cormorant].map((f) => f.variable).join(" ");
  return (
    <html lang={INTL_LOCALES[locale]} className={fonts}>
      <body className="flex min-h-screen flex-col">
        <I18nProvider locale={locale} currency={currency}>
          <FavoritesProvider initial={favorites}>
            <a
              href="#continut"
              className="sr-only z-50 bg-blood px-4 py-2 font-display-ui text-xs focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
            >
              {t.common.skipToContent}
            </a>
            <Navbar />
            <main id="continut" className="relative z-10 flex-1">
              {children}
            </main>
            <Footer />
          </FavoritesProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
