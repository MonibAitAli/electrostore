import Link from "next/link";
import { t, type Lang } from "@/i18n";
import { CategoryNav, type NavCategory } from "./CategoryNav";
import { CartBadge } from "./CartBadge";
import { LangToggle } from "./LangToggle";

export function SiteHeader({
  categories,
  lang,
}: {
  categories: NavCategory[];
  lang: Lang;
}) {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-encre text-white/75">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2 text-xs sm:px-6">
          <span>{t(lang, "strip.delivery")}</span>
          <span className="hidden sm:inline">{t(lang, "strip.warranty")}</span>
          <span className="hidden sm:inline">{t(lang, "strip.collect")}</span>
        </div>
      </div>

      <div className="border-b border-ligne bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-encre"
          >
            {t(lang, "site.name")}
          </Link>

          <form action="/recherche" className="order-3 w-full min-w-0 flex-1 sm:order-none sm:w-auto">
            <label htmlFor="recherche" className="sr-only">
              {t(lang, "nav.search")}
            </label>
            <div className="flex border border-encre">
              <input
                id="recherche"
                name="q"
                type="search"
                placeholder={t(lang, "nav.searchPlaceholder")}
                className="min-w-0 flex-1 px-3 py-2 text-sm outline-none placeholder:text-gris-clair"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-encre px-4 text-sm font-semibold text-white transition-colors hover:bg-rouge"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4.5 4.5" strokeLinecap="round" />
                </svg>
                <span className="hidden md:inline">{t(lang, "nav.search")}</span>
              </button>
            </div>
          </form>

          <div className="ms-auto flex items-center gap-2">
            <LangToggle lang={lang} />
            <CartBadge label={t(lang, "nav.cart")} />
          </div>
        </div>
      </div>

      <CategoryNav categories={categories} lang={lang} />
    </header>
  );
}
