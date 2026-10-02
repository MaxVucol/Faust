import type { Game } from "@prisma/client";
import { fromShopInput, toShopInput } from "./time";

/**
 * The game editor's field values: every field as the inputs hold it (text for numbers and dates), so
 * what was typed is kept exactly, even when it isn't valid yet. formToInput() turns them into the
 * shape gameSchema validates.
 */
export type VariantValues = {
  platform: string;
  edition: string;
  activation: string;
  region: string;
  price: string;
  discountPrice: string;
  discountStartsAt: string;
  discountEndsAt: string;
  stock: string;
};

export type GameFormValues = {
  title: string;
  slug: string;
  description: { ro: string; ru: string; en: string };
  developer: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  platforms: string[];
  price: string;
  discountPrice: string;
  discountStartsAt: string;
  discountEndsAt: string;
  stock: string;
  rating: string;
  coverImage: string;
  cardImage: string;
  pageCoverImage: string;
  screenshots: string;
  featured: boolean;
  variants: VariantValues[];
};

const num = (v: number | null | undefined) => (v == null ? "" : String(v));

export const emptyVariant = (platform = ""): VariantValues => ({ platform, edition: "", activation: "", region: "", price: "", discountPrice: "", discountStartsAt: "", discountEndsAt: "", stock: "" });

export function gameToForm(game: Game | null): GameFormValues {
  if (!game) {
    return {
      title: "",
      slug: "",
      description: { ro: "", ru: "", en: "" },
      developer: "",
      publisher: "",
      releaseDate: "",
      genres: [],
      platforms: [],
      price: "",
      discountPrice: "",
      discountStartsAt: "",
      discountEndsAt: "",
      stock: "0",
      rating: "",
      coverImage: "",
      cardImage: "",
      pageCoverImage: "",
      screenshots: "",
      featured: false,
      variants: [],
    };
  }
  return {
    title: game.title,
    slug: game.slug,
    description: { ro: game.description.ro ?? "", ru: game.description.ru ?? "", en: game.description.en ?? "" },
    developer: game.developer,
    publisher: game.publisher,
    releaseDate: game.releaseDate.toISOString().slice(0, 10),
    genres: game.genres,
    platforms: game.platforms,
    price: num(game.price),
    discountPrice: num(game.discountPrice),
    discountStartsAt: toShopInput(game.discountStartsAt),
    discountEndsAt: toShopInput(game.discountEndsAt),
    stock: num(game.stock),
    rating: num(game.rating),
    coverImage: game.coverImage,
    cardImage: game.cardImage ?? "",
    pageCoverImage: game.pageCoverImage ?? "",
    screenshots: game.screenshots.join("\n"),
    featured: game.featured,
    variants: game.variants.map((v) => ({
      platform: v.platform,
      edition: v.edition ?? "",
      activation: v.activation ?? "",
      region: v.region ?? "",
      price: num(v.price),
      discountPrice: num(v.discountPrice),
      discountStartsAt: toShopInput(v.discountStartsAt),
      discountEndsAt: toShopInput(v.discountEndsAt),
      stock: num(v.stock),
    })),
  };
}

/** "" → null; anything else → a number (NaN stays NaN so validation reports it). */
const optionalNumber = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));
const requiredNumber = (v: string) => (v.trim() === "" ? Number.NaN : Number(v.replace(",", ".")));
const optionalDate = (v: string) => (v ? (fromShopInput(v) ?? "invalid") : null);

/** The values as gameSchema expects them (validated there, on both sides). */
export function formToInput(f: GameFormValues) {
  return {
    title: f.title,
    slug: f.slug,
    description: f.description,
    developer: f.developer,
    publisher: f.publisher,
    releaseDate: f.releaseDate,
    genres: f.genres,
    platforms: f.platforms,
    price: requiredNumber(f.price),
    discountPrice: optionalNumber(f.discountPrice),
    discountStartsAt: optionalDate(f.discountStartsAt),
    discountEndsAt: optionalDate(f.discountEndsAt),
    stock: requiredNumber(f.stock),
    rating: optionalNumber(f.rating),
    coverImage: f.coverImage,
    cardImage: f.cardImage,
    pageCoverImage: f.pageCoverImage,
    screenshots: f.screenshots
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    featured: f.featured,
    variants: f.variants.map((v) => ({
      platform: v.platform,
      edition: v.edition,
      activation: v.activation,
      region: v.region,
      price: optionalNumber(v.price),
      discountPrice: optionalNumber(v.discountPrice),
      discountStartsAt: optionalDate(v.discountStartsAt),
      discountEndsAt: optionalDate(v.discountEndsAt),
      stock: optionalNumber(v.stock),
    })),
  };
}

/** A URL slug from a title: "Ghost of Yōtei" → "ghost-of-yotei". */
export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
