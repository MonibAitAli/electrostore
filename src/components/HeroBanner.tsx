import Link from "next/link";
import { t, type Lang } from "@/i18n";
import { localizedTitle } from "@/i18n";
import type { Banner } from "@/generated/prisma/client";

export function HeroBanner({ banner, lang }: { banner: Banner | null; lang: Lang }) {
  if (!banner) return null;

  const title = localizedTitle(lang, banner);
  const subtitle = lang === "ar" ? banner.subtitleAr : banner.subtitleFr;
  const cta = lang === "ar" ? banner.ctaLabelAr : banner.ctaLabelFr;

  return (
    <section className="hero-entree bg-encre" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14">
        <div className="order-2 lg:order-1">
          <h1 id="hero-title" className="text-hero text-white">
            {title}
          </h1>
          {subtitle ? <p className="mt-4 max-w-[46ch] text-soustitre text-white/75">{subtitle}</p> : null}

          {banner.ctaHref && cta ? (
            <Link
              href={banner.ctaHref}
              className="mt-7 inline-block bg-rouge px-6 py-3 font-display text-base font-bold text-white transition-colors hover:bg-rouge-fonce"
            >
              {cta}
            </Link>
          ) : null}

          <p className="mt-6 text-sm text-white/50">{t(lang, "strip.delivery")}</p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="vignette-media aspect-[4/3] overflow-hidden border border-white/10">
            <img
              src={banner.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
