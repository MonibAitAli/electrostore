"use client";

import { useActionState } from "react";
import { saveBrand } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { AdminError, Field, TextInput } from "./Fields";
import { SubmitButton } from "./SubmitButton";

type Defaults = { id: number; slug: string; name: string; logoUrl: string | null } | null;

export function BrandForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction] = useActionState(saveBrand, null);

  return (
    <form action={formAction} className="space-y-4">
      <AdminError state={state} />
      {defaults ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Marque">
          <TextInput name="name" defaultValue={defaults?.name} required />
        </Field>
        <Field label={fr["admin.fieldSlug"]}>
          <TextInput name="slug" defaultValue={defaults?.slug} placeholder="auto" />
        </Field>
        <Field label="Logo (URL)">
          <TextInput name="logoUrl" defaultValue={defaults?.logoUrl} />
        </Field>
      </div>

      <SubmitButton className="bg-encre text-white hover:bg-rouge" pendingLabel="…">
        {defaults ? fr["admin.save"] : fr["admin.new"]}
      </SubmitButton>
    </form>
  );
}