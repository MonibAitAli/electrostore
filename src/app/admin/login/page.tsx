import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { fr } from "@/i18n/fr";
import { isAdmin } from "@/lib/session";

export async function generateMetadata(): Promise<{ title: string }> {
  return { title: fr["admin.loginTitle"] };
}

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid flex-1 place-items-center bg-pierre px-4 py-20">
      <div className="w-full max-w-sm border border-ligne bg-white p-6">
        <h1 className="text-titre">{fr["admin.loginTitle"]}</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
        <Link href="/" className="mt-6 inline-block text-sm underline hover:text-rouge">
          {fr["admin.backToSite"]}
        </Link>
      </div>
    </main>
  );
}