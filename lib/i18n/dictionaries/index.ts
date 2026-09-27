import type { Locale } from "../config";
import { en } from "./en";
import { ro, type Dictionary } from "./ro";
import { ru } from "./ru";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { ro, ru, en };
