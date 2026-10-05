import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { fr } from "@/i18n/fr";
import { isAdmin } from "@/lib/session";

const NAV = [
  { href: "/admin", label: fr["admin.dashboard"] },
  { href: "/admin/produits", label: fr["admin.products"] },
  { href: "/admin/categories", label: fr["admin.categories"] },
  { href: "/admin/marques", label: fr["admin.brands"] },
  { href: "/admin/bannieres", label: fr["admin.banners"] },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // The login page sits outside this group, so it never hits this redirect.
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ligne bg-encre text-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <span className="font-display text-lg font-extrabold tracking-tight">Electro</span>
          <span className="text-xs uppercase tracking-widest text-white/50">
            {fr["admin.title"]}
          </span>

          <form action={logout} className="ms-auto">
            <SubmitButton className="border border-white/30 hover:bg-white hover:text-encre">
              {fr["admin.logout"]}
            </SubmitButton>
          </form>
          <Link href="/" className="text-sm underline hover:text-rouge">
            {fr["admin.backToSite"]}
          </Link>
        </div>

        <nav className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}