import type { ActionState } from "@/app/admin/actions";

/** Small labelled wrapper so every admin field looks the same. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gris">{label}</span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block text-xs text-gris-clair">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  name,
  defaultValue,
  placeholder,
  required,
  dir,
}: {
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <input
      name={name}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      required={required}
      dir={dir}
      className="w-full border border-ligne bg-white px-3 py-2 text-sm outline-none focus:border-encre"
    />
  );
}

export function TextArea({
  name,
  defaultValue,
  rows = 4,
  dir,
}: {
  name: string;
  defaultValue?: string | null;
  rows?: number;
  dir?: "ltr" | "rtl";
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue ?? ""}
      rows={rows}
      dir={dir}
      className="w-full resize-y border border-ligne bg-white px-3 py-2 text-sm outline-none focus:border-encre"
    />
  );
}

export function Select({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue?: number | null;
  options: { value: number; label: string }[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      className="w-full border border-ligne bg-white px-3 py-2 text-sm outline-none focus:border-encre"
    >
      <option value="">—</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked ?? true}
        className="h-4 w-4 accent-[#d91e28]"
      />
      {label}
    </label>
  );
}

export function AdminError({ state }: { state: ActionState }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className="mb-4 border border-rouge bg-white px-3 py-2 text-sm text-rouge">
      {state.error}
    </p>
  );
}