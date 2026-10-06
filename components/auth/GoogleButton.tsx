/**
 * "Continue with Google" under the sign-in and registration forms: a divider, then a plain link to
 * /auth/google (a server route that starts the sign-in, lib/auth/google.ts; not prefetched), framed like
 * the page's other secondary buttons. Shown only where Google sign-in is configured.
 */
export function GoogleButton({ next, or, label }: { next: string; or: string; label: string }) {
  const href = next && next !== "/account" ? `/auth/google?next=${encodeURIComponent(next)}` : "/auth/google";
  return (
    <div className="space-y-5">
      <p aria-hidden className="flex items-center gap-3 font-display-ui text-[0.6rem] tracking-[0.28em] text-parchment-muted">
        <span className="h-px flex-1 bg-iron" />
        {or}
        <span className="h-px flex-1 bg-iron" />
      </p>
      <a
        href={href}
        className="flex min-h-12 w-full items-center justify-center gap-3 border border-iron px-5 font-display-ui text-[0.72rem] text-parchment transition-colors hover:border-aged-gold hover:text-gold-light focus-visible:border-aged-gold"
      >
        {/* Google's "G", in the page's own colour. */}
        <svg aria-hidden viewBox="0 0 48 48" className="size-4 shrink-0 fill-current">
          <path d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.6-5.6C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
        </svg>
        {label}
      </a>
    </div>
  );
}
