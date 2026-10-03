import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Notice, PageHeader, Panel, Pill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_FRESHNESS, SESSION_MAX_AGE, sessionSecretSource } from "@/lib/auth/session";
import { SHOP_TIME_ZONE } from "@/lib/admin/time";
import { PAGE_SIZE, PLATFORMS, SITE_NAME } from "@/lib/catalog";
import { CURRENCIES, DEFAULT_CURRENCY, formatAmount, RATES_PER_UNIT } from "@/lib/currency";
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES } from "@/lib/i18n/config";
import { getAdminI18n } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.settings };
}

/** One setting: its name, its current value, and where it is changed (a file or the environment). */
function Row({ label, value, where }: { label: string; value: ReactNode; where: string }) {
  return (
    <div className="grid gap-1 border-b border-iron/55 px-5 py-3.5 last:border-b-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
      <dt className="pt-1 font-display-ui text-[0.58rem] tracking-[0.18em] text-parchment-muted">{label}</dt>
      <dd className="min-w-0">
        <div className="break-words text-parchment">{value}</div>
        <p className="mt-1 text-xs break-words text-parchment-muted/80">{where}</p>
      </dd>
    </div>
  );
}

/**
 * The settings that shape the live site, as they are now. They live in the code and in the deployment's
 * environment (so they are versioned and reviewed with the code), not in the database; each row says
 * where to change it (file and variable names stay as they are in the code). Secrets are never shown,
 * only whether they are set.
 */
export default async function SettingsPage() {
  const [, { t }] = await Promise.all([requireAdmin(), getAdminI18n()]);
  const S = t.settings;
  const yes = (on: boolean) => <Pill tone={on ? "green" : "red"}>{on ? S.configured : S.notConfigured}</Pill>;
  const telegram = Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim());
  const siteUrlFromEnv = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
  const secretSource = sessionSecretSource();
  return (
    <>
      <PageHeader title={S.title} description={S.description} />
      <div className="mb-6">
        <Notice tone="info">{S.notice}</Notice>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={S.panels.general}>
          <dl>
            <Row label={S.storeName} value={SITE_NAME} where="lib/catalog.ts · SITE_NAME" />
            <Row label={S.publicAddress} value={SITE_URL} where={siteUrlFromEnv ? S.env("NEXT_PUBLIC_SITE_URL") : S.vercelDomain} />
            <Row
              label={S.signIn}
              value={<>{yes(secretSource !== null)} · {S.signInValue(SESSION_MAX_AGE / 86400, ADMIN_FRESHNESS / 3600)}</>}
              where={secretSource === "ADMIN_SESSION_SECRET" ? S.signInLegacy : S.signInWhere}
            />
            <Row label={S.timeZone} value={SHOP_TIME_ZONE} where="lib/admin/time.ts" />
          </dl>
        </Panel>
        <Panel title={S.panels.store}>
          <dl>
            <Row label={S.orderNotifications} value={<>{yes(telegram)} Telegram</>} where={S.env("TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID")} />
            <Row label={S.orderRecords} value={S.orderRecordsValue} where="app/actions.ts · placeOrder" />
            <Row label={S.platforms} value={PLATFORMS.map((p) => p.name).join(", ")} where="lib/catalog.ts · PLATFORMS" />
            <Row label={S.batchSize} value={S.batchSizeValue(PAGE_SIZE)} where="lib/catalog.ts · PAGE_SIZE" />
            <Row label={S.formLimits} value={S.formLimitsValue} where="app/actions.ts" />
          </dl>
        </Panel>
        <Panel title={S.panels.currency}>
          <dl>
            <Row label={S.storeCurrency} value={S.storeCurrencyValue} where={S.storeCurrencyWhere} />
            <Row label={S.defaultCurrency} value={DEFAULT_CURRENCY} where="lib/currency.ts · DEFAULT_CURRENCY" />
            <Row
              label={S.rates}
              value={
                <ul className="space-y-0.5">
                  {CURRENCIES.filter((c) => c !== "MDL").map((c) => (
                    <li key={c} className="tabular-nums">1 {c} = {formatAmount(RATES_PER_UNIT[c], "MDL")}</li>
                  ))}
                </ul>
              }
              where={S.ratesWhere}
            />
          </dl>
        </Panel>
        <Panel title={S.panels.localization}>
          <dl>
            <Row label={S.languages} value={LOCALES.map((l) => LOCALE_NAMES[l]).join(", ")} where="lib/i18n/config.ts · LOCALES" />
            <Row label={S.defaultLanguage} value={LOCALE_NAMES[DEFAULT_LOCALE]} where="lib/i18n/config.ts · DEFAULT_LOCALE" />
            <Row label={S.interfaceTexts} value={S.interfaceTextsValue} where="lib/i18n/dictionaries/ · lib/i18n/admin/" />
            <Row label={S.gameDescriptions} value={S.gameDescriptionsValue} where={S.gameDescriptionsWhere} />
          </dl>
        </Panel>
        <Panel title={S.panels.seo} className="xl:col-span-2">
          <dl>
            <Row label={S.canonical} value={SITE_URL} where={S.canonicalWhere} />
            <Row label={S.indexing} value={S.indexingValue} where="app/robots.ts · metadata" />
            <Row label={S.sitemap} value={S.sitemapValue(`${SITE_URL}/sitemap.xml`)} where="app/sitemap.ts" />
            <Row label={S.titles} value={S.titlesValue} where="lib/i18n/dictionaries/ (meta)" />
          </dl>
        </Panel>
      </div>
    </>
  );
}
