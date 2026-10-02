import { z } from "zod";
import { GENRES, PLATFORMS } from "@/lib/catalog";

/**
 * Validation for the admin panel's forms. Used by the Server Actions (the trust boundary) and by the
 * forms themselves for the same messages before sending. Images are paths of files that ship with the
 * site (public/images): next/image only serves local files here, so an outside URL would break pages.
 */
export const IMAGE_PATH = /^\/images\/(?!.*\.\.)[^\s?#\\]+\.(jpe?g|png|webp|avif|gif)$/i;
const imagePath = z.string().trim().regex(IMAGE_PATH, "Use a site image path such as /images/games/<slug>/cover.jpg");
const optionalImage = z.union([z.literal(""), imagePath]).transform((v) => v || null);

const genreNames = GENRES.map((g) => g.name) as [string, ...string[]];
const platformNames = PLATFORMS.map((p) => p.name) as [string, ...string[]];

const money = z.number({ error: "Enter a number" }).finite().min(0, "Must be 0 or more").max(1_000_000, "Too large");
/** An ISO date-time from the form (the browser converts local time), or null. */
const dateTime = z.union([z.null(), z.iso.datetime({ offset: true, error: "Invalid date" })]).transform((v) => (v ? new Date(v) : null));
const text = (max: number) => z.string().trim().max(max, `At most ${max} characters`);

/** Sale fields shared by a game and its versions; a sale needs an end date or the shop never shows it. */
function checkSale(
  s: { price: number | null; discountPrice: number | null; discountStartsAt: Date | null; discountEndsAt: Date | null },
  ctx: z.RefinementCtx,
  path: (string | number)[] = [],
) {
  if (s.discountPrice == null) return;
  if (s.price != null && s.discountPrice >= s.price) ctx.addIssue({ code: "custom", path: [...path, "discountPrice"], message: "Sale price must be lower than the price" });
  if (!s.discountEndsAt) ctx.addIssue({ code: "custom", path: [...path, "discountEndsAt"], message: "A sale needs an end date" });
  if (s.discountStartsAt && s.discountEndsAt && s.discountEndsAt <= s.discountStartsAt) ctx.addIssue({ code: "custom", path: [...path, "discountEndsAt"], message: "End must be after start" });
}

const variantSchema = z
  .object({
    platform: z.enum(platformNames, "Choose a platform"),
    edition: text(80).transform((v) => v || null),
    activation: text(80).transform((v) => v || null),
    region: text(80).transform((v) => v || null),
    price: money.nullable(),
    discountPrice: money.nullable(),
    discountStartsAt: dateTime,
    discountEndsAt: dateTime,
    stock: z.number().int("Whole number").min(0, "Must be 0 or more").max(1_000_000).nullable(),
  })
  .superRefine((v, ctx) => {
    if (v.discountPrice != null && v.price == null) ctx.addIssue({ code: "custom", path: ["discountPrice"], message: "Set the version's own price first, or leave the sale empty to use the game's" });
    checkSale(v, ctx);
  });

export const gameSchema = z
  .object({
    title: z.string().trim().min(1, "Required").max(120, "At most 120 characters"),
    slug: z.string().trim().min(1, "Required").max(120).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lower-case letters, digits and single hyphens"),
    description: z.object({ ro: text(10_000), ru: text(10_000), en: text(10_000) }),
    developer: z.string().trim().min(1, "Required").max(120),
    publisher: z.string().trim().min(1, "Required").max(120),
    releaseDate: z.iso.date("Invalid date").transform((v) => new Date(`${v}T00:00:00.000Z`)),
    genres: z.array(z.enum(genreNames)).min(1, "Choose at least one genre"),
    platforms: z.array(z.enum(platformNames)).min(1, "Choose at least one platform"),
    price: money.refine((v) => v > 0, "Must be more than 0"),
    discountPrice: money.nullable(),
    discountStartsAt: dateTime,
    discountEndsAt: dateTime,
    stock: z.number({ error: "Enter a number" }).int("Whole number").min(0, "Must be 0 or more").max(1_000_000),
    rating: z.number().finite().min(0, "0 to 10").max(10, "0 to 10").nullable(),
    coverImage: imagePath,
    cardImage: optionalImage,
    pageCoverImage: optionalImage,
    screenshots: z.array(imagePath).max(40, "At most 40 images"),
    featured: z.boolean(),
    variants: z.array(variantSchema).max(20, "At most 20 versions"),
  })
  .superRefine((g, ctx) => {
    if (!g.description.ro && !g.description.ru && !g.description.en) ctx.addIssue({ code: "custom", path: ["description", "ro"], message: "Write the description in at least one language" });
    checkSale(g, ctx);
    g.variants.forEach((v, i) => {
      if (!g.platforms.includes(v.platform)) ctx.addIssue({ code: "custom", path: ["variants", i, "platform"], message: "Also tick this platform above" });
    });
    const keys = g.variants.map((v) => `${v.platform}|${v.edition ?? ""}`);
    keys.forEach((k, i) => {
      if (keys.indexOf(k) !== i) ctx.addIssue({ code: "custom", path: ["variants", i, "edition"], message: "Same platform and edition as another version" });
    });
  });

export type GameInput = z.input<typeof gameSchema>;
export type GameData = z.output<typeof gameSchema>;

export const saleSchema = z
  .object({
    gameId: z.string().regex(/^[a-f0-9]{24}$/),
    variant: z.number().int().min(0).max(50).nullable(),
    price: z.number(),
    discountPrice: money.nullable(),
    discountStartsAt: dateTime,
    discountEndsAt: dateTime,
  })
  .superRefine((s, ctx) => checkSale(s, ctx));

const password = z.string().min(10, "At least 10 characters").max(200, "At most 200 characters");
const name = z.string().trim().min(2, "At least 2 characters").max(80, "At most 80 characters");
const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email"));
const role = z.enum(["admin", "user"], "Choose a role");
const status = z.enum(["active", "blocked"], "Choose a status");

export const createUserSchema = z.object({ name, email, password, role, status });
export const updateUserSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/),
  name,
  role,
  status,
  password: z.union([z.literal(""), password]),
});

export const orderStatusSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/),
  status: z.enum(["new", "processing", "completed", "cancelled"]),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]),
});

export const loginSchema = z.object({ email, password: z.string().min(1, "Required").max(200) });

/** Flattens zod issues to "path.to.field" → first message, which the forms show under each field. */
export function issuesByPath(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
