import type { Game } from "@prisma/client";

export type GameCardData = Pick<
  Game,
  | "id"
  | "title"
  | "slug"
  | "price"
  | "discountPrice"
  | "discountEndsAt"
  | "coverImage"
  | "screenshots"
  | "genres"
  | "platforms"
  | "rating"
  | "releaseDate"
  | "stock"
>;

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  coverImage: string;
  quantity: number;
};

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
};
