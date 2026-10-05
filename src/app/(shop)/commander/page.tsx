import Link from "next/link";
import { t } from "@/i18n";
import { getLang } from "@/lib/lang";

export async function generateMetadata(): Promise<{ title: string }> {
  const lang = await getLang();
  return { title: t(lang, "checkout.title") };
}

export default async function CheckoutPage() {
  const lang = await getLang();

  return (
    <div className="mx-auto max-w-[36rem] px-4 py-20 text-center sm:px-6">
      <p className="font-display text-sm font-bold text-rouge">{t(lang, "checkout.comingSoon")}</p>
      <h1 className="mt-3 text-titre">{t(lang, "checkout.title")}</h1>
      <p className="mt-4 text-gris">{t(lang, "checkout.comingSoonBody")}</p>

      <button
        type="button"
        disabled
        className="mt-8 w-full cursor-not-allowed bg-ligne px-6 py-3 font-display font-bold text-gris"
      >
        {t(lang, "cart.checkout")}
      </button>

      <Link href="/panier" className="mt-6 inline-block text-sm underline hover:text-rouge">
        {t(lang, "checkout.backToCart")}
      </Link>
    </div>
  );
}
