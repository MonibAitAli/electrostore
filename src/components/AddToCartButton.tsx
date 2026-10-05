"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import type { Lang } from "@/i18n";
import { t } from "@/i18n";

export function AddToCartButton({
  productId,
  slug,
  disabled,
  label,
  lang,
  variant = "card",
}: {
  productId: number;
  slug: string;
  disabled?: boolean;
  label: string;
  lang: Lang;
  variant?: "card" | "detail";
}) {
  const { add, qtyOf } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handle = () => {
    add({ id: productId, slug });
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 2200);
  };

  const inCart = qtyOf(productId) > 0;
  const text = justAdded ? t(lang, "product.added") : label;
  const base =
    variant === "detail"
      ? "w-full px-6 py-3 text-base"
      : "w-full px-3 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      aria-live="polite"
      className={`${base} font-display font-bold border transition-colors disabled:cursor-not-allowed disabled:border-ligne disabled:bg-pierre disabled:text-gris ${
        justAdded
          ? "border-vert bg-vert text-white"
          : "border-encre bg-encre text-white hover:border-rouge hover:bg-rouge"
      }`}
    >
      {text}
      {inCart && !justAdded ? (
        <span className="ms-2 opacity-70">×{qtyOf(productId)}</span>
      ) : null}
    </button>
  );
}
