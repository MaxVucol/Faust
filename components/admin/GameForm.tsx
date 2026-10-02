"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { saveGame } from "@/app/admin/actions";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Diamond } from "@/components/ui/Ornaments";
import { Select } from "@/components/ui/Select";
import { GENRES, PLATFORMS } from "@/lib/catalog";
import { emptyVariant, formToInput, slugify, type GameFormValues, type VariantValues } from "@/lib/admin/game-form";
import { gameSchema, IMAGE_PATH, issuesByPath } from "@/lib/admin/schemas";
import { SHOP_TIME_ZONE } from "@/lib/admin/time";
import { cn } from "@/lib/utils";
import { btn, Notice } from "./ui";

function Field({ id, label, error, hint, children, className }: { id: string; label: string; error?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-blood-text">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-sm text-parchment-muted">{hint}</p>
      )}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border border-gold-dark/50 bg-[#0d0b08]/90 px-5 pt-3 pb-6 shadow-[0_10px_30px_rgb(0_0_0/0.35)] sm:px-6">
      <legend className="flex items-center gap-2.5 px-2.5 font-display-ui text-[0.7rem] text-gold-light">
        <Diamond className="size-1.5 bg-gold-dark" />
        {title}
      </legend>
      {description && <p className="mb-5 max-w-3xl text-sm text-parchment-muted">{description}</p>}
      {children}
    </fieldset>
  );
}

