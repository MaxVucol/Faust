import type { Game } from "@prisma/client";

export type GameCardData = Pick<
  Game,
  | "id"
  | "title"
  | "slug"
  | "price"
  | "discountPrice"
  | "discountStartsAt"
  | "discountEndsAt"
  | "variants"
  | "coverImage"
  | "cardImage"
  | "screenshots"
  | "genres"
  | "platforms"
  | "rating"
  | "releaseDate"
  | "stock"
  | "developer"
>;

/**
 * One line in the cart: a game on one platform. Prices are saved when it is added (MDL) and replaced with
 * the catalogue's current ones when the cart page opens; `oldPrice` is set while a sale runs. Lines saved
 * before platforms existed have no platform.
 */
export type CartItem = {
  slug: string;
  title: string;
  platform?: string;
  edition?: string | null;
  price: number;
  oldPrice?: number | null;
  coverImage: string;
  quantity: number;
};

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  /** "cart-changed": prices or availability changed since the cart was shown, so it must be priced again. */
  code?: "cart-changed";
};
