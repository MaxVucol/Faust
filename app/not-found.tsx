import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = await getDictionary();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-6xl text-aged-gold">404</p>
      <h1 className="mt-4 font-display text-2xl tracking-[0.15em] uppercase">{t.errors.notFoundTitle}</h1>
      <p className="mt-4 text-parchment-muted">{t.errors.notFoundText}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/">{t.errors.backHome}</ButtonLink>
        <ButtonLink href="/produse" variant="ghost">
          {t.errors.browseGames}
        </ButtonLink>
      </div>
    </div>
  );
}
