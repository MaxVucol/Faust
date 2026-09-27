import { z } from "zod";
import type { Locale } from "./i18n/config";

/**
 * Text stored once per language (the `LocalizedText` composite type in schema.prisma).
 * Every language is optional so a missing translation is representable; readers go through
 * `pickLocalized`, which applies the fallback order.
 */
export type LocalizedText = Partial<Record<Locale, string | null>>;

/** Selected language first, then English, Romanian, Russian. */
const FALLBACK_ORDER: readonly Locale[] = ["en", "ro", "ru"];

export type PickedText = { text: string; locale: Locale };

/** The best available translation for `locale`, or null when every language is empty. */
export function pickLocalized(value: LocalizedText | null | undefined, locale: Locale): PickedText | null {
  if (!value) return null;
  for (const candidate of [locale, ...FALLBACK_ORDER.filter((l) => l !== locale)]) {
    const text = value[candidate]?.trim();
    if (text) return { text, locale: candidate };
  }
  return null;
}

/**
 * Input validation for a localized description (seed data, migrations, any future admin form):
 * Romanian is the source language and required; Russian and English may be left empty, in which
 * case they are stored as null and readers fall back.
 */
const optionalTranslation = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : s));

export const localizedDescriptionSchema = z.object({
  ro: z.string().trim().min(1, "Romanian description is required."),
  ru: optionalTranslation,
  en: optionalTranslation,
});

export type LocalizedDescriptionInput = z.input<typeof localizedDescriptionSchema>;
