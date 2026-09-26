import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Accordion } from "@/components/Accordion";
import { ContactForm } from "@/components/ContactForm";
import { Divider } from "@/components/ui/Divider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SOCIAL_LINKS } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Scrie-ne pentru comenzi, chei de activare sau colaborări. Răspundem în cel mult o zi lucrătoare.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — The Iron Vault", url: "/contact" },
};

const INFO = [
  { Icon: Mail, label: "Email", value: "contact@theironvault.md", href: "mailto:contact@theironvault.md" },
  { Icon: Phone, label: "Telefon", value: "+373 22 000 000", href: "tel:+37322000000" },
  { Icon: Clock, label: "Program", value: "Luni – Vineri, 09:00 – 19:00" },
  { Icon: MapPin, label: "Adresă", value: "Str. Cetății 12, Chișinău" },
];

const FAQ = [
  {
    question: "Cât durează livrarea unei chei?",
    answer: "Cheia ajunge în contul tău și pe email în câteva secunde după confirmarea plății. În cazuri rare, verificarea plății poate dura până la 15 minute.",
  },
  {
    question: "Ce metode de plată acceptați?",
    answer: "Card bancar (Visa, Mastercard), transfer bancar și portofele electronice. Toate plățile sunt procesate securizat.",
  },
  {
    question: "Pot returna un joc?",
    answer: "Cheile neactivate pot fi returnate în 14 zile de la cumpărare. După activare, returul nu mai este posibil, dar te ajutăm cu orice problemă tehnică.",
  },
  {
    question: "Cheia nu funcționează. Ce fac?",
    answer: "Scrie-ne prin formular, alegând subiectul „Problemă cu o cheie de activare”, și atașează o captură a erorii. Rezolvăm în cel mult o zi lucrătoare.",
  },
  {
    question: "Jocurile sunt valabile în regiunea mea?",
    answer: "Pe pagina fiecărui joc apare regiunea de activare. Majoritatea cheilor din catalog sunt valabile global sau în Europa.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">Contact</h1>
        <p className="mt-4 text-parchment-muted">Ai o întrebare despre o comandă sau vrei să colaborăm? Scrie-ne.</p>
      </header>
      <Divider double className="my-10" />

      <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
        <section aria-label="Formular de contact">
          <ContactForm />
        </section>

        <aside aria-labelledby="informatii">
          <h2 id="informatii" className="mb-6 font-display-ui text-xs text-aged-gold">
            Informații
          </h2>
          <ul className="space-y-5">
            {INFO.map(({ Icon, label, value, href }) => (
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
          <Divider className="my-8" />
          <p className="mb-4 font-display-ui text-[0.65rem] text-parchment-muted">Social media</p>
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
        <SectionHeading id="faq-title" title="Întrebări frecvente" />
        <Accordion items={FAQ} />
      </section>
    </div>
  );
}
