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
>;

/**
 * One line in the cart: a game on one platform. Prices are the ones shown when it was added (MDL);
 * `oldPrice` is set when it was added on sale. Lines saved before platforms existed have no platform.
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
};
