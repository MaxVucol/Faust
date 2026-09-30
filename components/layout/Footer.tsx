import Image from "next/image";
import Link from "next/link";
import { Diamond } from "@/components/ui/Ornaments";
import { SOCIAL_LINKS } from "@/components/ui/SocialIcons";
import { SITE_NAME } from "@/lib/catalog";
import { INFO_PAGE_ROUTES } from "@/lib/i18n/info-pages";
import { getDictionary } from "@/lib/i18n/server";
import { BUSINESS } from "@/lib/business";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-6 font-display-ui text-[0.7rem] text-aged-gold">{title}</h2>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-base text-parchment/80 transition-colors duration-300 hover:text-gold-light"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mirrors the header: same near-black panel, same single gold hairline, same logo lockup. */
export async function Footer() {
  const t = await getDictionary();
  const l = t.footer.links;
  return (
    <footer className="relative z-10 mt-24 border-t border-gold-dark bg-[#0a0907]">
      {/* Small gold diamond set into the boundary line, centred. */}
      <Diamond className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 border border-gold-light bg-[#0a0907]" />

      <div className="mx-auto grid max-w-page gap-12 px-4 pt-16 pb-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-brand text-xl font-semibold tracking-[0.15em] whitespace-nowrap text-aged-gold uppercase"
          >
            <Image src="/images/logo-tv.png" alt="" width={262} height={320} unoptimized className="h-14 w-auto" />
            {SITE_NAME}
          </Link>
          <p className="mt-6 max-w-xs text-base leading-relaxed text-parchment-muted">
            {t.footer.tagline}
          </p>
          <ul className="mt-8 flex gap-6">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="block text-parchment-muted transition-colors duration-300 hover:text-gold-light"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Every link has its own destination; nothing shares a placeholder route. */}
        <FooterColumn
          title={t.footer.shop}
          links={[
            { href: "/produse", label: l.games },
            { href: "/produse?sale=1", label: l.deals },
            { href: "/produse?released=1&sort=newest", label: l.newReleases },
            { href: "/#genuri", label: l.genres },
          ]}
        />
        <FooterColumn
          title={t.footer.information}
          links={[
            { href: "/despre-noi", label: l.about },
            { href: INFO_PAGE_ROUTES.delivery, label: l.delivery },
            { href: "/intrebari-frecvente", label: l.faq },
            { href: INFO_PAGE_ROUTES.privacy, label: l.privacy },
            { href: INFO_PAGE_ROUTES.terms, label: l.terms },
          ]}
        />
        <FooterColumn
          title={t.footer.support}
          links={[
            { href: "/contact", label: l.contact },
            { href: `mailto:${BUSINESS.email}`, label: BUSINESS.email },
          ]}
        />
      </div>

      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <hr className="border-0 border-t border-gold-dark/40" />
        <div className="flex flex-col gap-2 py-7 text-sm text-parchment-muted sm:flex-row sm:justify-between">
          <p>{t.footer.rights(new Date().getFullYear(), SITE_NAME)}</p>
          <p className="flex gap-5">
            <Link href={INFO_PAGE_ROUTES.terms} className="hover:text-gold-light">
              {l.terms}
            </Link>
            <Link href={INFO_PAGE_ROUTES.privacy} className="hover:text-gold-light">
              {l.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
