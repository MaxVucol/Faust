import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-6xl text-aged-gold">404</p>
      <h1 className="mt-4 font-display text-2xl tracking-[0.15em] uppercase">Pagina nu există</h1>
      <p className="mt-4 text-parchment-muted">Drumul acesta nu duce nicăieri. Întoarce-te în cetate.</p>
      <ButtonLink href="/" className="mt-8">
        Înapoi acasă
      </ButtonLink>
    </div>
  );
}
