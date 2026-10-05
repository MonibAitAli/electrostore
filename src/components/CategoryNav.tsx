"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localized, t, type Lang } from "@/i18n";

export type NavCategory = { slug: string; nameFr: string; nameAr: string };

export function CategoryNav({
  categories,
  lang,
}: {
  categories: NavCategory[];
  lang: Lang;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={t(lang, "nav.categories")} className="border-y border-ligne bg-white">
      <div className="mx-auto flex max-w-[1240px] items-stretch gap-1 overflow-x-auto px-4 sm:px-6">
        <Link
          href="/"
          className={`shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
            pathname === "/"
              ? "border-rouge font-semibold text-rouge"
              : "border-transparent text-gris hover:text-encre"
          }`}
        >
          {t(lang, "nav.home")}
        </Link>
        {categories.map((category) => {
          const href = `/c/${category.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={category.slug}
              href={href}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
                active
                  ? "border-rouge font-semibold text-rouge"
                  : "border-transparent text-gris hover:text-encre"
              }`}
            >
              {localized(lang, category)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
