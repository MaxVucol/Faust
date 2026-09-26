import type { Metadata } from "next";
import Image from "next/image";
import { Divider } from "@/components/ui/Divider";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Despre noi",
  description: "Povestea The Iron Vault: un magazin de jocuri construit de jucători, pentru jucători.",
  alternates: { canonical: "/despre-noi" },
  openGraph: { title: "Despre noi — The Iron Vault", url: "/despre-noi" },
};

const CHAPTERS = [
  {
    numeral: "I",
    title: "Începuturile",
    year: "2018",
    text: "Totul a pornit dintr-o cameră închiriată din Chișinău și dintr-o colecție de jocuri pe care nimeni nu o mai voia. Vindeam chei una câte una, răspundeam personal la fiecare mesaj și învățam ce înseamnă încrederea unui client.",
  },
  {
    numeral: "II",
    title: "Cetatea",
    year: "2020",
    text: "Am construit propriul magazin online și am semnat primele parteneriate directe cu distribuitori. Catalogul a crescut la câteva sute de titluri, dar am păstrat regula de la început: vindem doar jocuri pe care le-am juca noi înșine.",
  },
  {
    numeral: "III",
    title: "Breasla",
    year: "2023",
    text: "Echipa a ajuns la doisprezece oameni, iar comunitatea noastră a depășit zece mii de membri. Am introdus ofertele săptămânale și suportul non-stop.",
  },
  {
    numeral: "IV",
    title: "Drumul înainte",
    year: "2026",
    text: "Astăzi livrăm în toată regiunea și lucrăm cu studiouri independente pentru lansări exclusive. Cronica nu s-a încheiat, iar următorul capitol îl scriem împreună cu voi.",
  },
];

const PRINCIPLES = [
  { title: "Chei originale", text: "Fiecare cheie provine direct de la editori sau de la distribuitori autorizați. Fără piețe gri, fără surprize." },
  { title: "Livrare imediată", text: "Cheia ajunge în contul și în emailul tău în câteva secunde de la confirmarea plății, la orice oră." },
  { title: "Suport real", text: "Îți răspund oameni, nu scripturi. Rezolvăm orice problemă de activare în cel mult o zi lucrătoare." },
  { title: "Prețuri corecte", text: "Fără taxe ascunse la finalul comenzii. Prețul afișat este prețul pe care îl plătești." },
];

const TEAM = [
  { name: "Andrei Rusu", role: "Fondator", favorite: "Dark Souls" },
  { name: "Elena Ciobanu", role: "Director de catalog", favorite: "The Witcher 3" },
  { name: "Victor Moraru", role: "Suport clienți", favorite: "Bloodborne" },
  { name: "Irina Lungu", role: "Parteneriate", favorite: "Crusader Kings III" },
];

const STATS = [
  { value: "3.200+", label: "Jocuri în catalog" },
  { value: "48.000", label: "Comenzi livrate" },
  { value: "8 ani", label: "De activitate" },
  { value: "< 1 min", label: "Timp mediu de livrare" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">Despre noi</h1>
        <p className="mt-8 text-xl leading-relaxed">
          <span aria-hidden className="float-left mt-1 mr-3 font-fraktur text-7xl leading-[0.8] text-aged-gold">
            S
          </span>
          <span className="sr-only">S</span>
          untem un magazin de jocuri construit de jucători, pentru jucători. Misiunea noastră este simplă: să aducem
          jocurile bune la prețuri cinstite, cu livrare imediată și cu oameni reali în spatele fiecărei comenzi. Nu urmărim
          tendințe, ci jocuri care rămân în memorie mult după ultimul credit.
        </p>
      </header>

      <Divider double className="my-14" />

      <FadeIn>
        <section aria-labelledby="poveste" className="max-w-3xl">
          <SectionHeading id="poveste" title="Cronica" />
          <ol>
            {CHAPTERS.map((c) => (
              <li key={c.numeral} className="border-b border-iron py-8 first:pt-2">
                <p className="font-display-ui text-[0.7rem] text-parchment-muted">{c.year}</p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-[0.12em] uppercase">
                  Capitolul {c.numeral} — {c.title}
                </h3>
                <p className="mt-3">{c.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </FadeIn>

      <FadeIn className="mt-16">
        <section aria-labelledby="principii">
          <SectionHeading id="principii" title="Principii" />
          <div className="grid gap-px border border-iron bg-iron sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-surface p-6">
                <h3 className="font-display text-base font-semibold tracking-[0.12em] text-aged-gold uppercase">{p.title}</h3>
                <p className="mt-3 text-base text-parchment-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn className="mt-16">
        <section aria-labelledby="echipa">
          <SectionHeading id="echipa" title="Echipa" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <li key={m.name} className="border border-iron bg-surface">
                <div className="relative aspect-square border-b border-iron">
                  <Image src={`/images/team/${i + 1}.jpg`} alt={`Portret ${m.name}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold tracking-[0.1em] uppercase">{m.name}</h3>
                  <p className="text-base text-parchment-muted">{m.role}</p>
                  <p className="mt-3 text-sm text-parchment-muted">
                    Jocul preferat: <span className="text-parchment">{m.favorite}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      <FadeIn className="mt-16">
        <section aria-label="Cifre-cheie">
          <Divider double />
          <dl className="grid gap-10 py-12 text-center sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-parchment-muted">{s.label}</dt>
                <dd className="font-display text-4xl font-semibold tracking-[0.08em] text-parchment">{s.value}</dd>
              </div>
            ))}
          </dl>
          <Divider double />
        </section>
      </FadeIn>
    </div>
  );
}
