import { z } from "zod";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/auth/schemas";
import type { AdminDictionary } from "@/lib/i18n/admin";
import { GENRES, PLATFORMS } from "@/lib/catalog";

/**
 * Validation for the admin panel's forms, with messages in the panel's language (each schema is built from
 * the admin dictionary's `validation` texts). Used by the Server Actions (the trust boundary) and by the
 * forms themselves for the same messages before sending. Images are paths of files that ship with the
 * site (public/images): next/image only serves local files here, so an outside URL would break pages.
 */
export const IMAGE_PATH = /^\/images\/(?!.*\.\.)[^\s?#\\]+\.(jpe?g|png|webp|avif|gif)$/i;
const genreNames = GENRES.map((g) => g.name) as [string, ...string[]];
const platformNames = PLATFORMS.map((p) => p.name) as [string, ...string[]];
const objectId = z.string().regex(/^[a-f0-9]{24}$/);

/** The messages the schemas show: the admin dictionary's `validation` texts in the panel's language. */
type V = AdminDictionary["validation"];

/** Field rules shared by the schemas below. */
function fields(v: V) {
  const imagePath = z.string().trim().regex(IMAGE_PATH, v.imagePath);
  const money = z.number({ error: v.number }).finite().min(0, v.nonNegative).max(1_000_000, v.tooLarge);
  return {
    imagePath,
    optionalImage: z.union([z.literal(""), imagePath]).transform((x) => x || null),
    money,
    /** An ISO date-time from the form (the browser converts local time), or null. */
    dateTime: z.union([z.null(), z.iso.datetime({ offset: true, error: v.invalidDate })]).transform((x) => (x ? new Date(x) : null)),
    text: (max: number) => z.string().trim().max(max, v.maxChars(max)),
  };
}

/** Sale fields shared by a game and its versions; a sale needs an end date or the shop never shows it. */
function checkSale(
  v: V,
  s: { price: number | null; discountPrice: number | null; discountStartsAt: Date | null; discountEndsAt: Date | null },
  ctx: z.RefinementCtx,
  path: (string | number)[] = [],
) {
  if (s.discountPrice == null) return;
  if (s.price != null && s.discountPrice >= s.price) ctx.addIssue({ code: "custom", path: [...path, "discountPrice"], message: v.saleBelowPrice });
  if (!s.discountEndsAt) ctx.addIssue({ code: "custom", path: [...path, "discountEndsAt"], message: v.saleNeedsEnd });
  if (s.discountStartsAt && s.discountEndsAt && s.discountEndsAt <= s.discountStartsAt) ctx.addIssue({ code: "custom", path: [...path, "discountEndsAt"], message: v.endAfterStart });
}

export function gameSchema(v: V) {
  const f = fields(v);
  const variant = z
    .object({
      platform: z.enum(platformNames, v.choosePlatform),
      edition: f.text(80).transform((x) => x || null),
      activation: f.text(80).transform((x) => x || null),
      region: f.text(80).transform((x) => x || null),
      price: f.money.nullable(),
      discountPrice: f.money.nullable(),
      discountStartsAt: f.dateTime,
      discountEndsAt: f.dateTime,
      stock: z.number().int(v.wholeNumber).min(0, v.nonNegative).max(1_000_000).nullable(),
    })
    .superRefine((x, ctx) => {
      if (x.discountPrice != null && x.price == null) ctx.addIssue({ code: "custom", path: ["discountPrice"], message: v.versionPriceFirst });
      checkSale(v, x, ctx);
    });
  return z
    .object({
      title: z.string().trim().min(1, v.required).max(120, v.maxChars(120)),
      slug: z.string().trim().min(1, v.required).max(120, v.maxChars(120)).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, v.slugFormat),
      description: z.object({ ro: f.text(10_000), ru: f.text(10_000), en: f.text(10_000) }),
      developer: z.string().trim().min(1, v.required).max(120, v.maxChars(120)),
      publisher: z.string().trim().min(1, v.required).max(120, v.maxChars(120)),
      releaseDate: z.iso.date(v.invalidDate).transform((x) => new Date(`${x}T00:00:00.000Z`)),
      genres: z.array(z.enum(genreNames)).min(1, v.chooseGenres),
      platforms: z.array(z.enum(platformNames)).min(1, v.choosePlatforms),
      price: f.money.refine((x) => x > 0, v.positive),
      discountPrice: f.money.nullable(),
      discountStartsAt: f.dateTime,
      discountEndsAt: f.dateTime,
      stock: z.number({ error: v.number }).int(v.wholeNumber).min(0, v.nonNegative).max(1_000_000, v.tooLarge),
      rating: z.number().finite().min(0, v.rating).max(10, v.rating).nullable(),
      coverImage: f.imagePath,
      cardImage: f.optionalImage,
      pageCoverImage: f.optionalImage,
      screenshots: z.array(f.imagePath).max(40, v.maxImages(40)),
      featured: z.boolean(),
      variants: z.array(variant).max(20, v.maxVersions(20)),
    })
    .superRefine((g, ctx) => {
      if (!g.description.ro && !g.description.ru && !g.description.en) ctx.addIssue({ code: "custom", path: ["description", "ro"], message: v.descriptionOne });
      checkSale(v, g, ctx);
      g.variants.forEach((x, i) => {
        if (!g.platforms.includes(x.platform)) ctx.addIssue({ code: "custom", path: ["variants", i, "platform"], message: v.tickPlatform });
      });
      const keys = g.variants.map((x) => `${x.platform}|${x.edition ?? ""}`);
      keys.forEach((k, i) => {
        if (keys.indexOf(k) !== i) ctx.addIssue({ code: "custom", path: ["variants", i, "edition"], message: v.duplicateVersion });
      });
    });
}

export type GameInput = z.input<ReturnType<typeof gameSchema>>;
export type GameData = z.output<ReturnType<typeof gameSchema>>;

export function saleSchema(v: V) {
  const f = fields(v);
  return z
    .object({
      gameId: objectId,
      variant: z.number().int().min(0).max(50).nullable(),
      price: z.number(),
      discountPrice: f.money.nullable(),
      discountStartsAt: f.dateTime,
      discountEndsAt: f.dateTime,
    })
    .superRefine((s, ctx) => checkSale(v, s, ctx));
}

/** Account fields (the rules themselves, PASSWORD_MIN/MAX and email, are the site's: lib/auth/schemas.ts). */
function account(v: V) {
  return {
    name: z.string().trim().min(2, v.minChars(2)).max(80, v.maxChars(80)),
    email: z.string().trim().toLowerCase().pipe(z.email(v.email)),
    password: z.string().min(PASSWORD_MIN, v.minChars(PASSWORD_MIN)).max(PASSWORD_MAX, v.maxChars(PASSWORD_MAX)),
    role: z.enum(["admin", "user"], v.chooseRole),
    status: z.enum(["active", "blocked"], v.chooseStatus),
  };
}

export function createUserSchema(v: V) {
  const a = account(v);
  return z.object({ name: a.name, email: a.email, password: a.password, role: a.role, status: a.status });
}

export function updateUserSchema(v: V) {
  const a = account(v);
  return z.object({ id: objectId, name: a.name, role: a.role, status: a.status, password: z.union([z.literal(""), a.password]) });
}

export const orderStatusSchema = z.object({
  id: objectId,
  status: z.enum(["new", "processing", "completed", "cancelled"]),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]),
});

/** Flattens zod issues to "path.to.field" → first message, which the forms show under each field. */
export function issuesByPath(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
