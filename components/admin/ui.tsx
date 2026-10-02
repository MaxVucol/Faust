import Link from "next/link";
import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Inbox } from "lucide-react";
import { Diamond } from "@/components/ui/Ornaments";
import { formatAmount } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** Admin dates: day, month and year (and time) in one fixed format, whatever the shop's language. */
export const adminDate = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Europe/Chisinau" }).format(d);
export const adminDateTime = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Chisinau" }).format(d);
export const mdl = (v: number) => formatAmount(Math.round(v * 100) / 100, "MDL");

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-gold-dark/40 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-[0.12em] text-parchment uppercase sm:text-3xl">
          <Diamond className="size-2 shrink-0 bg-gold-dark" />
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-parchment-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

/** Blackened panel with the shop's thin gold frame. */
export function Panel({ title, aside, children, className }: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 border border-gold-dark/50 bg-[#100d0a]", className)}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-iron px-5 py-3.5">
          <h2 className="font-display-ui text-[0.72rem] text-gold-light">{title}</h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, note, href }: { label: string; value: ReactNode; note?: ReactNode; href?: string }) {
  const body = (
    <>
      <p className="font-display-ui text-[0.68rem] text-parchment-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-gold-light tabular-nums">{value}</p>
      {note && <p className="mt-1 text-sm text-parchment-muted">{note}</p>}
    </>
  );
  const cls = "block border border-gold-dark/50 bg-[#100d0a] px-5 py-4";
  return href ? (
    <Link href={href} className={cn(cls, "transition-colors hover:border-gold-light")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span aria-hidden className="flex size-12 items-center justify-center border border-gold-dark/60">
        <Inbox className="size-5 text-gold-light" strokeWidth={1.5} />
      </span>
      <p className="mt-4 font-display text-lg tracking-[0.08em] text-parchment">{title}</p>
      {text && <p className="mt-1 max-w-md text-parchment-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ tone, children }: { tone: "success" | "error" | "info"; children: ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 border-l-2 px-4 py-3 text-base",
        tone === "success" && "border-stock-in bg-stock-in/[0.06] text-parchment",
        tone === "error" && "border-blood-text bg-blood/10 text-blood-text",
        tone === "info" && "border-aged-gold bg-aged-gold/[0.06] text-parchment",
      )}
    >
      <Icon aria-hidden className="mt-1 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Success messages after a redirect, by code (never text from the URL). */
const NOTICES: Record<string, string> = { deleted: "Deleted.", created: "Created.", saved: "Saved." };

export function UrlNotice({ code }: { code: string | string[] | undefined }) {
  const text = typeof code === "string" ? NOTICES[code] : undefined;
  return text ? (
    <div className="mb-6">
      <Notice tone="success">{text}</Notice>
    </div>
  ) : null;
}

const PILL: Record<string, string> = {
  green: "border-stock-in/60 text-stock-in",
  red: "border-stock-out/60 text-stock-out",
  gold: "border-aged-gold/70 text-gold-light",
  muted: "border-iron text-parchment-muted",
};

export function Pill({ tone = "muted", children }: { tone?: keyof typeof PILL; children: ReactNode }) {
  return <span className={cn("inline-block border px-2 py-0.5 font-display-ui text-[0.6rem] leading-5 whitespace-nowrap", PILL[tone])}>{children}</span>;
}

export const ORDER_TONE: Record<string, keyof typeof PILL> = { new: "gold", processing: "gold", completed: "green", cancelled: "red" };
export const PAYMENT_TONE: Record<string, keyof typeof PILL> = { unpaid: "muted", paid: "green", refunded: "red" };

/**
 * Table frame: scrolls sideways inside itself on narrow screens, never the page. It is positioned, so
 * absolutely placed content inside (screen-reader-only labels) stays within the scroll area too.
 */
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-base">{children}</table>
    </div>
  );
}
export const th = "border-b border-iron px-4 py-3 font-display-ui text-[0.62rem] font-normal text-parchment-muted whitespace-nowrap";
export const td = "border-b border-iron/60 px-4 py-3 align-middle";

/** Links that keep the current filters. */
export function Pagination({ page, pages, total, params, basePath }: { page: number; pages: number; total: number; params: Record<string, string | string[] | undefined>; basePath: string }) {
  if (pages <= 1) return <p className="px-5 py-3 text-sm text-parchment-muted">{total} total</p>;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (k !== "page" && k !== "notice" && typeof v === "string" && v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return q ? `${basePath}?${q}` : basePath;
  };
  const link = "flex min-h-10 min-w-10 items-center justify-center border border-iron px-3 text-sm transition-colors hover:border-aged-gold";
  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <p className="text-sm text-parchment-muted">
        {total} total · page {page} of {pages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? <Link className={link} href={href(page - 1)}>Previous</Link> : <span className={cn(link, "opacity-40")}>Previous</span>}
        {page < pages ? <Link className={link} href={href(page + 1)}>Next</Link> : <span className={cn(link, "opacity-40")}>Next</span>}
      </div>
    </nav>
  );
}

/** Search and filters as a plain GET form, so every view is a shareable URL and works without JS. */
export function FilterBar({ children, basePath, active }: { children: ReactNode; basePath: string; active: boolean }) {
  return (
    <form method="get" action={basePath} className="flex flex-col gap-3 border-b border-iron px-5 py-4 md:flex-row md:flex-wrap md:items-end">
      {children}
      <div className="flex gap-2">
        <button type="submit" className="min-h-11 border border-gold-dark/80 px-4 font-display-ui text-[0.68rem] text-gold-light transition-colors hover:border-gold-light hover:bg-gold-light/[0.08]">
          Apply
        </button>
        {active && (
          <Link href={basePath} className="flex min-h-11 items-center px-3 font-display-ui text-[0.68rem] text-parchment-muted hover:text-parchment">
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}

export const filterField = "min-h-11 w-full border border-iron bg-base px-3 text-base text-parchment focus:border-aged-gold md:w-auto";
export const filterLabel = "mb-1 block font-display-ui text-[0.6rem] text-parchment-muted";
