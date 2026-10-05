"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
  pendingLabel,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const base =
    "px-4 py-2 font-display text-sm font-bold transition-colors disabled:opacity-60";

  return (
    <button type="submit" disabled={pending} className={`${base} ${className}`}>
      {pending ? (pendingLabel ?? children) : children}
    </button>
  );
}