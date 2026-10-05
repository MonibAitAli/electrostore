import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { localized, t, formatPrice } from "@/i18n";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/lang";
import { effectivePrice } from "@/lib/products";

export async function generateMetadata({
  params,
}: PageProps<"/c/[slug]">): Promise<{ title: string }> {
  const { slug } = await params;
  const lang = await getLang();
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { nameFr: true, nameAr: true },
  });
  if (!category) return { title: t(lang, "listing.empty") };
  return { title: localized(lang, category) };
}

export default async function CategoryPage({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const lang = await getLang();

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: { brand: true, category: true },
        orderBy: [{ promoPrice: { sort: "desc", nulls: "last" } }, { id: "asc" }],
      },
    },
  });

  if (!category) notFound();

  const products = category.products;
  const cheapest = products.length
    ? Math.min(...products.map((p) => effectivePrice(p)))
    : null;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="text-xs text-gris">
        <Link href="/" className="hover:text-rouge">
          {t(lang, "nav.home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-encre">{localized(lang, category)}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-ligne pb-5">
        <div>
          <h1 className="text-titre">{localized(lang, category)}</h1>
          <p className="mt-1 text-sm text-gris">
            {products.length === 1
              ? t(lang, "listing.countOne")
              : t(lang, "listing.count", { n: products.length })}
          </p>
        </div>
        {cheapest !== null ? (
          <p className="text-sm text-gris">
            {t(lang, "product.normalPrice")}{" "}
            <span className="prix text-encre">{formatPrice(cheapest, lang)}</span>
          </p>
        ) : null}
      </header>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold">{t(lang, "listing.empty")}</p>
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
