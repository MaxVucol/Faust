import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Notice, PageHeader, Panel, Pill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { SESSION_MAX_AGE, sessionsConfigured } from "@/lib/admin/session";
import { SHOP_TIME_ZONE } from "@/lib/admin/time";
import { PAGE_SIZE, PLATFORMS, SITE_NAME } from "@/lib/catalog";
import { CURRENCIES, DEFAULT_CURRENCY, formatAmount, RATES_PER_UNIT } from "@/lib/currency";
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Settings" };

function Row({ label, value, where }: { label: string; value: ReactNode; where: string }) {
  return (
    <div className="grid gap-1 border-b border-iron/60 px-5 py-3.5 last:border-b-0 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-parchment-muted">{label}</dt>
      <dd className="min-w-0">
        <div className="break-words">{value}</div>
        <p className="mt-0.5 text-xs text-parchment-muted">{where}</p>
      </dd>
    </div>
  );
}

const yes = (on: boolean, onText = "Configured", offText = "Not configured") => <Pill tone={on ? "green" : "red"}>{on ? onText : offText}</Pill>;

/**
 * The settings that shape the live site, as they are now. They live in the code and in the deployment's
 * environment (so they are versioned and reviewed with the code), not in the database; each row says
 * where to change it. Secrets are never shown, only whether they are set.
 */
export default async function SettingsPage() {
  await requireAdmin();
  const telegram = Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim());
  const siteUrlFromEnv = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
  return (
    <>
      <PageHeader title="Settings" description="How the shop is configured right now." />
      <div className="mb-6">
        <Notice tone="info">These settings are part of the code and the hosting environment, so a change goes live with the next deploy. Nothing here is edited from the panel.</Notice>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="General">
          <dl>
            <Row label="Store name" value={SITE_NAME} where="lib/catalog.ts · SITE_NAME" />
            <Row label="Public address" value={SITE_URL} where={siteUrlFromEnv ? "Environment: NEXT_PUBLIC_SITE_URL" : "Vercel's production domain (NEXT_PUBLIC_SITE_URL not set)"} />
            <Row label="Admin sign-in" value={<>{yes(sessionsConfigured())} · sessions last {SESSION_MAX_AGE / 3600} hours</>} where="Environment: ADMIN_SESSION_SECRET (32+ characters)" />
            <Row label="Time zone for sale dates" value={SHOP_TIME_ZONE} where="lib/admin/time.ts" />
          </dl>
        </Panel>
        <Panel title="Store">
          <dl>
            <Row label="Order notifications" value={<>{yes(telegram)} Telegram</>} where="Environment: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID" />
            <Row label="Order records" value="Saved for the admin panel once the shop is notified" where="app/actions.ts · placeOrder" />
            <Row label="Platforms" value={PLATFORMS.map((p) => p.name).join(", ")} where="lib/catalog.ts · PLATFORMS" />
            <Row label="Catalogue batch size" value={`${PAGE_SIZE} games per “Load more”`} where="lib/catalog.ts · PAGE_SIZE" />
            <Row label="Form limits" value="Orders 3, contact 3, newsletter 5 per visitor per 10 minutes" where="app/actions.ts" />
          </dl>
        </Panel>
        <Panel title="Currency">
          <dl>
            <Row label="Store currency" value="MDL — prices are stored and charged in MDL" where="Game prices (Games)" />
            <Row label="Default display currency" value={DEFAULT_CURRENCY} where="lib/currency.ts · DEFAULT_CURRENCY" />
            <Row
              label="Display rates"
              value={
                <ul className="space-y-0.5">
                  {CURRENCIES.filter((c) => c !== "MDL").map((c) => (
                    <li key={c} className="tabular-nums">1 {c} = {formatAmount(RATES_PER_UNIT[c], "MDL")}</li>
                  ))}
                </ul>
              }
              where="lib/currency.ts · RATES_PER_UNIT (fixed reference rates)"
            />
          </dl>
        </Panel>
        <Panel title="Localization">
          <dl>
            <Row label="Languages" value={LOCALES.map((l) => LOCALE_NAMES[l]).join(", ")} where="lib/i18n/config.ts · LOCALES" />
            <Row label="Default language" value={LOCALE_NAMES[DEFAULT_LOCALE]} where="lib/i18n/config.ts · DEFAULT_LOCALE" />
            <Row label="Interface texts" value="One dictionary per language" where="lib/i18n/dictionaries/" />
            <Row label="Game descriptions" value="Per game, in each language" where="Games → Description" />
          </dl>
        </Panel>
        <Panel title="SEO" className="xl:col-span-2">
          <dl>
            <Row label="Canonical base" value={SITE_URL} where="Same as the public address" />
            <Row label="Indexing" value="All public pages; cart, favourites and /admin are noindex" where="app/robots.ts and each page's metadata" />
            <Row label="Sitemap" value={`${SITE_URL}/sitemap.xml · every game, rebuilt hourly`} where="app/sitemap.ts" />
            <Row label="Titles and descriptions" value="Per language; games use their title and description" where="lib/i18n/dictionaries/ (meta) · Games" />
          </dl>
        </Panel>
      </div>
    </>
  );
}
