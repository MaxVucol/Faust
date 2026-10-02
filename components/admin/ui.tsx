import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import { Diamond } from "@/components/ui/Ornaments";
import { formatAmount } from "@/lib/currency";
import { Emblem, type EmblemKind } from "./Emblem";
import { cn } from "@/lib/utils";

/*
 * The panel's design system. It speaks the storefront's language (components/ui: the same parchment,
 * iron and antique-gold tokens from app/globals.css, the gold section marker, the thin dark-gold frames),
 * set denser and quieter for daily work: gold marks what matters, everything else stays iron and parchment.
 */

/** Admin dates: day, month and year (and time) in one fixed format, whatever the shop's language. */
export const adminDate = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Europe/Chisinau" }).format(d);
export const adminDateTime = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Chisinau" }).format(d);
export const mdl = (v: number) => formatAmount(Math.round(v * 100) / 100, "MDL");

/* ── Buttons ─────────────────────────────────────────────────────────────────────────────────────── */

const BUTTON = {
  /** The one main action of a view: solid antique gold, dark lettering (the checkout's gold button). */
  primary: "border border-gold-light bg-gold-light text-ink hover:border-[#cfab68] hover:bg-[#cfab68] active:translate-y-px active:bg-aged-gold",
  /** Secondary actions: a thin dark-gold frame with gold lettering, a faint fill on hover. */
  secondary: "border border-gold-dark/80 text-gold-light hover:border-gold-light hover:bg-gold-light/[0.07] hover:text-[#e0c487]",
  /** Neutral actions (Cancel, Reset, row tools): iron frame that warms to gold on hover. */
  ghost: "border border-iron text-parchment-muted hover:border-aged-gold hover:text-parchment",
  /** Opens a destructive step: burgundy outline, never a bright red fill. */
  danger: "border border-blood/70 text-blood-text hover:border-blood-text hover:bg-blood/15",
  /** Confirms a destructive step, inside its dialog only. */
  "danger-solid": "border border-blood bg-blood text-parchment hover:border-blood-hover hover:bg-blood-hover",
  /** Text-only actions beside a framed one (Reset, Remove sale). */
  quiet: "border border-transparent text-parchment-muted hover:text-parchment",
  "quiet-danger": "border border-transparent text-blood-text hover:bg-blood/10",
} as const;

export type ButtonVariant = keyof typeof BUTTON;

/**
 * Classes for a <button> or <Link>: `sm` for toolbars and rows, `md` for form actions, `icon` for a 40px
 * square. `className` is for layout only (margins, width); it must not repeat a property set here.
 */
export function btn(variant: ButtonVariant = "secondary", size: "sm" | "md" | "icon" = "sm", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 font-display-ui whitespace-nowrap transition-[background-color,border-color,color,translate] duration-200 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-40",
    size === "sm" && "min-h-10 px-4 text-[0.65rem]",
    size === "md" && "min-h-11 px-5 text-[0.68rem]",
    size === "icon" && "size-10 text-[0.65rem]",
    BUTTON[variant],
    className,
  );
}

/** "← All orders": the way back from a detail page. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group mb-3 inline-flex min-h-10 items-center gap-2 font-display-ui text-[0.62rem] text-parchment-muted transition-colors hover:text-gold-light">
      <ArrowLeft aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
}

/* ── Headings and frames ─────────────────────────────────────────────────────────────────────────── */

/** An engraved rule held by a small diamond at its centre, as under the storefront's section titles. */
export function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-2", className)}>
      <span className="h-px flex-1 bg-gradient-to-r from-gold-dark/10 to-gold-dark/60" />
      <Diamond className="size-1.5 border border-gold-light/80" />
      <span className="h-px flex-1 bg-gradient-to-l from-gold-dark/10 to-gold-dark/60" />
    </div>
  );
}

/** Four small gold ticks just inside a frame's corners (the frame must be `relative`). */
export function Ticks() {
  const tick = "pointer-events-none absolute size-1.5 border-gold-light/55";
  return (
    <>
      <span aria-hidden className={cn(tick, "top-[3px] left-[3px] border-t border-l")} />
      <span aria-hidden className={cn(tick, "top-[3px] right-[3px] border-t border-r")} />
      <span aria-hidden className={cn(tick, "bottom-[3px] left-[3px] border-b border-l")} />
      <span aria-hidden className={cn(tick, "right-[3px] bottom-[3px] border-r border-b")} />
    </>
  );
}

