import Link from "next/link";
import { CategoryTiles } from "@/components/CategoryTiles";
import { HeroBanner } from "@/components/HeroBanner";
import { PicksSection } from "@/components/PicksSection";
import { ProductCard } from "@/components/ProductCard";
import { t } from "@/i18n";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/lang";
import { pickWindows } from "@/lib/picks";
import { discountPercent, hasPromo } from "@/lib/products";

const PICKS_PER_WINDOW = 6;

export default async function HomePage() {
  const lang = await getLang();

  const [categories, banner, pickPool, promoPool] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.banner.findFirst({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      include: { brand: true, category: true },
      orderBy: { id: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, promoPrice: { not: null }, stock: { gt: 0 } },
      include: { brand: true, category: true },
      orderBy: { id: "asc" },
    }),
  ]);

  const windows = pickWindows(pickPool, PICKS_PER_WINDOW);

  // Deepest cut first: the promo band should argue for itself.
  const promos = promoPool
    .filter(hasPromo)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 4);

  return (
    <>
      <HeroBanner banner={banner} lang={lang} />

      <CategoryTiles categories={categories} lang={lang} />

      <PicksSection windows={windows} lang={lang} lead={t(lang, "home.picksLead")} />

      {promos.length > 0 ? (
        <section aria-labelledby="promo-title" className="bg-rouge">
          <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="promo-title" className="text-titre text-white">
                  {t(lang, "home.promoTitle")}
                </h2>
                <p className="mt-1 max-w-[52ch] text-sm text-white/80">
                  {t(lang, "home.promoLead")}
                </p>
              </div>
              <Link
                href="/recherche?q="
                className="border border-white px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-rouge"
              >
                {t(lang, "home.viewAll")}
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {promos.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
