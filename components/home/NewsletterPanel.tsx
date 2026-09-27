import { NewsletterForm } from "@/components/NewsletterForm";
import { getDictionary } from "@/lib/i18n/server";

export async function NewsletterPanel() {
  const t = await getDictionary();
  return (
    <section aria-labelledby="newsletter-title" className="relative border border-gold-dark bg-[#100d0a] px-6 py-8 glow-gold sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="newsletter-title" className="font-display text-lg font-semibold tracking-[0.15em] uppercase">
            {t.newsletter.title}
          </h2>
          <p className="mt-1 text-base text-parchment-muted">
            {t.newsletter.text}
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
