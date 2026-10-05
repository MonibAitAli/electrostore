"use client";

import { useState } from "react";
import { t, type Lang } from "@/i18n";
import type { ProductWithRelations } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function PicksSection({
  windows,
  lang,
  lead,
}: {
  windows: ProductWithRelations[][];
  lang: Lang;
  lead: string;
}) {
  const [index, setIndex] = useState(0);
  const current = windows[Math.min(index, windows.length - 1)] ?? [];

  if (windows.length === 0) {
    return (
      <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
        <h2 className="text-titre">{t(lang, "home.picksTitle")}</h2>
        <p className="mt-3 text-sm text-gris">{t(lang, "home.emptyPicks")}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="picks-title" className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="picks-title" className="text-titre">
            {t(lang, "home.picksTitle")}
          </h2>
          <p className="mt-1 max-w-[52ch] text-sm text-gris">{lead}</p>
        </div>

        {windows.length > 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % windows.length)}
            className="border border-encre px-4 py-2 text-sm font-semibold transition-colors hover:bg-encre hover:text-white"
          >
            {t(lang, "home.reshuffle")}
          </button>
        ) : null}
      </div>

      <div
        key={index}
        className="picks-entree mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
      >
        {current.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </section>
  );
}