function Preview({ src, label, ratio }: { src: string; label: string; ratio: string }) {
  const ok = IMAGE_PATH.test(src.trim());
  return (
    <div className={cn("relative w-full overflow-hidden border border-gold-dark/50 bg-panel-deep", ratio)}>
      {ok ? <Image key={src} src={src.trim()} alt={label} fill unoptimized className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-parchment-muted">No image</span>}
    </div>
  );
}

const LANGS = [
  { key: "ro", label: "Romanian" },
  { key: "ru", label: "Russian" },
  { key: "en", label: "English" },
] as const;

/**
 * Create or edit a game: every field the catalogue stores, except the PC system requirements (kept as
 * they are). Values are checked with the same schema as the server before sending; the server checks
 * again and its field messages are shown under the fields. Saving disables the form.
 */
export function GameForm({ id, initial }: { id: string | null; initial: GameFormValues }) {
  const router = useRouter();
  const [f, setF] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [slugTouched, setSlugTouched] = useState(id !== null);
  const [lang, setLang] = useState<"ro" | "ru" | "en">("ro");
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof GameFormValues>(key: K, value: GameFormValues[K]) => setF((v) => ({ ...v, [key]: value }));
  const setVariant = (i: number, patch: Partial<VariantValues>) => setF((v) => ({ ...v, variants: v.variants.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const toggle = (key: "genres" | "platforms", name: string) => setF((v) => ({ ...v, [key]: v[key].includes(name) ? v[key].filter((x) => x !== name) : [...v[key], name] }));
  const err = (path: string) => errors[path];
  const aria = (path: string, id: string) => ({ "aria-invalid": err(path) ? true : undefined, "aria-describedby": err(path) ? `${id}-error` : undefined });

  const showErrors = (fieldErrors: Record<string, string>, text: string) => {
    setErrors(fieldErrors);
    setMessage({ tone: "error", text });
    // Bring the first invalid field into view.
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center" });
      const descLang = Object.keys(fieldErrors).find((k) => k.startsWith("description."))?.split(".")[1];
      if (descLang === "ro" || descLang === "ru" || descLang === "en") setLang(descLang);
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const input = formToInput(f);
    const local = gameSchema.safeParse(input);
    if (!local.success) return showErrors(issuesByPath(local.error), "Check the highlighted fields.");
    setMessage(null);
    start(async () => {
      const result = await saveGame(id, input);
      if (!result.ok) return showErrors(result.fieldErrors ?? {}, result.error);
      setErrors({});
      if (!id && result.id) {
        router.push(`/admin/games/${result.id}?notice=created`);
        return;
      }
      setMessage({ tone: "success", text: result.message ?? "Saved." });
      router.refresh();
    });
  };

  const salePercent = (price: string, sale: string) => {
    const p = Number(price), s = Number(sale);
    return sale && p > 0 && s >= 0 && s < p ? Math.round(((p - s) / p) * 100) : null;
  };
  const gamePercent = salePercent(f.price, f.discountPrice);

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={pending || undefined} className="space-y-6">
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <fieldset disabled={pending} className="min-w-0 space-y-6">
        <Section title="Basics">
          <div className="grid gap-5 md:grid-cols-2">
            <Field id="title" label="Title" error={err("title")}>
              <Input id="title" value={f.title} onChange={(e) => setF((v) => ({ ...v, title: e.target.value, slug: slugTouched ? v.slug : slugify(e.target.value) }))} {...aria("title", "title")} />
            </Field>
            <Field id="slug" label="Slug" error={err("slug")} hint={<>Page address: /produse/{f.slug || "…"}. Changing it breaks old links.</>}>
              <Input id="slug" value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} {...aria("slug", "slug")} />
            </Field>
            <Field id="developer" label="Developer" error={err("developer")}>
              <Input id="developer" value={f.developer} onChange={(e) => set("developer", e.target.value)} {...aria("developer", "developer")} />
            </Field>
            <Field id="publisher" label="Publisher" error={err("publisher")}>
              <Input id="publisher" value={f.publisher} onChange={(e) => set("publisher", e.target.value)} {...aria("publisher", "publisher")} />
            </Field>
            <Field id="releaseDate" label="Release date" error={err("releaseDate")} hint="Games released in the last 90 days show as New release automatically.">
              <Input id="releaseDate" type="date" value={f.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} {...aria("releaseDate", "releaseDate")} />
            </Field>
            <Field id="rating" label="Store rating (0–10, optional)" error={err("rating")} hint="The Iron Vault's own score; leave empty until the game is rated.">
              <Input id="rating" inputMode="decimal" value={f.rating} onChange={(e) => set("rating", e.target.value)} {...aria("rating", "rating")} />
            </Field>
          </div>
          <div className="mt-5">
            <Checkbox id="featured" label="Featured on the home page and first in the catalogue" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
          </div>
        </Section>

        <Section title="Description" description="Shown on the game page in the visitor's language; a missing language falls back to another one.">
          <div role="tablist" aria-label="Description language" className="mb-4 flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.key}
                type="button"
                role="tab"
                aria-selected={lang === l.key}
                onClick={() => setLang(l.key)}
                className={cn("min-h-10 border px-4 font-display-ui text-[0.64rem] transition-colors", lang === l.key ? "border-gold-light bg-gold-light/[0.07] text-gold-light" : "border-iron text-parchment-muted hover:border-aged-gold hover:text-parchment", err(`description.${l.key}`) && "border-blood-text")}
              >
                {l.label}
                {f.description[l.key].trim() ? "" : " · empty"}
              </button>
            ))}
          </div>
          {LANGS.map((l) => (
            <div key={l.key} hidden={lang !== l.key}>
              <Field id={`description-${l.key}`} label={`Description (${l.label})`} error={err(`description.${l.key}`)} hint="Separate paragraphs with a blank line.">
                <Textarea id={`description-${l.key}`} value={f.description[l.key]} onChange={(e) => setF((v) => ({ ...v, description: { ...v.description, [l.key]: e.target.value } }))} className="min-h-56" {...aria(`description.${l.key}`, `description-${l.key}`)} />
              </Field>
            </div>
          ))}
        </Section>

        <Section title="Genres and platforms">
          <div className="grid gap-6 md:grid-cols-2">
            <div role="group" aria-labelledby="genres-label" aria-describedby={err("genres") ? "genres-error" : undefined}>
              <p id="genres-label" className="mb-2 font-display-ui text-[0.7rem] text-parchment-muted">Genres</p>
              <div className="grid grid-cols-2 gap-x-4">
                {GENRES.map((g) => <Checkbox key={g.name} id={`genre-${g.slug}`} label={g.name} checked={f.genres.includes(g.name)} onChange={() => toggle("genres", g.name)} aria-invalid={err("genres") ? true : undefined} />)}
              </div>
              {err("genres") && <p id="genres-error" className="mt-1.5 text-sm text-blood-text">{err("genres")}</p>}
            </div>
            <div role="group" aria-labelledby="platforms-label" aria-describedby={err("platforms") ? "platforms-error" : undefined}>
              <p id="platforms-label" className="mb-2 font-display-ui text-[0.7rem] text-parchment-muted">Platforms</p>
              {PLATFORMS.map((p) => <Checkbox key={p.name} id={`platform-${p.short}`} label={p.name} checked={f.platforms.includes(p.name)} onChange={() => toggle("platforms", p.name)} aria-invalid={err("platforms") ? true : undefined} />)}
              {err("platforms") && <p id="platforms-error" className="mt-1.5 text-sm text-blood-text">{err("platforms")}</p>}
            </div>
          </div>
        </Section>

        <Section title="Price and stock" description={`Prices are in MDL, the store's currency; other currencies are converted on the site. Sale dates are ${SHOP_TIME_ZONE.replace("Europe/", "")} time.`}>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field id="price" label="Price (MDL)" error={err("price")}>
              <Input id="price" inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} {...aria("price", "price")} />
            </Field>
            <Field id="stock" label="Keys in stock" error={err("stock")} hint="0 shows the game as out of stock.">
              <Input id="stock" inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value)} {...aria("stock", "stock")} />
            </Field>
            <Field id="discountPrice" label="Sale price (optional)" error={err("discountPrice")} hint={gamePercent !== null ? `−${gamePercent}% while the sale runs` : "Leave empty for no sale."}>
              <Input id="discountPrice" inputMode="decimal" value={f.discountPrice} onChange={(e) => set("discountPrice", e.target.value)} {...aria("discountPrice", "discountPrice")} />
            </Field>
            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
              <Field id="discountStartsAt" label="Sale starts" error={err("discountStartsAt")} hint="Empty: right away.">
                <Input id="discountStartsAt" type="datetime-local" value={f.discountStartsAt} onChange={(e) => set("discountStartsAt", e.target.value)} {...aria("discountStartsAt", "discountStartsAt")} />
              </Field>
              <Field id="discountEndsAt" label="Sale ends" error={err("discountEndsAt")}>
                <Input id="discountEndsAt" type="datetime-local" value={f.discountEndsAt} onChange={(e) => set("discountEndsAt", e.target.value)} {...aria("discountEndsAt", "discountEndsAt")} />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Versions" description="Optional. Without versions, each ticked platform is sold at the game's price and stock. A version without its own price uses the game's price and sale.">
          {f.variants.length === 0 && <p className="text-parchment-muted">No separate versions.</p>}
          <ol className="space-y-4">
            {f.variants.map((v, i) => {
              const p = `variants.${i}`;
              const vid = (k: string) => `v${i}-${k}`;
              const pct = salePercent(v.price, v.discountPrice);
              return (
                <li key={i} className="border border-iron bg-panel-deep/50 px-4 pt-2 pb-4">
                  <div className="mb-3 flex items-center justify-between border-b border-iron/60 pb-2">
                    <p className="font-display-ui text-[0.64rem] text-gold-light/90">Version {i + 1}</p>
                    <button type="button" onClick={() => setF((x) => ({ ...x, variants: x.variants.filter((_, j) => j !== i) }))} className="flex min-h-10 items-center gap-1.5 px-2 text-sm text-parchment-muted transition-colors hover:text-blood-text">
                      <X aria-hidden className="size-4" /> Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Field id={vid("platform")} label="Platform" error={err(`${p}.platform`)}>
                      <Select id={vid("platform")} value={v.platform} onChange={(e) => setVariant(i, { platform: e.target.value })} {...aria(`${p}.platform`, vid("platform"))}>
                        <option value="">Choose…</option>
                        {PLATFORMS.map((x) => <option key={x.name} value={x.name}>{x.name}</option>)}
                      </Select>
                    </Field>
                    <Field id={vid("edition")} label="Edition (optional)" error={err(`${p}.edition`)}>
                      <Input id={vid("edition")} value={v.edition} onChange={(e) => setVariant(i, { edition: e.target.value })} {...aria(`${p}.edition`, vid("edition"))} />
                    </Field>
                    <Field id={vid("activation")} label="Activation (optional)" error={err(`${p}.activation`)}>
                      <Input id={vid("activation")} value={v.activation} placeholder="Steam" onChange={(e) => setVariant(i, { activation: e.target.value })} />
                    </Field>
                    <Field id={vid("region")} label="Region (optional)" error={err(`${p}.region`)}>
                      <Input id={vid("region")} value={v.region} onChange={(e) => setVariant(i, { region: e.target.value })} />
                    </Field>
                    <Field id={vid("price")} label="Own price (optional)" error={err(`${p}.price`)}>
                      <Input id={vid("price")} inputMode="decimal" value={v.price} onChange={(e) => setVariant(i, { price: e.target.value })} {...aria(`${p}.price`, vid("price"))} />
                    </Field>
                    <Field id={vid("stock")} label="Own stock (optional)" error={err(`${p}.stock`)}>
                      <Input id={vid("stock")} inputMode="numeric" value={v.stock} onChange={(e) => setVariant(i, { stock: e.target.value })} {...aria(`${p}.stock`, vid("stock"))} />
                    </Field>
                    <Field id={vid("discountPrice")} label="Own sale price" error={err(`${p}.discountPrice`)} hint={pct !== null ? `−${pct}%` : undefined}>
                      <Input id={vid("discountPrice")} inputMode="decimal" value={v.discountPrice} onChange={(e) => setVariant(i, { discountPrice: e.target.value })} {...aria(`${p}.discountPrice`, vid("discountPrice"))} />
                    </Field>
                    <div className="grid gap-4">
                      <Field id={vid("discountStartsAt")} label="Sale starts" error={err(`${p}.discountStartsAt`)}>
                        <Input id={vid("discountStartsAt")} type="datetime-local" value={v.discountStartsAt} onChange={(e) => setVariant(i, { discountStartsAt: e.target.value })} {...aria(`${p}.discountStartsAt`, vid("discountStartsAt"))} />
                      </Field>
                      <Field id={vid("discountEndsAt")} label="Sale ends" error={err(`${p}.discountEndsAt`)}>
                        <Input id={vid("discountEndsAt")} type="datetime-local" value={v.discountEndsAt} onChange={(e) => setVariant(i, { discountEndsAt: e.target.value })} {...aria(`${p}.discountEndsAt`, vid("discountEndsAt"))} />
                      </Field>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {err("variants") && <p className="mt-2 text-sm text-blood-text">{err("variants")}</p>}
          <button type="button" onClick={() => setF((x) => ({ ...x, variants: [...x.variants, emptyVariant(x.platforms[0] ?? "")] }))} className={btn("secondary", "md", "mt-4")}>
            <Plus aria-hidden className="size-4" /> Add version
          </button>
        </Section>

        <Section title="Images" description="Paths of image files that ship with the site, e.g. /images/games/<slug>/cover.jpg (see Media).">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              <Field id="coverImage" label="Cover (3:4)" error={err("coverImage")} hint="Catalogue card and game page.">
                <Input id="coverImage" value={f.coverImage} onChange={(e) => set("coverImage", e.target.value)} {...aria("coverImage", "coverImage")} />
              </Field>
              <div className="max-w-40"><Preview src={f.coverImage} label="Cover preview" ratio="aspect-[3/4]" /></div>
            </div>
            <div className="space-y-3">
              <Field id="cardImage" label="Home card (16:7, optional)" error={err("cardImage")} hint="Empty: the first image below.">
                <Input id="cardImage" value={f.cardImage} onChange={(e) => set("cardImage", e.target.value)} {...aria("cardImage", "cardImage")} />
              </Field>
              <Preview src={f.cardImage} label="Home card preview" ratio="aspect-[16/7]" />
            </div>
            <div className="space-y-3">
              <Field id="pageCoverImage" label="Game page cover (optional)" error={err("pageCoverImage")} hint="Empty: the cover.">
                <Input id="pageCoverImage" value={f.pageCoverImage} onChange={(e) => set("pageCoverImage", e.target.value)} {...aria("pageCoverImage", "pageCoverImage")} />
              </Field>
              <div className="max-w-40"><Preview src={f.pageCoverImage} label="Page cover preview" ratio="aspect-[3/4]" /></div>
            </div>
          </div>
          <div className="mt-6">
            <Field id="screenshots" label="Key art and screenshots, one path per line" error={Object.entries(errors).find(([k]) => k.startsWith("screenshots"))?.[1]} hint="The first one is the page background and the share image.">
              <Textarea id="screenshots" value={f.screenshots} onChange={(e) => set("screenshots", e.target.value)} className="min-h-28 font-mono text-sm" {...aria(Object.keys(errors).find((k) => k.startsWith("screenshots")) ?? "screenshots", "screenshots")} />
            </Field>
          </div>
        </Section>
      </fieldset>

      {/* The save bar stays in reach while the long form scrolls. */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-gold-dark/50 bg-[#0a0907]/95 px-4 py-3 shadow-[0_-10px_24px_rgb(0_0_0/0.45)] backdrop-blur sm:mx-0 sm:px-4">
        {message?.tone === "error" && <p className="w-full text-sm text-blood-text sm:mr-auto sm:w-auto">{message.text}</p>}
        <button type="button" disabled={pending} onClick={() => router.push("/admin/games")} className={btn("ghost", "md")}>
          Cancel
        </button>
        <button type="submit" disabled={pending} className={btn("primary", "md", "min-w-40")}>
          {pending ? "Saving…" : id ? "Save changes" : "Create game"}
        </button>
      </div>
    </form>
  );
}
