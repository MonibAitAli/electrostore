import { CartView } from "@/components/CartView";
import { t } from "@/i18n";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<{ title: string }> {
  const lang = await getLang();
  return { title: t(lang, "cart.title") };
}

export default async function CartPage() {
  const lang = await getLang();

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
      <h1 className="text-titre">{t(lang, "cart.title")}</h1>
      <div className="mt-6">
        <CartView lang={lang} />
      </div>
    </div>
  );
}
