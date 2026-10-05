import Link from "next/link";
import { BannerForm } from "@/components/admin/BannerForm";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteBanner } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<{ title: string }> {
  return { title: fr["admin.banners"] };
}

export default async function AdminBannersPage({
  searchParams,
}: PageProps<"/admin/bannieres">) {
  const raw = (await searchParams).form;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  const form =
    value === "nouveau" ? "nouveau" : Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const { ok } = (await searchParams) as { ok?: string };

  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  const editing = form === "nouveau" ? null : banners.find((b) => b.id === form) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-titre">{fr["admin.banners"]}</h1>
        <Link
          href={form ? "/admin/bannieres" : "/admin/bannieres?form=nouveau"}
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

      {form ? (
        <section className="carte mt-6 p-5">
          <h2 className="text-soustitre">{editing ? fr["admin.edit"] : fr["admin.new"]}</h2>
          <div className="mt-4">
            <BannerForm defaults={editing} />
          </div>
        </section>
      ) : null}

      {banners.length === 0 ? (
        <p className="mt-8 text-sm text-gris">{fr["admin.emptyBanners"]}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {banners.map((banner) => (
            <li key={banner.id} className="carte flex flex-wrap gap-4 p-4">
              <img
                src={banner.imageUrl}
                alt=""
                className="h-24 w-32 shrink-0 border border-ligne object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{banner.titleFr}</p>
                <p className="text-sm text-gris" dir="rtl">
                  {banner.titleAr}
                </p>
                {banner.ctaHref ? (
                  <p className="mt-1 text-xs text-gris">
                    → {banner.ctaLabelFr ?? banner.ctaHref}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-gris-clair">
                  {fr["admin.fieldOrder"]}: {banner.order} ·{" "}
                  {banner.isActive ? fr["admin.fieldActive"] : "—"}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-2">
                <Link
                  href={`/admin/bannieres?form=${banner.id}`}
                  className="border border-ligne px-3 py-1 text-xs hover:border-encre"
                >
                  {fr["admin.edit"]}
                </Link>
                <DeleteForm id={banner.id} name={banner.titleFr} action={deleteBanner} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}