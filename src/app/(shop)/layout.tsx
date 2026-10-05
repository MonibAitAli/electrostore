import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { t } from "@/i18n";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/lang";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, nameFr: true, nameAr: true },
  });

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-encre focus:px-4 focus:py-2 focus:text-white"
      >
        {t(lang, "nav.skip")}
      </a>
      <SiteHeader categories={categories} lang={lang} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
