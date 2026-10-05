"use client";

import { useActionState } from "react";
import { saveCategory } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { AdminError, Field, TextInput } from "./Fields";
import { SubmitButton } from "./SubmitButton";

type Defaults = {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string;
  imageUrl: string | null;
  order: number;
} | null;

export function CategoryForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction] = useActionState(saveCategory, null);

  return (
    <form action={formAction} className="space-y-4">
      <AdminError state={state} />
      {defaults ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={fr["admin.fieldNameFr"]}>
          <TextInput name="nameFr" defaultValue={defaults?.nameFr} required />
        </Field>
        <Field label={fr["admin.fieldNameAr"]}>
          <TextInput name="nameAr" defaultValue={defaults?.nameAr} dir="rtl" required />
        </Field>
        <Field label={fr["admin.fieldSlug"]}>
          <TextInput name="slug" defaultValue={defaults?.slug} placeholder="auto" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={fr["admin.fieldImage"]}>
          <TextInput name="imageUrl" defaultValue={defaults?.imageUrl} />
        </Field>
        <Field label={fr["admin.fieldOrder"]}>
          <TextInput name="order" defaultValue={defaults?.order ?? 0} />
        </Field>
      </div>

      <SubmitButton className="bg-encre text-white hover:bg-rouge" pendingLabel="…">
        {defaults ? fr["admin.save"] : fr["admin.new"]}
      </SubmitButton>
    </form>
  );
}