function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true">
      <path
        d="M10 1.6l2.47 5.28 5.53.72-4.05 3.9 1.03 5.66L10 14.4l-4.98 2.76 1.03-5.66L2 7.6l5.53-.72L10 1.6z"
        fill={filled ? "var(--color-or)" : "var(--color-ligne)"}
      />
    </svg>
  );
}

export function Rating({ value, count }: { value: number; count: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((step) => (
          <Star key={step} filled={rounded >= step} />
        ))}
      </span>
      <span className="text-xs text-gris">
        {count > 0 ? `${value.toFixed(1)} (${count})` : "—"}
      </span>
    </span>
  );
}