/** A page's title block: a gold diamond and the title, a short muted description, the page's actions on the right. */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 lg:mb-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-3.5">
            <Diamond className="size-2 bg-gold-light" />
            <span className="min-w-0 font-display text-[1.75rem] leading-tight font-semibold tracking-[0.12em] text-parchment uppercase sm:text-[2.1rem]">{title}</span>
          </h1>
          {description && <p className="mt-1 max-w-3xl pl-[1.4rem] text-base leading-relaxed text-parchment-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
      <Rule className="mt-4" />
    </header>
  );
}

/** Panel surface: near-black over the vault-hall background, in the shop's thin dark-gold frame. */
const surface = "relative min-w-0 border border-gold-dark/50 bg-[#0d0b08]/90 shadow-[0_10px_30px_rgb(0_0_0/0.35)]";

/** A titled panel: an icon and the title in small gold caps over an inset rule, corner ticks on the frame. */
export function Panel({ title, icon: Icon, aside, children, className }: { title?: string; icon?: LucideIcon; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn(surface, className)}>
      <Ticks />
      {title && (
        <div className="mx-3 flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-gold-dark/30 px-2 py-1">
          <h2 className="flex items-center gap-2.5 font-display-ui text-[0.7rem] text-gold-light">
            {Icon ? <Icon aria-hidden className="size-4 text-gold-light/90" strokeWidth={1.6} /> : <Diamond className="size-1.5 bg-gold-dark" />}
            {title}
          </h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/** A small link for a panel header's right side ("All orders"). */
export function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex min-h-8 items-center gap-1.5 text-sm text-parchment-muted transition-colors hover:text-gold-light">
      {children}
      <ArrowRight aria-hidden className="size-3 opacity-0 transition-[opacity,translate] group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}

/**
 * A figure at a glance: an icon and small caps label, the number, a muted line under it. `emblem` sets
 * the section's heraldic medallion (components/admin/Emblem.tsx) into the card's right side.
 */
export function StatCard({ label, value, note, href, icon: Icon, emblem }: { label: string; value: ReactNode; note?: ReactNode; href?: string; icon?: LucideIcon; emblem?: EmblemKind }) {
  const body = (
    <>
      {emblem && <Emblem kind={emblem} className="pointer-events-none absolute top-1/2 right-5 size-[7.25rem] -translate-y-1/2 opacity-75 transition-opacity duration-500 group-hover:opacity-100" />}
      <Ticks />
      <p className="relative flex items-center gap-3 font-display-ui text-[0.64rem] tracking-[0.2em] text-parchment">
        {Icon && <Icon aria-hidden className="size-5 text-gold-light/90" strokeWidth={1.4} />}
        {label}
      </p>
      <p className="relative mt-2.5 font-display text-[2.1rem] leading-none font-semibold whitespace-nowrap text-[#e2cf9f] tabular-nums [text-shadow:0_0_10px_#0a0907,0_0_20px_#0a0907]">{value}</p>
      {note && <p className="relative mt-2.5 text-sm text-parchment-muted">{note}</p>}
    </>
  );
  const cls = cn(surface, "group block overflow-hidden px-5 pt-5 pb-4");
  return href ? (
    <Link href={href} className={cn(cls, "transition-colors duration-200 hover:border-gold-light/80")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** An intentional "nothing here": the icon in a small gold frame, a title and what to do next. */
export function EmptyState({ title, text, action, icon: Icon = Info }: { title: string; text?: ReactNode; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center sm:py-9">
      <span aria-hidden className="flex size-10 items-center justify-center border border-gold-dark/70 bg-panel-deep/80">
        <Icon className="size-[18px] text-gold-light/90" strokeWidth={1.5} />
      </span>
      <p className="mt-3 font-display text-[1.05rem] font-semibold tracking-[0.08em] text-parchment">{title}</p>
      {text && <p className="mt-1 max-w-md text-[0.95rem] leading-snug text-parchment-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ── Feedback ────────────────────────────────────────────────────────────────────────────────────── */

export function Notice({ tone, children }: { tone: "success" | "error" | "info"; children: ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : tone === "info" ? Info : CircleCheck;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 border border-l-2 bg-panel px-4 py-3 text-base",
        tone === "success" && "border-iron border-l-stock-in text-parchment",
        tone === "error" && "border-blood/50 border-l-blood-text bg-blood/[0.08] text-blood-text",
        tone === "info" && "border-iron border-l-aged-gold text-parchment",
      )}
    >
      <Icon aria-hidden className={cn("mt-1 size-4 shrink-0", tone === "success" && "text-stock-in", tone === "info" && "text-gold-light")} strokeWidth={1.75} />
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
  green: "border-stock-in/50 bg-stock-in/[0.06] text-stock-in",
  red: "border-stock-out/50 bg-stock-out/[0.06] text-stock-out",
  gold: "border-aged-gold/60 bg-gold-light/[0.06] text-gold-light",
  muted: "border-iron text-parchment-muted",
};

/** A status tag: small caps in a thin frame, led by a diamond in its colour. */
export function Pill({ tone = "muted", children }: { tone?: keyof typeof PILL; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 border px-2 py-0.5 font-display-ui text-[0.58rem] leading-5 whitespace-nowrap", PILL[tone])}>
      <Diamond className="size-1 bg-current opacity-80" />
      {children}
    </span>
  );
}

export const ORDER_TONE: Record<string, keyof typeof PILL> = { new: "gold", processing: "gold", completed: "green", cancelled: "red" };
export const PAYMENT_TONE: Record<string, keyof typeof PILL> = { unpaid: "muted", paid: "green", refunded: "red" };

/* ── Tables and lists ────────────────────────────────────────────────────────────────────────────── */

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
export const th = "border-b border-gold-dark/35 bg-panel-deep/70 px-3.5 py-3 font-display-ui text-[0.6rem] font-normal tracking-[0.18em] text-parchment-muted whitespace-nowrap";
export const td = "border-b border-iron/55 px-3.5 py-3 align-middle";
/** A body row (or list item link): a faint warm light on hover. */
export const tr = "transition-colors duration-150 hover:bg-gold-light/[0.035]";

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
  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <p className="text-sm text-parchment-muted">
        {total} total · page <span className="text-parchment tabular-nums">{page}</span> of <span className="tabular-nums">{pages}</span>
      </p>
      <div className="flex gap-2">
        {page > 1 ? <Link className={btn("ghost")} href={href(page - 1)}>Previous</Link> : <span aria-disabled="true" className={btn("ghost")}>Previous</span>}
        {page < pages ? <Link className={btn("ghost")} href={href(page + 1)}>Next</Link> : <span aria-disabled="true" className={btn("ghost")}>Next</span>}
      </div>
    </nav>
  );
}

/** Search and filters as a plain GET form, so every view is a shareable URL and works without JS. */
export function FilterBar({ children, basePath, active }: { children: ReactNode; basePath: string; active: boolean }) {
  return (
    <form method="get" action={basePath} className="flex flex-col gap-3 border-b border-iron bg-panel-deep/40 px-5 py-4 md:flex-row md:flex-wrap md:items-end">
      {children}
      <div className="flex gap-2">
        <button type="submit" className={btn("secondary", "md")}>
          Apply
        </button>
        {active && (
          <Link href={basePath} className={btn("quiet", "md")}>
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}

export const filterField = "min-h-11 w-full border border-iron bg-base px-3 text-base text-parchment placeholder:text-parchment-muted/60 transition-colors hover:border-bronze focus:border-aged-gold md:w-auto";
export const filterLabel = "mb-1.5 block font-display-ui text-[0.58rem] tracking-[0.18em] text-parchment-muted";

/* ── Dialogs ─────────────────────────────────────────────────────────────────────────────────────── */

/** A modal <dialog>'s frame, body and action row (confirmations, the sale editor). */
export const dialogFrame = "m-auto w-[min(30rem,calc(100vw-2rem))] border border-gold-dark/70 bg-panel p-0 text-parchment shadow-[inset_0_2px_0_rgb(192_154_85/0.35),0_24px_60px_rgb(0_0_0/0.7)] backdrop:bg-black/75";
export const dialogBody = "px-6 pt-6 pb-5";
export const dialogActions = "flex flex-col-reverse gap-3 border-t border-iron bg-panel-deep/60 px-6 py-4 sm:flex-row sm:justify-end";

/** A dialog's title: the gold rule over it ties the box to the panel's frames. */
export function DialogTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <>
      <h2 id={id} className="font-display text-xl tracking-[0.06em] text-parchment">
        {children}
      </h2>
      <Rule className="mt-3 w-24 [&>span:last-child]:hidden" />
    </>
  );
}
