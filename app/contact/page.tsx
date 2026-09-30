import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Accordion } from "@/components/Accordion";
import { ContactForm } from "@/components/ContactForm";
import { Divider } from "@/components/ui/Divider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SOCIAL_LINKS } from "@/components/ui/SocialIcons";
import { SITE_NAME } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { BUSINESS } from "@/lib/business";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.contact.title,
    description: t.meta.contactDescription,
    alternates: { canonical: "/contact" },
    openGraph: { title: `${t.contact.title} — ${SITE_NAME}`, url: "/contact" },
  };
}

export default async function ContactPage() {
  const t = await getDictionary();
  const c = t.contact;
  const info = [
    { Icon: Mail, label: c.info.email, value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
    { Icon: Phone, label: c.info.phone, value: BUSINESS.phone.display, href: `tel:${BUSINESS.phone.tel}` },
    { Icon: Clock, label: c.info.hours, value: c.info.hoursValue },
    { Icon: MapPin, label: c.info.address, value: c.info.addressValue },
  ];

  return (
    <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">{c.title}</h1>
        <p className="mt-4 text-parchment-muted">{c.intro}</p>
      </header>
      <Divider double className="my-10" />

      <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
        <section aria-label={c.formAria}>
          <ContactForm />
        </section>

        <aside aria-labelledby="informatii">
          <h2 id="informatii" className="mb-6 font-display-ui text-xs text-aged-gold">
            {c.infoTitle}
          </h2>
          <ul className="space-y-5">
            {info.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex gap-3">
                <Icon aria-hidden className="mt-1.5 size-4 shrink-0 text-parchment-muted" />
                <div>
                  <p className="font-display-ui text-[0.65rem] text-parchment-muted">{label}</p>
                  {href ? (
                    <a href={href} className="hover:text-aged-gold">
                      {value}
                    </a>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {BUSINESS.isDemo && <p className="mt-6 border-l border-gold-dark pl-3 text-sm text-parchment-muted">{t.common.demoNotice}</p>}
          <Divider className="my-8" />
          <p className="mb-4 font-display-ui text-[0.65rem] text-parchment-muted">{c.social}</p>
          <ul className="space-y-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-aged-gold">
                  <Icon className="size-4 text-parchment-muted" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section id="faq" aria-labelledby="faq-title" className="mt-20 max-w-3xl scroll-mt-24">
        <SectionHeading id="faq-title" title={c.faqTitle} />
        <Accordion items={c.faq} />
      </section>
    </div>
  );
}
