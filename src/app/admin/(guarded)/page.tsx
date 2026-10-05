import Link from "next/link";
import { fr } from "@/i18n/fr";
import { prisma } from "@/lib/db";
import { stockLevel } from "@/lib/products";

export async function generateMetadata(): Promise<{ title: string }> {
  return { title: fr["admin.dashboard"] };
}

export default async function AdminDashboardPage() {
  const [products, categories, brands, banners, promos, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.banner.count(),
    prisma.product.count({ where: { promoPrice: { not: null } } }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      include: { category: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
  ]);

  const stats = [
    { label: fr["admin.statsProducts"], value: products, href: "/admin/produits" },
    { label: fr["admin.statsCategories"], value: categories, href: "/admin/categories" },
    { label: fr["admin.statsBrands"], value: brands, href: "/admin/marques" },
    { label: fr["admin.statsBanners"], value: banners, href: "/admin/bannieres" },
    { label: fr["admin.statsPromos"], value: promos, href: "/admin/produits" },
  ];

  return (
    <div>
      <h1 className="text-titre">{fr["admin.dashboard"]}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="carte p-4 hover:border-encre">
            <p className="prix text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold text-gris">{stat.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-soustitre">{fr["admin.statsOutOfStock"]}</h2>
        {lowStock.length === 0 ? (
          <p className="mt-3 text-sm text-gris">—</p>
        ) : (
          <ul className="mt-3 border-t border-ligne">
            {lowStock.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-4 border-b border-ligne py-2.5 text-sm"
              >
                <Link
                  href={`/admin/produits?form=${product.id}`}
                  className="truncate hover:text-rouge"
                >
                  {product.nameFr}
                </Link>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-gris">{product.category.nameFr}</span>
                  <span
                    className={`font-semibold ${
                      stockLevel(product.stock) === "out" ? "text-rouge" : "text-or"
                    }`}
                  >
                    {stockLevel(product.stock) === "out"
                      ? fr["product.outOfStock"]
                      : fr["product.lowStock"].replace("{n}", String(product.stock))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}