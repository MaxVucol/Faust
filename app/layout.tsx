import type { Metadata, Viewport } from "next";
import { Cinzel, Crimson_Pro, UnifrakturCook } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SITE_NAME } from "@/lib/catalog";
import "./globals.css";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"] });
const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const unifraktur = UnifrakturCook({ variable: "--font-unifraktur", subsets: ["latin"], weight: "700" });

const description =
  "Magazin online de jocuri video pentru PC și console. Chei originale, livrare imediată și oferte săptămânale.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${SITE_NAME} — Jocuri video`, template: `%s — ${SITE_NAME}` },
  description,
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description,
    images: [{ url: "/images/hero-vault.png", width: 1983, height: 793, alt: "Cavaler privind spre o fortăreață gotică, într-un peisaj montan întunecat" }],
  },
};

export const viewport: Viewport = { themeColor: "#0E0D0B", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${cinzel.variable} ${crimson.variable} ${unifraktur.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#continut"
          className="sr-only z-50 bg-blood px-4 py-2 font-display-ui text-xs focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Sari la conținut
        </a>
        <Navbar />
        <main id="continut" className="relative z-10 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
