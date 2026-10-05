import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { t } from "@/i18n";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/lang";

export async function generateMetadata({
  searchParams,
}: PageProps<"/recherche">): Promise<{ title: string }> {
  const lang = await getLang();
  const query = firstParam((await searchParams).q);
  return {
    title: query ? t(lang, "listing.searchResults", { q: query }) : t(lang, "nav.search"),
  };
}

/** Query strings can repeat a key, so normalise to the first value. */
function firstParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim();
}

export default async function SearchPage({ searchParams }: PageProps<"/recherche">) {
  const lang = await getLang();
  const query = firstParam((await searchParams).q);

  const products = query
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { nameFr: { contains: query } },
            { nameAr: { contains: query } },
            { sku: { contains: query } },
            { brand: { name: { contains: query } } },
            { category: { nameFr: { contains: query } } },
          ],
        },
        include: { brand: true, category: true },
        orderBy: [{ promoPrice: { sort: "desc", nulls: "last" } }, { id: "asc" }],
        take: 48,
      })
    : [];

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
      <h1 className="text-titre">
        {query ? t(lang, "listing.searchResults", { q: query }) : t(lang, "nav.search")}
      </h1>

      {products.length > 0 ? (
        <p className="mt-1 text-sm text-gris">{t(lang, "listing.count", { n: products.length })}</p>
      ) : null}

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold">
            {query ? t(lang, "listing.noResultsFor", { q: query }) : t(lang, "listing.empty")}
          </p>
          <p className="mt-2 text-sm text-gris">{t(lang, "listing.emptyLead")}</p>
          <Link
            href="/"
            className="mt-6 inline-block border border-encre px-4 py-2 text-sm font-semibold hover:bg-encre hover:text-white"
          >
            {t(lang, "nav.home")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
