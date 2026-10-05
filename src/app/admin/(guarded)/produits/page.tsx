import Link from "next/link";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { ProductForm } from "@/components/admin/ProductForm";
import { deleteProduct } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { formatPrice } from "@/i18n";
import { prisma } from "@/lib/db";
import { effectivePrice, hasPromo } from "@/lib/products";

export async function generateMetadata(): Promise<{ title: string }> {
  return { title: fr["admin.products"] };
}

/** `?form=nouveau` opens the create form, `?form=12` opens one for editing. */
async function readFormParam(searchParams: Promise<Record<string, unknown>>) {
  const raw = (await searchParams).form;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return null;
  if (value === "nouveau") return "nouveau" as const;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function AdminProductsPage({
  searchParams,
}: PageProps<"/admin/produits">) {
  const form = await readFormParam(searchParams);
  const { ok } = (await searchParams) as { ok?: string };

  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      include: { brand: true, category: true },
      orderBy: { id: "desc" },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const editing = form === "nouveau" ? null : products.find((p) => p.id === form) ?? null;
  const showForm = form !== null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-titre">{fr["admin.products"]}</h1>
        <Link
          href={showForm ? "/admin/produits" : "/admin/produits?form=nouveau"}
          className="border border-encre px-4 py-2 text-sm font-semibold hover:bg-encre hover:text-white"
        >
          {showForm ? fr["admin.cancel"] : fr["admin.new"]}
        </Link>
      </div>

      {ok ? (
        <p className="mt-4 border border-vert bg-white px-3 py-2 text-sm text-vert">
          {fr["admin.saved"]}
        </p>
      ) : null}

      {showForm ? (
        <section className="carte mt-6 p-5">
          <h2 className="text-soustitre">
            {editing ? `${fr["admin.edit"]} — ${editing.nameFr}` : fr["admin.new"]}
          </h2>
          <div className="mt-4">
            <ProductForm defaults={editing} brands={brands} categories={categories} />
          </div>
        </section>
      ) : null}

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-gris">{fr["admin.emptyProducts"]}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ligne text-start text-xs uppercase text-gris">
                <th className="py-2 pe-3 text-start">{fr["admin.fieldSku"]}</th>
                <th className="py-2 pe-3 text-start">Nom</th>
                <th className="py-2 pe-3 text-start">{fr["admin.fieldCategory"]}</th>
                <th className="py-2 pe-3 text-end">{fr["admin.fieldPrice"]}</th>
                <th className="py-2 pe-3 text-end">{fr["admin.fieldStock"]}</th>
                <th className="py-2 pe-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-ligne align-top">
                  <td className="py-2 pe-3 font-mono text-xs text-gris">{product.sku}</td>
                  <td className="py-2 pe-3">
                    <span className={product.isActive ? "" : "text-gris line-through"}>
                      {product.nameFr}
                    </span>
                    <span className="block text-xs text-gris" dir="rtl">
                      {product.nameAr}
                    </span>
                    <span className="block text-xs text-gris-clair">
                      {product.brand.name}
                    </span>
                  </td>
                  <td className="py-2 pe-3 text-gris">{product.category.nameFr}</td>
                  <td className="py-2 pe-3 text-end">
                    <span className={`prix ${hasPromo(product) ? "text-rouge" : ""}`}>
                      {formatPrice(effectivePrice(product), "fr")}
                    </span>
                    {hasPromo(product) ? (
                      <span className="block text-xs text-gris line-through">
                        {formatPrice(product.price, "fr")}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pe-3 text-end tabular-nums">{product.stock}</td>
                  <td className="py-2 pe-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/produit/${product.slug}`}
                        className="text-xs underline hover:text-rouge"
                      >
                        {fr["admin.viewOnSite"]}
                      </Link>
                      <Link
                        href={`/admin/produits?form=${product.id}`}
                        className="border border-ligne px-3 py-1 text-xs hover:border-encre"
                      >
                        {fr["admin.edit"]}
                      </Link>
                      <DeleteForm id={product.id} name={product.nameFr} action={deleteProduct} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}