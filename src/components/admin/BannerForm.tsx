"use client";

import { useActionState } from "react";
import { saveBanner } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { AdminError, Checkbox, Field, TextArea, TextInput } from "./Fields";
import { SubmitButton } from "./SubmitButton";

type Defaults = {
  id: number;
  titleFr: string;
  titleAr: string;
  subtitleFr: string | null;
  subtitleAr: string | null;
  imageUrl: string;
  ctaLabelFr: string | null;
  ctaLabelAr: string | null;
  ctaHref: string | null;
  order: number;
  isActive: boolean;
} | null;

export function BannerForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction] = useActionState(saveBanner, null);

  return (
    <form action={formAction} className="space-y-4">
      <AdminError state={state} />
      {defaults ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={fr["admin.fieldTitleFr"]}>
          <TextInput name="titleFr" defaultValue={defaults?.titleFr} required />
        </Field>
        <Field label={fr["admin.fieldTitleAr"]}>
          <TextInput name="titleAr" defaultValue={defaults?.titleAr} dir="rtl" required />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={fr["admin.fieldSubtitleFr"]}>
          <TextArea name="subtitleFr" defaultValue={defaults?.subtitleFr} rows={2} />
        </Field>
        <Field label={fr["admin.fieldSubtitleAr"]}>
          <TextArea name="subtitleAr" defaultValue={defaults?.subtitleAr} rows={2} dir="rtl" />
        </Field>
      </div>

      <Field label={fr["admin.fieldImage"]}>
        <TextInput name="imageUrl" defaultValue={defaults?.imageUrl} required />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={fr["admin.fieldCtaFr"]}>
          <TextInput name="ctaLabelFr" defaultValue={defaults?.ctaLabelFr} />
        </Field>
        <Field label={fr["admin.fieldCtaAr"]}>
          <TextInput name="ctaLabelAr" defaultValue={defaults?.ctaLabelAr} dir="rtl" />
        </Field>
        <Field label={fr["admin.fieldCtaHref"]}>
          <TextInput name="ctaHref" defaultValue={defaults?.ctaHref} placeholder="/c/televiseurs" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={fr["admin.fieldOrder"]}>
          <TextInput name="order" defaultValue={defaults?.order ?? 0} />
        </Field>
        <Field label={fr["admin.fieldActive"]}>
          <div className="pt-2">
            <Checkbox name="isActive" label="—" defaultChecked={defaults?.isActive ?? true} />
          </div>
        </Field>
      </div>

      <SubmitButton className="bg-encre text-white hover:bg-rouge" pendingLabel="…">
        {defaults ? fr["admin.save"] : fr["admin.new"]}
      </SubmitButton>
    </form>
  );
}