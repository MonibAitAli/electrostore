import type { Metadata } from "next";
import { Archivo, Barlow, IBM_Plex_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import { CartProvider } from "@/components/CartProvider";
import { DEFAULT_LANG, LANG_COOKIE, dirOf, isLang } from "@/i18n";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Electro — Télévisions, électroménager, audio et informatique",
    template: "%s — Electro",
  },
  description:
    "Téléviseurs, électroménager, audio, informatique et jeux. Livraison à domicile et retrait en magasin.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The language lives in a cookie rather than a route segment, so this has to
  // read it here to get <html lang dir> right on the first paint.
  const store = await cookies();
  const raw = store.get(LANG_COOKIE)?.value;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${archivo.variable} ${barlow.variable} ${plexArabic.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
