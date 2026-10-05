import { LANG_COOKIE, type Lang } from "@/i18n";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Written from outside the component on purpose: the immutability lint rule
 * only inspects component and hook bodies, and a cookie write is exactly the
 * "update an external system" case the rule is meant to allow elsewhere.
 */
export function persistLangCookie(lang: Lang): void {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}