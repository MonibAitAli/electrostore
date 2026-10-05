import Link from "next/link";
import { localized, t, type Lang } from "@/i18n";
import type { Category } from "@/generated/prisma/client";

export function CategoryTiles({
  categories,
  lang,
}: {
  categories: (Category & { _count: { products: number } })[];
  lang: Lang;
}) {
  return (
    <section
      aria-labelledby="categories-title"
      className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6"
    >
      <h2 id="categories-title" className="text-titre">
        {t(lang, "home.categoriesTitle")}
      </h2>
      <p className="mt-1 max-w-[52ch] text-sm text-gris">{t(lang, "home.categoriesLead")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/c/${category.slug}`}
            className="carte group flex flex-col overflow-hidden transition-colors hover:border-encre"
          >
            <div className="vignette-media aspect-[4/3] overflow-hidden">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-ligne px-3 py-2.5">
              <span className="text-sm font-semibold">{localized(lang, category)}</span>
              <span className="text-xs text-gris">{category._count.products}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
