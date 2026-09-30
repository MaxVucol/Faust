import type { Metadata } from "next";
import Image from "next/image";
import { Divider } from "@/components/ui/Divider";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BUSINESS } from "@/lib/business";
import { GENRES, PLATFORMS, SITE_NAME } from "@/lib/catalog";
import { LOCALES } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.about.title,
    description: t.meta.aboutDescription,
    alternates: { canonical: "/despre-noi" },
    openGraph: { title: `${t.about.title} — ${SITE_NAME}`, url: "/despre-noi" },
  };
}

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

export default async function AboutPage() {
  const [t, gameCount] = await Promise.all([getDictionary(), prisma.game.count()]);
  const a = t.about;
  // Figures taken from the live catalogue, so they are always true.
  const stats = [
    { value: String(gameCount), label: a.statLabels.games },
    { value: String(GENRES.length), label: a.statLabels.genres },
    { value: String(PLATFORMS.length), label: a.statLabels.platforms },
    { value: String(LOCALES.length), label: a.statLabels.languages },
  ];
  return (
    <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
      {/* Solid surfaces keep the reading columns legible over the lit edges of the background art. */}
      <header className="max-w-3xl border border-iron bg-surface/90 p-6 sm:p-8">
        <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">{a.title}</h1>
        <p className="mt-8 text-xl leading-relaxed">
          {/*
            Initial spanning three lines. Always set in Forum, which covers Latin and Cyrillic, so the
            S (RO), W (EN) and М (RU) come out in the same face and at the same size.
          */}
          <span aria-hidden className="drop-cap font-[family-name:var(--font-forum)] text-[4.2em]! text-aged-gold">
            {a.intro[0]}
          </span>
          <span className="sr-only">{a.intro[0]}</span>
          {a.intro.slice(1)}
        </p>
        {BUSINESS.isDemo && <p className="mt-6 border-l border-gold-dark pl-3 text-sm text-parchment-muted">{t.common.demoNotice}</p>}
      </header>

      <Divider double className="my-14" />

      <FadeIn>
        <section aria-labelledby="poveste" className="max-w-3xl border border-iron bg-surface/90 p-6 sm:p-8">
          <SectionHeading id="poveste" title={a.storyTitle} />
          <ol>
            {a.chapters.map((c, i) => (
              <li key={c.year} className="border-b border-iron py-8 first:pt-2 last:border-b-0 last:pb-0">
                <p className="font-display-ui text-[0.7rem] text-parchment-muted">{c.year}</p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-[0.12em] uppercase">
                  {a.chapter(NUMERALS[i], c.title)}
                </h3>
                <p className="mt-3">{c.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </FadeIn>

      <FadeIn className="mt-16">
        <section aria-labelledby="principii">
          <SectionHeading id="principii" title={a.principlesTitle} />
          <div className="grid gap-px border border-iron bg-iron sm:grid-cols-2 lg:grid-cols-4">
            {a.principles.map((p) => (
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
          <SectionHeading id="echipa" title={a.teamTitle} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.team.map((m, i) => (
              <li key={m.name} className="border border-iron bg-surface">
                <div className="relative aspect-square border-b border-iron">
                  <Image src={`/images/team/${i + 1}.jpg`} alt={a.portraitAlt(m.name)} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold tracking-[0.1em] uppercase">{m.name}</h3>
                  <p className="text-base text-parchment-muted">{m.role}</p>
                  <p className="mt-3 text-sm text-parchment-muted">
                    {a.favorite} <span className="text-parchment">{m.favorite}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      <FadeIn className="mt-16">
        <section aria-label={a.statsAria}>
          <Divider double />
          <dl className="grid gap-10 py-12 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
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
