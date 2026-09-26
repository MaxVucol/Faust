import { NewsletterForm } from "@/components/NewsletterForm";

export function NewsletterPanel() {
  return (
    <section aria-labelledby="newsletter-title" className="border border-iron bg-surface px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="newsletter-title" className="font-display text-lg font-semibold tracking-[0.15em] uppercase">
            Abonează-te la newsletter
          </h2>
          <p className="mt-1 text-base text-parchment-muted">
            Fii primul care află despre noile lansări, ofertele speciale și noutățile din lumea jocurilor.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
