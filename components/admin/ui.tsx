import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import { Corners, Diamond } from "@/components/ui/Ornaments";
import { formatAmount } from "@/lib/currency";
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

/** The storefront's section marker (│◇│), small. */
function Marker() {
  return (
    <span aria-hidden className="flex shrink-0 items-center gap-1">
      <span className="h-3 w-px bg-gold-dark" />
      <Diamond className="size-2 border border-gold-light" />
      <span className="h-3 w-px bg-gold-dark" />
    </span>
  );
}

/** An engraved rule held by a small diamond, as under the storefront's section titles. */
export function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-2", className)}>
      <span className="h-px flex-1 bg-gold-dark/50" />
      <Diamond className="size-1.5 border border-gold-dark" />
      <span className="h-px w-10 bg-gold-dark/50" />
    </div>
  );
}

/**
 * A page's title block: the section it belongs to (small caps), the title in the storefront's cast-gold
 * lettering behind its marker, a short muted description, and the page's actions on the right.
 */
export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: string }) {
  return (
    <header className="mb-7 lg:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="mb-2 font-display-ui text-[0.6rem] tracking-[0.24em] text-parchment-muted">{eyebrow}</p>}
          <h1 className="flex items-center gap-3">
            <Marker />
            <span className="text-gold min-w-0 font-display text-2xl leading-tight font-semibold tracking-[0.12em] uppercase sm:text-[1.75rem]">{title}</span>
          </h1>
          {description && <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-parchment-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
      <Rule className="mt-5" />
    </header>
  );
}

/** Blackened panel in the shop's thin dark-gold frame, with an optional titled header strip. */
export function Panel({ title, aside, children, className }: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 border border-gold-dark/45 bg-panel shadow-[inset_0_1px_0_rgb(224_196_135/0.05)]", className)}>
      {title && (
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-iron bg-panel-deep/60 px-5 py-3">
          <h2 className="flex items-center gap-2.5 font-display-ui text-[0.7rem] text-gold-light">
            <Diamond className="size-1.5 bg-gold-dark" />
            {title}
          </h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/** A small link for a panel header's right side ("All orders →"). */
export function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex min-h-8 items-center gap-1.5 font-display-ui text-[0.6rem] text-parchment-muted transition-colors hover:text-gold-light">
      {children}
      <ArrowRight aria-hidden className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** A figure at a glance: small caps label, the number in cast gold, a muted line under it. */
export function StatCard({ label, value, note, href, icon: Icon }: { label: string; value: ReactNode; note?: ReactNode; href?: string; icon?: LucideIcon }) {
  const body = (
    <>
      <Corners />
      {/* A short gold rule over the label, like a plate's engraved edge. */}
      <span aria-hidden className="absolute top-0 left-5 h-px w-10 bg-gold-light/70" />
      <p className="flex items-center justify-between gap-3 font-display-ui text-[0.62rem] tracking-[0.2em] text-parchment-muted">
        {label}
        {Icon && <Icon aria-hidden className="size-4 text-gold-dark transition-colors group-hover:text-gold-light" strokeWidth={1.5} />}
      </p>
      <p className="text-gold mt-3 font-display text-[1.85rem] leading-none font-semibold tabular-nums">{value}</p>
      {note && <p className="mt-2.5 border-t border-iron/70 pt-2.5 text-sm text-parchment-muted">{note}</p>}
    </>
  );
  const cls = "group relative block border border-gold-dark/45 bg-panel px-5 pt-4 pb-4";
  return href ? (
    <Link href={href} className={cn(cls, "transition-colors duration-200 hover:border-gold-light/80 hover:bg-[#130f0b]")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** An intentional "nothing here": the icon in a gold diamond frame, a title and what to do next. */
export function EmptyState({ title, text, action, icon: Icon = Info }: { title: string; text?: ReactNode; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center sm:py-14">
      <span aria-hidden className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-1.5 rotate-45 border border-gold-dark/70 bg-panel-deep" />
        <Icon className="relative size-5 text-gold-light/90" strokeWidth={1.5} />
      </span>
      <p className="mt-5 font-display text-lg tracking-[0.1em] text-parchment uppercase">{title}</p>
      <Rule className="mt-3 w-28 [&>span:last-child]:flex-1" />
      {text && <p className="mt-3 max-w-md text-parchment-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
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
