import Link from "next/link";
import { BrandForm } from "@/components/admin/BrandForm";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteBrand } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<{ title: string }> {
  return { title: fr["admin.brands"] };
}

export default async function AdminBrandsPage({
  searchParams,
}: PageProps<"/admin/marques">) {
  const raw = (await searchParams).form;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  const form =
    value === "nouveau" ? "nouveau" : Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const { ok, err } = (await searchParams) as { ok?: string; err?: string };

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  const editing = form === "nouveau" ? null : brands.find((b) => b.id === form) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-titre">{fr["admin.brands"]}</h1>
        <Link
          href={form ? "/admin/marques" : "/admin/marques?form=nouveau"}
          className="border border-encre px-4 py-2 text-sm font-semibold hover:bg-encre hover:text-white"
        >
          {form ? fr["admin.cancel"] : fr["admin.new"]}
        </Link>
      </div>

      {ok ? (
        <p className="mt-4 border border-vert bg-white px-3 py-2 text-sm text-vert">
          {fr["admin.saved"]}
        </p>
      ) : null}
      {err ? (
        <p className="mt-4 border border-rouge bg-white px-3 py-2 text-sm text-rouge">
          {fr["admin.errorDeleteUsed"]}
        </p>
      ) : null}

      {form ? (
        <section className="carte mt-6 p-5">
          <h2 className="text-soustitre">{editing ? fr["admin.edit"] : fr["admin.new"]}</h2>
          <div className="mt-4">
            <BrandForm defaults={editing} />
          </div>
        </section>
      ) : null}

      {brands.length === 0 ? (
        <p className="mt-8 text-sm text-gris">{fr["admin.emptyBrands"]}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ligne text-xs uppercase text-gris">
                <th className="py-2 pe-3 text-start">Marque</th>
                <th className="py-2 pe-3 text-start">{fr["admin.fieldSlug"]}</th>
                <th className="py-2 pe-3 text-end">Produits</th>
                <th className="py-2 pe-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-ligne align-top">
                  <td className="py-2 pe-3 font-semibold">{brand.name}</td>
                  <td className="py-2 pe-3 font-mono text-xs text-gris">{brand.slug}</td>
                  <td className="py-2 pe-3 text-end tabular-nums">{brand._count.products}</td>
                  <td className="py-2 pe-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/marques?form=${brand.id}`}
                        className="border border-ligne px-3 py-1 text-xs hover:border-encre"
                      >
                        {fr["admin.edit"]}
                      </Link>
                      <DeleteForm id={brand.id} name={brand.name} action={deleteBrand} />
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