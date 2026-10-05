"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { effectivePrice, hasPromo, type Priced } from "@/lib/products";
import { formatPrice, localized, t, type Lang } from "@/i18n";

type CartProduct = Priced & {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string;
  imageUrl: string;
  stock: number;
  brand: { name: string };
};

export function CartView({ lang }: { lang: Lang }) {
  const { lines, ready, setQty, remove, clear } = useCart();

  // Identity of what we are showing prices for. Storing it alongside the result
  // means a stale response can never be painted against a newer cart.
  const key = lines.map((line) => `${line.id}:${line.qty}`).join(",");
  const [result, setResult] = useState<{ key: string; products: CartProduct[] } | null>(null);

  useEffect(() => {
    if (!ready || lines.length === 0) return;
    const requested = key;
    const ids = lines.map((line) => line.id).join(",");
    let cancelled = false;

    fetch(`/api/cart?ids=${ids}`)
      .then((res) => res.json())
      .then((data: { products: CartProduct[] }) => {
        if (!cancelled) setResult({ key: requested, products: data.products ?? [] });
      })
      .catch(() => {
        if (!cancelled) setResult({ key: requested, products: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [key, ready, lines]);

  const products = lines.length === 0 ? [] : result?.key === key ? result.products : null;

  if (!ready || products === null) {
    return <p className="py-16 text-center text-sm text-gris">…</p>;
  }

  if (lines.length === 0 || products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold">{t(lang, "cart.empty")}</p>
        <p className="mt-2 text-sm text-gris">{t(lang, "cart.emptyLead")}</p>
        <Link
          href="/"
          className="mt-6 inline-block border border-encre px-4 py-2 text-sm font-semibold hover:bg-encre hover:text-white"
        >
          {t(lang, "cart.browse")}
        </Link>
      </div>
    );
  }

  // Line totals, then the order total. Prices come from the server response.
  const lines2 = products.map((product) => {
    const line = lines.find((entry) => entry.id === product.id);
    const qty = Math.min(line?.qty ?? 1, Math.max(product.stock, 1));
    return { product, qty, total: effectivePrice(product) * qty };
  });
  const total = lines2.reduce((sum, row) => sum + row.total, 0);
  const itemCount = lines2.reduce((sum, row) => sum + row.qty, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <ul className="border-t border-ligne">
          {lines2.map(({ product, qty, total: lineTotal }) => (
            <li key={product.id} className="flex gap-4 border-b border-ligne py-4">
              <Link
                href={`/produit/${product.slug}`}
                className="vignette-media grid h-24 w-24 shrink-0 place-items-center overflow-hidden p-2"
              >
                <img
                  src={product.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-xs font-semibold text-gris">{product.brand.name}</p>
                <h2 className="text-sm leading-snug">
                  <Link href={`/produit/${product.slug}`} className="hover:text-rouge">
                    {localized(lang, product)}
                  </Link>
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-ligne">
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty - 1)}
                      className="px-3 py-1 text-sm hover:bg-pierre"
                      aria-label="-1"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty + 1)}
                      disabled={qty >= product.stock}
                      className="px-3 py-1 text-sm hover:bg-pierre disabled:text-gris-clair"
                      aria-label="+1"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="text-xs text-gris underline hover:text-rouge"
                  >
                    {t(lang, "cart.remove")}
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-end">
                {hasPromo(product) ? (
                  <p className="prix text-rouge">{formatPrice(lineTotal, lang)}</p>
                ) : null}
                <p
                  className={`prix ${hasPromo(product) ? "text-sm text-gris line-through" : "text-encre"}`}
                >
                  {formatPrice(
                    hasPromo(product)
                      ? product.price * qty
                      : effectivePrice(product) * qty,
                    lang,
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/" className="text-sm underline hover:text-rouge">
            {t(lang, "cart.continue")}
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-gris underline hover:text-rouge"
          >
            {t(lang, "admin.delete")}
          </button>
        </div>
      </div>

      <aside className="h-fit border border-ligne bg-pierre p-5">
        <h2 className="font-display text-lg font-bold">{t(lang, "cart.title")}</h2>
        <p className="mt-1 text-xs text-gris">{t(lang, "cart.itemCount", { n: itemCount })}</p>

        <dl className="mt-4 space-y-2 border-t border-ligne pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gris">{t(lang, "cart.subtotal")}</dt>
            <dd className="prix">{formatPrice(total, lang)}</dd>
          </div>
          <div className="flex justify-between border-t border-ligne pt-2 text-base">
            <dt className="font-semibold">{t(lang, "cart.total")}</dt>
            <dd className="prix text-rouge">{formatPrice(total, lang)}</dd>
          </div>
        </dl>

        <Link
          href="/commander"
          aria-disabled="true"
          onClick={(event) => event.preventDefault()}
          className="mt-5 block cursor-not-allowed bg-ligne px-4 py-3 text-center font-display font-bold text-gris"
        >
          {t(lang, "cart.checkout")}
        </Link>
        <p className="mt-2 text-xs text-gris">{t(lang, "checkout.comingSoon")}</p>
      </aside>
    </div>
  );
}
