import type { Brand, Category, Product } from "@/generated/prisma/client";

export type ProductWithRelations = Product & { brand: Brand; category: Category };

type Priced = { price: number; promoPrice: number | null };

export type { Priced };

export function effectivePrice(product: Priced): number {
  return hasPromo(product) ? (product.promoPrice as number) : product.price;
}

export function hasPromo(product: Priced): boolean {
  return product.promoPrice !== null && product.promoPrice < product.price;
}

export function discountPercent(product: Priced): number {
  if (!hasPromo(product) || product.price <= 0) return 0;
  return Math.round((1 - (product.promoPrice as number) / product.price) * 100);
}

export function savings(product: Priced): number {
  if (!hasPromo(product)) return 0;
  return product.price - (product.promoPrice as number);
}

export function stockLevel(stock: number): "out" | "low" | "in" {
  if (stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "in";
}
