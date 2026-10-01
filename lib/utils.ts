export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * A string as search compares it: lower case, with diacritics removed ("Yōtei" → "yotei", "Acțiune" →
 * "actiune"), so a query matches whether or not it was typed with them. Only for comparing; never shown.
 */
export function searchKey(s: string): string {
  // NFD splits "ō" into "o" + a combining macron; U+0300–U+036F are those combining marks.
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
