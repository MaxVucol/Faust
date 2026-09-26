"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl tracking-[0.15em] uppercase">Ceva s-a stricat</h1>
      <p className="mt-4 text-parchment-muted">
        Nu am putut încărca pagina. Dacă problema persistă, verifică conexiunea la baza de date.
      </p>
      <Button className="mt-8" onClick={reset}>
        Încearcă din nou
      </Button>
    </div>
  );
}
