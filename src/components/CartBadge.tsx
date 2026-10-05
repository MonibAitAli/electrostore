"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartBadge({ label }: { label: string }) {
  const { count, ready } = useCart();

  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center gap-2 border border-encre px-3 py-2 text-sm font-semibold transition-colors hover:bg-encre hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      <span>{label}</span>
      <span
        className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold ${
          ready && count > 0 ? "bg-rouge text-white" : "bg-ligne text-gris"
        }`}
      >
        {ready ? count : 0}
      </span>
    </Link>
  );
}
