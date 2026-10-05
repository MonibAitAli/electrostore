import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { PriceBlock } from "@/components/PriceBlock";
import { ProductCard } from "@/components/ProductCard";
import { Rating } from "@/components/Rating";
import { localized, t } from "@/i18n";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/lang";
import { stockLevel } from "@/lib/products";
import { readSpecs } from "@/lib/slug";

export async function generateMetadata({
  params,
}: PageProps<"/produit/[slug]">): Promise<{ title: string }> {
  const { slug } = await params;
  const lang = await getLang();
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { nameFr: true, nameAr: true },
  });
  if (!product) return { title: t(lang, "listing.empty") };
  return { title: localized(lang, product) };
}

export default async function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const lang = await getLang();

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { brand: true, category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    include: { brand: true, category: true },
    orderBy: { rating: "desc" },
    take: 4,
  });

  const specs = readSpecs(product.specsJson);
  const stock = stockLevel(product.stock);
  const description = lang === "ar" ? product.descriptionAr : product.descriptionFr;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="text-xs text-gris">
        <Link href="/" className="hover:text-rouge">
          {t(lang, "nav.home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/c/${product.category.slug}`} className="hover:text-rouge">
          {localized(lang, product.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-encre">{product.sku}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="vignette-media grid aspect-square place-items-center overflow-hidden p-6">
          <img
            src={product.imageUrl}
            alt={localized(lang, product)}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-gris">{product.brand.name}</p>
          <h1 className="mt-1 text-titre">{localized(lang, product)}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} count={product.reviewCount} />
            <span className="text-xs text-gris">
              {product.reviewCount > 0
                ? t(lang, "product.reviews", { n: product.reviewCount })
                : t(lang, "product.noReviews")}
            </span>
          </div>

          <div className="mt-6">
            <PriceBlock product={product} lang={lang} size="detail" labelled />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              disabled={stock === "out"}
              label={t(lang, "product.addToCart")}
              lang={lang}
              variant="detail"
            />
            <p className="text-xs text-gris">{t(lang, "product.delivery")}</p>
            <p className="text-sm">
              {stock === "out" ? (
                <span className="text-rouge">{t(lang, "product.outOfStock")}</span>
              ) : stock === "low" ? (
                <span className="text-or">{t(lang, "product.lowStock", { n: product.stock })}</span>
              ) : (
                <span className="text-vert">{t(lang, "product.inStock")}</span>
              )}
            </p>
          </div>

          <dl className="mt-8 border-t border-ligne text-sm">
            <div className="flex justify-between gap-4 border-b border-ligne py-2.5">
              <dt className="text-gris">{t(lang, "product.sku")}</dt>
              <dd>{product.sku}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ligne py-2.5">
              <dt className="text-gris">{t(lang, "product.brand")}</dt>
              <dd>{product.brand.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ligne py-2.5">
              <dt className="text-gris">{t(lang, "product.category")}</dt>
              <dd>
                <Link href={`/c/${product.category.slug}`} className="hover:text-rouge">
                  {localized(lang, product.category)}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {description ? (
        <section className="mt-12 max-w-[70ch]">
          <h2 className="text-soustitre">{t(lang, "product.description")}</h2>
          <p className="mt-2 text-gris">{description}</p>
        </section>
      ) : null}

      {specs.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-soustitre">{t(lang, "product.specs")}</h2>
          <dl className="mt-3 max-w-[70ch] border-t border-ligne text-sm">
            {specs.map((spec, index) => (
              <div
                key={`${spec.labelFr}-${index}`}
                className="flex justify-between gap-6 border-b border-ligne py-2.5"
              >
                <dt className="text-gris">{lang === "ar" ? spec.labelAr : spec.labelFr}</dt>
                <dd className="text-end">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-titre">{t(lang, "product.related")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} lang={lang} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
