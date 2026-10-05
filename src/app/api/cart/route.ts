import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * The cart lives in localStorage, so the client could tamper with prices.
 * This endpoint hands back the authoritative figures for the ids in the cart;
 * the client only ever sends ids.
 */
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0)
    .slice(0, 50);

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: {
      id: true,
      slug: true,
      nameFr: true,
      nameAr: true,
      price: true,
      promoPrice: true,
      imageUrl: true,
      stock: true,
      brand: { select: { name: true } },
    },
  });

  // Preserve the order the client sent, and report anything that vanished.
  const byId = new Map(products.map((product) => [product.id, product]));
  return NextResponse.json({
    products: ids.flatMap((id) => {
      const product = byId.get(id);
      return product ? [product] : [];
    }),
    missing: ids.filter((id) => !byId.has(id)),
  });
}
