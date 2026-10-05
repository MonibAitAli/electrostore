import Link from "next/link";
import { t, type Lang } from "@/i18n";

export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="mt-16 border-t border-ligne bg-pierre">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-encre">{t(lang, "site.name")}</p>
          <p className="mt-2 max-w-[34ch] text-sm text-gris">{t(lang, "footer.tagline")}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold text-encre">{t(lang, "footer.shop")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/c/tv-video" className="text-gris hover:text-rouge">
                {lang === "ar" ? "التلفزيونات" : "Télévisions"}
              </Link>
            </li>
            <li>
              <Link href="/c/telephones" className="text-gris hover:text-rouge">
                {lang === "ar" ? "الهواتف" : "Téléphones"}
              </Link>
            </li>
            <li>
              <Link href="/c/electromenager" className="text-gris hover:text-rouge">
                {lang === "ar" ? "الأجهزة المنزلية" : "Électroménager"}
              </Link>
            </li>
            <li>
              <Link href="/recherche?q=" className="text-gris hover:text-rouge">
                {t(lang, "nav.search")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold text-encre">{t(lang, "footer.help")}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gris">
            <li>{t(lang, "strip.delivery")}</li>
            <li>{t(lang, "strip.warranty")}</li>
            <li>{t(lang, "strip.collect")}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold text-encre">{t(lang, "footer.contact")}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gris">
            <li>
              <a href={`tel:${t(lang, "footer.phone").replace(/\s/g, "")}`} className="hover:text-rouge">
                {t(lang, "footer.phone")}
              </a>
            </li>
            <li>
              <a href={`mailto:${t(lang, "footer.email")}`} className="hover:text-rouge">
                {t(lang, "footer.email")}
              </a>
            </li>
            <li className="text-gris-clair">{t(lang, "footer.cities")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ligne">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-gris sm:px-6">
          <span>
            © {new Date().getFullYear()} {t(lang, "site.name")} — {t(lang, "footer.rights")}
          </span>
          <Link href="/admin" className="hover:text-rouge">
            {t(lang, "footer.admin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
