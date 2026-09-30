import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";
import { INFO_PAGE_ROUTES, infoPages, type InfoPageKey } from "@/lib/i18n/info-pages";
import { getI18n } from "@/lib/i18n/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export async function infoPageMetadata(key: InfoPageKey): Promise<Metadata> {
  const { locale } = await getI18n();
  const page = infoPages[locale][key];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: INFO_PAGE_ROUTES[key] },
    openGraph: { title: `${page.title} — ${SITE_NAME}`, description: page.description, url: INFO_PAGE_ROUTES[key] },
  };
}

/** Shared layout for the footer's informational pages: title, intro, then titled sections. */
export async function InfoPageView({ pageKey }: { pageKey: InfoPageKey }) {
  const { locale, t } = await getI18n();
  const page = infoPages[locale][pageKey];
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumbs label={t.common.breadcrumbs} className="mb-6" items={[{ label: t.nav.home, href: "/" }, { label: page.title }]} />
      <h1 className="font-display text-[1.75rem] leading-tight font-semibold tracking-[0.08em] uppercase sm:text-4xl sm:tracking-[0.12em]">{page.title}</h1>
      <p className="mt-4 text-lg text-parchment-muted">{page.intro}</p>
      <Divider double className="my-10" />
      <div className="space-y-10">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display-ui text-sm text-aged-gold">{section.title}</h2>
            <div className="mt-3 space-y-3 text-lg leading-relaxed">
              {section.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-12 text-base">
        <Link href="/contact" className="text-aged-gold underline-offset-4 hover:text-gold-light hover:underline">
          {t.contact.title}
        </Link>
      </p>
    </div>
  );
}
