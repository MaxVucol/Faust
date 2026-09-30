import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.contact.faqTitle,
    description: t.contact.faq[0]?.answer,
    alternates: { canonical: "/intrebari-frecvente" },
    openGraph: { title: `${t.contact.faqTitle} — ${SITE_NAME}`, url: "/intrebari-frecvente" },
  };
}

export default async function FaqPage() {
  const t = await getDictionary();
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumbs label={t.common.breadcrumbs} className="mb-6" items={[{ label: t.nav.home, href: "/" }, { label: t.contact.faqTitle }]} />
      <h1 className="font-display text-[1.75rem] leading-tight font-semibold tracking-[0.08em] uppercase sm:text-4xl sm:tracking-[0.12em]">{t.contact.faqTitle}</h1>
      <Divider double className="my-10" />
      <Accordion items={t.contact.faq} />
      <p className="mt-10 text-base text-parchment-muted">
        {t.contact.intro}{" "}
        <Link href="/contact" className="text-aged-gold underline-offset-4 hover:text-gold-light hover:underline">
          {t.contact.title}
        </Link>
      </p>
    </div>
  );
}
