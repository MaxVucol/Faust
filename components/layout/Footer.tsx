import Image from "next/image";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";
import { SOCIAL_LINKS } from "@/components/ui/SocialIcons";
import { PLATFORMS, SITE_NAME } from "@/lib/catalog";
import { NAV_LINKS } from "./nav-links";

const INFO_LINKS = [
  { href: "/contact#faq", label: "Livrare și plată" },
  { href: "/contact#faq", label: "Politica de confidențialitate" },
  { href: "/contact#faq", label: "Termeni și condiții" },
  { href: "/contact#faq", label: "Întrebări frecvente" },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 font-display-ui text-[0.7rem] text-parchment-muted">{title}</h2>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-base text-parchment transition-colors duration-300 hover:text-aged-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-20 bg-surface">
      <Divider double />
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="flex items-center gap-4 font-display text-lg font-semibold tracking-[0.15em] text-aged-gold uppercase">
            <Image src="/images/logo-mark.png" alt="" width={124} height={192} unoptimized className="h-20 w-auto" />
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-xs text-base text-parchment-muted">
            Magazin online de jocuri video. Pentru cei care nu se mulțumesc cu puțin.
          </p>
          <ul className="mt-6 flex gap-5">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="block text-parchment-muted transition-colors duration-300 hover:text-aged-gold"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <FooterColumn title="Linkuri rapide" links={NAV_LINKS.map((l) => ({ href: l.href, label: l.label }))} />
        <FooterColumn
          title="Platforme"
          links={PLATFORMS.map((p) => ({ href: `/produse?platform=${encodeURIComponent(p.name)}`, label: p.name }))}
        />
        <FooterColumn title="Informații" links={INFO_LINKS} />
      </div>
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Divider />
        <div className="flex flex-col gap-2 py-6 text-sm text-parchment-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Toate drepturile rezervate.</p>
          <p>Jocuri. Pasiune. Fără compromisuri.</p>
        </div>
      </div>
    </footer>
  );
}
