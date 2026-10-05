"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Lang } from "@/i18n";
import { persistLangCookie } from "@/lib/langClient";

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: Lang) => {
    if (next === lang) return;
    // A year, so the choice survives the browsing session being cleared.
    persistLangCookie(next);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div
      className="flex items-center border border-ligne text-xs"
      role="group"
      aria-label={lang === "ar" ? "اللغة" : "Langue"}
    >
      {(["fr", "ar"] as const).map((option) => {
        const active = option === lang;
        return (
          <button
            key={option}
            type="button"
            onClick={() => switchTo(option)}
            disabled={pending}
            aria-current={active ? "true" : undefined}
            className={`px-2 py-1 font-semibold uppercase transition-colors ${
              active ? "bg-encre text-white" : "text-gris hover:text-encre"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
