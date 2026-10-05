import { formatPrice, t, type Lang } from "@/i18n";
import {
  discountPercent,
  effectivePrice,
  hasPromo,
  savings,
  type Priced,
} from "@/lib/products";

/**
 * The price block is the one place on the page allowed to shout: display face,
 * tabular figures, red when discounted. Everything around it stays quiet.
 */
export function PriceBlock({
  product,
  lang,
  size = "card",
  labelled = false,
}: {
  product: Priced;
  lang: Lang;
  size?: "card" | "detail";
  labelled?: boolean;
}) {
  const promo = hasPromo(product);
  const scale = size === "detail" ? "text-3xl" : "text-xl";

  return (
    <div className="flex flex-col gap-0.5">
      {promo ? (
        <>
          {labelled ? (
            <span className="text-xs text-gris">{t(lang, "product.promoPrice")}</span>
          ) : null}
          <span className={`prix text-rouge ${scale}`}>
            {formatPrice(effectivePrice(product), lang)}
          </span>
          <span className="flex flex-wrap items-baseline gap-2">
            <span
              className={`prix text-gris line-through ${size === "detail" ? "text-lg" : "text-sm"}`}
            >
              {formatPrice(product.price, lang)}
            </span>
            <span className="text-xs text-rouge">−{discountPercent(product)}%</span>
          </span>
        </>
      ) : (
        <>
          {labelled ? (
            <span className="text-xs text-gris">{t(lang, "product.normalPrice")}</span>
          ) : null}
          <span className={`prix text-encre ${scale}`}>
            {formatPrice(product.price, lang)}
          </span>
        </>
      )}
      {promo && labelled ? (
        <span className="mt-1 text-xs text-gris">
          {t(lang, "product.save", { n: formatPrice(savings(product), lang) })}
        </span>
      ) : null}
    </div>
  );
}
