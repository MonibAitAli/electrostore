import { ar } from "./ar";
import { fr, type Dict, type DictKey } from "./fr";

export const LANGS = ["fr", "ar"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fr";

export const LANG_COOKIE = "ep_lang";

export function isLang(value: unknown): value is Lang {
  return value === "fr" || value === "ar";
}

export function getDict(lang: Lang): Dict {
  return lang === "ar" ? ar : fr;
}

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/** Fills `{placeholders}` in a translated string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function t(
  lang: Lang,
  key: DictKey,
  vars?: Record<string, string | number>,
): string {
  const value = getDict(lang)[key];
  return vars ? fill(value, vars) : value;
}

/** Human-readable label for a localised DB field. */
export function localized(
  lang: Lang,
  item: { nameFr: string; nameAr: string },
): string {
  return lang === "ar" ? item.nameAr : item.nameFr;
}

export function localizedTitle(lang: Lang, item: { titleFr: string; titleAr: string }): string {
  return lang === "ar" ? item.titleAr : item.titleFr;
}

const NARROW_NBSP = "\u202f";
const ARABIC_SEP = "\u00a0"; // dirham amounts read better with a non-breaking space

/**
 * MAD has no minor unit in practice, so we render whole dirhams.
 * Maghreb convention keeps Western digits in both languages, so only the
 * separator and the currency label differ.
 */
export function formatPrice(amount: number, lang: Lang): string {
  const rounded = Math.round(amount);
  const grouped =
    lang === "ar"
      ? String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ARABIC_SEP)
      : String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
  return lang === "ar" ? `${grouped} د.م.` : `${grouped} DH`;
}

export type { Dict, DictKey };
