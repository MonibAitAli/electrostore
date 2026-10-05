import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteCategory } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<{ title: string }> {
  return { title: fr["admin.categories"] };
}

export default async function AdminCategoriesPage({
  searchParams,
}: PageProps<"/admin/categories">) {
  const raw = (await searchParams).form;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const form =
    value === "nouveau" ? "nouveau" : Number(value) > 0 && Number.isInteger(Number(value))
      ? Number(value)
      : null;

  const { ok, err } = (await searchParams) as { ok?: string; err?: string };

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { order: "asc" },
  });

  const editing = form === "nouveau" ? null : categories.find((c) => c.id === form) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-titre">{fr["admin.categories"]}</h1>
        <Link
          href={form ? "/admin/categories" : "/admin/categories?form=nouveau"}
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
          <h2 className="text-soustitre">
            {editing ? `${fr["admin.edit"]} — ${editing.nameFr}` : fr["admin.new"]}
          </h2>
          <div className="mt-4">
            <CategoryForm defaults={editing} />
          </div>
        </section>
      ) : null}

      {categories.length === 0 ? (
        <p className="mt-8 text-sm text-gris">{fr["admin.emptyCategories"]}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ligne text-xs uppercase text-gris">
                <th className="py-2 pe-3 text-start">{fr["admin.fieldNameFr"]}</th>
                <th className="py-2 pe-3 text-start">Nom (arabe)</th>
                <th className="py-2 pe-3 text-start">{fr["admin.fieldSlug"]}</th>
                <th className="py-2 pe-3 text-end">{fr["admin.fieldOrder"]}</th>
                <th className="py-2 pe-3 text-end">Produits</th>
                <th className="py-2 pe-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-ligne align-top">
                  <td className="py-2 pe-3">
                    <span className="font-semibold">{category.nameFr}</span>
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt=""
                        className="mt-1 h-10 w-10 border border-ligne object-cover"
                      />
                    ) : null}
                  </td>
                  <td className="py-2 pe-3" dir="rtl">
                    {category.nameAr}
                  </td>
                  <td className="py-2 pe-3 font-mono text-xs text-gris">{category.slug}</td>
                  <td className="py-2 pe-3 text-end tabular-nums">{category.order}</td>
                  <td className="py-2 pe-3 text-end tabular-nums">{category._count.products}</td>
                  <td className="py-2 pe-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/c/${category.slug}`}
                        className="text-xs underline hover:text-rouge"
                      >
                        {fr["admin.viewOnSite"]}
                      </Link>
                      <Link
                        href={`/admin/categories?form=${category.id}`}
                        className="border border-ligne px-3 py-1 text-xs hover:border-encre"
                      >
                        {fr["admin.edit"]}
                      </Link>
                      <DeleteForm
                        id={category.id}
                        name={category.nameFr}
                        action={deleteCategory}
                      />
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