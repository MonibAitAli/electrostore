import Link from "next/link";
import { localized, t, type Lang } from "@/i18n";
import { discountPercent, hasPromo, stockLevel, type ProductWithRelations } from "@/lib/products";
import { AddToCartButton } from "./AddToCartButton";
import { PriceBlock } from "./PriceBlock";
import { PromoBadge } from "./PromoBadge";
import { Rating } from "./Rating";

export function ProductCard({
  product,
  lang,
}: {
  product: ProductWithRelations;
  lang: Lang;
}) {
  const promo = hasPromo(product);
  const stock = stockLevel(product.stock);
  const href = `/produit/${product.slug}`;

  return (
    <article className="carte group relative flex flex-col overflow-hidden transition-colors hover:border-encre">
      {promo ? <PromoBadge percent={discountPercent(product)} /> : null}

      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <div className="vignette-media grid aspect-square place-items-center overflow-hidden p-4">
          {/* Plain img: the catalogue hotlinks images from many external hosts,
              so next/image's optimizer would add a hop without adding value. */}
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 border-t border-ligne p-3">
        <span className="text-xs font-semibold text-gris">{product.brand.name}</span>

        <h3 className="text-[0.9375rem] leading-snug">
          <Link href={href} className="hover:text-rouge">
            {localized(lang, product)}
          </Link>
        </h3>

        <Rating value={product.rating} count={product.reviewCount} />

        <div className="mt-auto pt-1">
          <PriceBlock product={product} lang={lang} />
        </div>

        <p className="text-xs">
          {stock === "out" ? (
            <span className="text-rouge">{t(lang, "product.outOfStock")}</span>
          ) : stock === "low" ? (
            <span className="text-or">{t(lang, "product.lowStock", { n: product.stock })}</span>
          ) : (
            <span className="text-vert">{t(lang, "product.inStock")}</span>
          )}
        </p>

        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          disabled={stock === "out"}
          label={t(lang, "product.addToCart")}
          lang={lang}
        />
      </div>
    </article>
  );
}
