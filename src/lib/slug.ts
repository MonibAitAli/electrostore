/** URL-safe slug: lowercase, accents folded, non-alphanumerics collapsed to dashes. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type Spec = { labelFr: string; labelAr: string; value: string };

/**
 * Admin writes one spec per line as `Libellé FR / Libellé AR = Valeur`, so both
 * languages get a real label. The Arabic half is optional; without it the
 * French label is reused so the row is never blank.
 */
export function parseSpecs(text: string): Spec[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): Spec | null => {
      const equals = line.indexOf("=");
      if (equals === -1) return null;
      const rawLabels = line.slice(0, equals).trim();
      const value = line.slice(equals + 1).trim();
      const slash = rawLabels.indexOf("/");
      const labelFr = (slash === -1 ? rawLabels : rawLabels.slice(0, slash)).trim();
      const labelAr = slash === -1 ? "" : rawLabels.slice(slash + 1).trim();
      if (!labelFr || !value) return null;
      return { labelFr, labelAr: labelAr || labelFr, value };
    })
    .filter((entry): entry is Spec => entry !== null);
}

export function stringifySpecs(specs: Spec[]): string {
  return specs
    .map((s) => `${s.labelFr} / ${s.labelAr} = ${s.value}`)
    .join("\n");
}

/** Reads the stored JSON back into a list, tolerating malformed rows. */
export function readSpecs(json: string | null | undefined): Spec[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (typeof entry !== "object" || entry === null) return [];
      const row = entry as Record<string, unknown>;
      const labelFr = typeof row.labelFr === "string" ? row.labelFr : "";
      const value = typeof row.value === "string" ? row.value : "";
      if (!labelFr || !value) return [];
      const labelAr = typeof row.labelAr === "string" ? row.labelAr : "";
      return [{ labelFr, labelAr: labelAr || labelFr, value }];
    });
  } catch {
    return [];
  }
}
