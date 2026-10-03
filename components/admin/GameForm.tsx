"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { saveGame } from "@/app/admin/actions";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Diamond } from "@/components/ui/Ornaments";
import { Select } from "@/components/ui/Select";
import { useI18n } from "@/components/i18n/I18nProvider";
import { genreLabel, GENRES, PLATFORMS } from "@/lib/catalog";
import { emptyVariant, formToInput, slugify, type GameFormValues, type VariantValues } from "@/lib/admin/game-form";
import { gameSchema, IMAGE_PATH, issuesByPath } from "@/lib/admin/schemas";
import { LOCALE_NAMES, LOCALES } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "./AdminI18n";
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
  const { t } = useAdminI18n();
  const ok = IMAGE_PATH.test(src.trim());
  return (
    <div className={cn("relative w-full overflow-hidden border border-gold-dark/50 bg-panel-deep", ratio)}>
      {ok ? <Image key={src} src={src.trim()} alt={label} fill unoptimized className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-parchment-muted">{t.gameForm.noImage}</span>}
    </div>
  );
}

/** Description languages: the site's languages, named in their own language (as the shop's selector does). */
const LANGS = LOCALES.map((key) => ({ key, label: LOCALE_NAMES[key] }));

/**
 * Create or edit a game: every field the catalogue stores, except the PC system requirements (kept as
 * they are). Values are checked with the same schema as the server before sending; the server checks
 * again and its field messages are shown under the fields. Saving disables the form.
 */
export function GameForm({ id, initial }: { id: string | null; initial: GameFormValues }) {
  const { t } = useAdminI18n();
  const { t: shop } = useI18n();
  const F = t.gameForm;
  const schema = useMemo(() => gameSchema(t.validation), [t]);
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
    const local = schema.safeParse(input);
    if (!local.success) return showErrors(issuesByPath(local.error), F.checkFields);
    setMessage(null);
    start(async () => {
      const result = await saveGame(id, input);
      if (!result.ok) return showErrors(result.fieldErrors ?? {}, result.error);
      setErrors({});
      if (!id && result.id) {
        router.push(`/admin/games/${result.id}?notice=created`);
        return;
      }
      setMessage({ tone: "success", text: result.message ?? t.common.notices.saved });
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
        <Section title={F.sections.basics}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field id="title" label={F.title} error={err("title")}>
              <Input id="title" value={f.title} onChange={(e) => setF((v) => ({ ...v, title: e.target.value, slug: slugTouched ? v.slug : slugify(e.target.value) }))} {...aria("title", "title")} />
            </Field>
            <Field id="slug" label={F.slug} error={err("slug")} hint={F.slugHint(f.slug || "…")}>
              <Input id="slug" value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} {...aria("slug", "slug")} />
            </Field>
            <Field id="developer" label={F.developer} error={err("developer")}>
              <Input id="developer" value={f.developer} onChange={(e) => set("developer", e.target.value)} {...aria("developer", "developer")} />
            </Field>
            <Field id="publisher" label={F.publisher} error={err("publisher")}>
              <Input id="publisher" value={f.publisher} onChange={(e) => set("publisher", e.target.value)} {...aria("publisher", "publisher")} />
            </Field>
            <Field id="releaseDate" label={F.releaseDate} error={err("releaseDate")} hint={F.releaseHint}>
              <Input id="releaseDate" type="date" value={f.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} {...aria("releaseDate", "releaseDate")} />
            </Field>
            <Field id="rating" label={F.rating} error={err("rating")} hint={F.ratingHint}>
              <Input id="rating" inputMode="decimal" value={f.rating} onChange={(e) => set("rating", e.target.value)} {...aria("rating", "rating")} />
            </Field>
          </div>
          <div className="mt-5">
            <Checkbox id="featured" label={F.featured} checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
          </div>
        </Section>

        <Section title={F.sections.description} description={F.sections.descriptionHint}>
          <div role="tablist" aria-label={F.descriptionTabs} className="mb-4 flex flex-wrap gap-2">
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
                {f.description[l.key].trim() ? "" : F.emptyTab}
              </button>
            ))}
          </div>
          {LANGS.map((l) => (
            <div key={l.key} hidden={lang !== l.key}>
              <Field id={`description-${l.key}`} label={F.descriptionLabel(l.label)} error={err(`description.${l.key}`)} hint={F.paragraphsHint}>
                <Textarea id={`description-${l.key}`} value={f.description[l.key]} onChange={(e) => setF((v) => ({ ...v, description: { ...v.description, [l.key]: e.target.value } }))} className="min-h-56" {...aria(`description.${l.key}`, `description-${l.key}`)} />
              </Field>
            </div>
          ))}
        </Section>

        <Section title={F.sections.genresPlatforms}>
          <div className="grid gap-6 md:grid-cols-2">
            <div role="group" aria-labelledby="genres-label" aria-describedby={err("genres") ? "genres-error" : undefined}>
              <p id="genres-label" className="mb-2 font-display-ui text-[0.7rem] text-parchment-muted">{F.genres}</p>
              <div className="grid grid-cols-2 gap-x-4">
                {GENRES.map((g) => <Checkbox key={g.name} id={`genre-${g.slug}`} label={genreLabel(shop.genres, g.name)} checked={f.genres.includes(g.name)} onChange={() => toggle("genres", g.name)} aria-invalid={err("genres") ? true : undefined} />)}
              </div>
              {err("genres") && <p id="genres-error" className="mt-1.5 text-sm text-blood-text">{err("genres")}</p>}
            </div>
            <div role="group" aria-labelledby="platforms-label" aria-describedby={err("platforms") ? "platforms-error" : undefined}>
              <p id="platforms-label" className="mb-2 font-display-ui text-[0.7rem] text-parchment-muted">{F.platforms}</p>
              {PLATFORMS.map((p) => <Checkbox key={p.name} id={`platform-${p.short}`} label={p.name} checked={f.platforms.includes(p.name)} onChange={() => toggle("platforms", p.name)} aria-invalid={err("platforms") ? true : undefined} />)}
              {err("platforms") && <p id="platforms-error" className="mt-1.5 text-sm text-blood-text">{err("platforms")}</p>}
            </div>
          </div>
        </Section>

        <Section title={F.sections.priceStock} description={F.sections.priceStockHint(t.common.tzName)}>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field id="price" label={F.price} error={err("price")}>
              <Input id="price" inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} {...aria("price", "price")} />
            </Field>
            <Field id="stock" label={F.stock} error={err("stock")} hint={F.stockHint}>
              <Input id="stock" inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value)} {...aria("stock", "stock")} />
            </Field>
            <Field id="discountPrice" label={F.salePrice} error={err("discountPrice")} hint={gamePercent !== null ? F.salePercent(gamePercent) : F.saleEmptyHint}>
              <Input id="discountPrice" inputMode="decimal" value={f.discountPrice} onChange={(e) => set("discountPrice", e.target.value)} {...aria("discountPrice", "discountPrice")} />
            </Field>
            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
              <Field id="discountStartsAt" label={F.saleStarts} error={err("discountStartsAt")} hint={F.saleStartsHint}>
                <Input id="discountStartsAt" type="datetime-local" value={f.discountStartsAt} onChange={(e) => set("discountStartsAt", e.target.value)} {...aria("discountStartsAt", "discountStartsAt")} />
              </Field>
              <Field id="discountEndsAt" label={F.saleEnds} error={err("discountEndsAt")}>
                <Input id="discountEndsAt" type="datetime-local" value={f.discountEndsAt} onChange={(e) => set("discountEndsAt", e.target.value)} {...aria("discountEndsAt", "discountEndsAt")} />
              </Field>
            </div>
          </div>
        </Section>

        <Section title={F.sections.versions} description={F.sections.versionsHint}>
          {f.variants.length === 0 && <p className="text-parchment-muted">{F.noVersions}</p>}
          <ol className="space-y-4">
            {f.variants.map((v, i) => {
              const p = `variants.${i}`;
              const vid = (k: string) => `v${i}-${k}`;
              const pct = salePercent(v.price, v.discountPrice);
              return (
                <li key={i} className="border border-iron bg-panel-deep/50 px-4 pt-2 pb-4">
                  <div className="mb-3 flex items-center justify-between border-b border-iron/60 pb-2">
                    <p className="font-display-ui text-[0.64rem] text-gold-light/90">{F.version(i + 1)}</p>
                    <button type="button" onClick={() => setF((x) => ({ ...x, variants: x.variants.filter((_, j) => j !== i) }))} className="flex min-h-10 items-center gap-1.5 px-2 text-sm text-parchment-muted transition-colors hover:text-blood-text">
                      <X aria-hidden className="size-4" /> {F.removeVersion}
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Field id={vid("platform")} label={F.vPlatform} error={err(`${p}.platform`)}>
                      <Select id={vid("platform")} value={v.platform} onChange={(e) => setVariant(i, { platform: e.target.value })} {...aria(`${p}.platform`, vid("platform"))}>
                        <option value="">{t.common.choose}</option>
                        {PLATFORMS.map((x) => <option key={x.name} value={x.name}>{x.name}</option>)}
                      </Select>
                    </Field>
                    <Field id={vid("edition")} label={F.vEdition} error={err(`${p}.edition`)}>
                      <Input id={vid("edition")} value={v.edition} onChange={(e) => setVariant(i, { edition: e.target.value })} {...aria(`${p}.edition`, vid("edition"))} />
                    </Field>
                    <Field id={vid("activation")} label={F.vActivation} error={err(`${p}.activation`)}>
                      <Input id={vid("activation")} value={v.activation} placeholder="Steam" onChange={(e) => setVariant(i, { activation: e.target.value })} />
                    </Field>
                    <Field id={vid("region")} label={F.vRegion} error={err(`${p}.region`)}>
                      <Input id={vid("region")} value={v.region} onChange={(e) => setVariant(i, { region: e.target.value })} />
                    </Field>
                    <Field id={vid("price")} label={F.vPrice} error={err(`${p}.price`)}>
                      <Input id={vid("price")} inputMode="decimal" value={v.price} onChange={(e) => setVariant(i, { price: e.target.value })} {...aria(`${p}.price`, vid("price"))} />
                    </Field>
                    <Field id={vid("stock")} label={F.vStock} error={err(`${p}.stock`)}>
                      <Input id={vid("stock")} inputMode="numeric" value={v.stock} onChange={(e) => setVariant(i, { stock: e.target.value })} {...aria(`${p}.stock`, vid("stock"))} />
                    </Field>
                    <Field id={vid("discountPrice")} label={F.vSalePrice} error={err(`${p}.discountPrice`)} hint={pct !== null ? `−${pct}%` : undefined}>
                      <Input id={vid("discountPrice")} inputMode="decimal" value={v.discountPrice} onChange={(e) => setVariant(i, { discountPrice: e.target.value })} {...aria(`${p}.discountPrice`, vid("discountPrice"))} />
                    </Field>
                    <div className="grid gap-4">
                      <Field id={vid("discountStartsAt")} label={F.saleStarts} error={err(`${p}.discountStartsAt`)}>
                        <Input id={vid("discountStartsAt")} type="datetime-local" value={v.discountStartsAt} onChange={(e) => setVariant(i, { discountStartsAt: e.target.value })} {...aria(`${p}.discountStartsAt`, vid("discountStartsAt"))} />
                      </Field>
                      <Field id={vid("discountEndsAt")} label={F.saleEnds} error={err(`${p}.discountEndsAt`)}>
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
            <Plus aria-hidden className="size-4" /> {F.addVersion}
          </button>
        </Section>

        <Section title={F.sections.images} description={F.sections.imagesHint}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              <Field id="coverImage" label={F.cover} error={err("coverImage")} hint={F.coverHint}>
                <Input id="coverImage" value={f.coverImage} onChange={(e) => set("coverImage", e.target.value)} {...aria("coverImage", "coverImage")} />
              </Field>
              <div className="max-w-40"><Preview src={f.coverImage} label={F.coverPreview} ratio="aspect-[3/4]" /></div>
            </div>
            <div className="space-y-3">
              <Field id="cardImage" label={F.card} error={err("cardImage")} hint={F.cardHint}>
                <Input id="cardImage" value={f.cardImage} onChange={(e) => set("cardImage", e.target.value)} {...aria("cardImage", "cardImage")} />
              </Field>
              <Preview src={f.cardImage} label={F.cardPreview} ratio="aspect-[16/7]" />
            </div>
            <div className="space-y-3">
              <Field id="pageCoverImage" label={F.pageCover} error={err("pageCoverImage")} hint={F.pageCoverHint}>
                <Input id="pageCoverImage" value={f.pageCoverImage} onChange={(e) => set("pageCoverImage", e.target.value)} {...aria("pageCoverImage", "pageCoverImage")} />
              </Field>
              <div className="max-w-40"><Preview src={f.pageCoverImage} label={F.pageCoverPreview} ratio="aspect-[3/4]" /></div>
            </div>
          </div>
          <div className="mt-6">
            <Field id="screenshots" label={F.screenshots} error={Object.entries(errors).find(([k]) => k.startsWith("screenshots"))?.[1]} hint={F.screenshotsHint}>
              <Textarea id="screenshots" value={f.screenshots} onChange={(e) => set("screenshots", e.target.value)} className="min-h-28 font-mono text-sm" {...aria(Object.keys(errors).find((k) => k.startsWith("screenshots")) ?? "screenshots", "screenshots")} />
            </Field>
          </div>
        </Section>
      </fieldset>

      {/* The save bar stays in reach while the long form scrolls. */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-gold-dark/50 bg-[#0a0907]/95 px-4 py-3 shadow-[0_-10px_24px_rgb(0_0_0/0.45)] backdrop-blur sm:mx-0 sm:px-4">
        {message?.tone === "error" && <p className="w-full text-sm text-blood-text sm:mr-auto sm:w-auto">{message.text}</p>}
        <button type="button" disabled={pending} onClick={() => router.push("/admin/games")} className={btn("ghost", "md")}>
          {t.common.cancel}
        </button>
        <button type="submit" disabled={pending} className={btn("primary", "md", "min-w-40")}>
          {pending ? t.common.saving : id ? t.common.saveChanges : F.create}
        </button>
      </div>
    </form>
  );
}
