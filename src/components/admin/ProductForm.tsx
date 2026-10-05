"use client";

import { useActionState } from "react";
import { saveProduct } from "@/app/admin/actions";
import { readSpecs } from "@/lib/slug";
import { fr } from "@/i18n/fr";
import { stringifySpecs } from "@/lib/slug";
import { AdminError, Checkbox, Field, Select, TextArea, TextInput } from "./Fields";
import { SubmitButton } from "./SubmitButton";

type Defaults = {
  id: number;
  sku: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  brandId: number;
  categoryId: number;
  price: number;
  promoPrice: number | null;
  stock: number;
  imageUrl: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  specsJson: string | null;
  rating: number;
  reviewCount: number;
  isActive: boolean;
} | null;

export function ProductForm({
  defaults,
  brands,
  categories,
}: {
  defaults: Defaults;
  brands: { id: number; name: string }[];
  categories: { id: number; nameFr: string }[];
}) {
  const [state, formAction] = useActionState(saveProduct, null);

  return (
    <form action={formAction} className="space-y-4">
      <AdminError state={state} />
      {defaults ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={fr["admin.fieldSku"]}>
          <TextInput name="sku" defaultValue={defaults?.sku} required />
        </Field>
        <Field label={fr["admin.fieldSlug"]}>
          <TextInput name="slug" defaultValue={defaults?.slug} placeholder="auto" />
        </Field>
        <Field label={fr["admin.fieldCategory"]}>
          <Select
            name="categoryId"
            defaultValue={defaults?.categoryId}
            options={categories.map((c) => ({ value: c.id, label: c.nameFr }))}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={fr["admin.fieldNameFr"]}>
          <TextInput name="nameFr" defaultValue={defaults?.nameFr} required />
        </Field>
        <Field label={fr["admin.fieldNameAr"]}>
          <TextInput name="nameAr" defaultValue={defaults?.nameAr} dir="rtl" required />
        </Field>
        <Field label={fr["admin.fieldBrand"]}>
          <Select
            name="brandId"
            defaultValue={defaults?.brandId}
            options={brands.map((b) => ({ value: b.id, label: b.name }))}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label={fr["admin.fieldPrice"]}>
          <TextInput name="price" defaultValue={defaults?.price} required />
        </Field>
        <Field label={fr["admin.fieldPromoPrice"]} hint={fr["admin.fieldPromoOptional"]}>
          <TextInput name="promoPrice" defaultValue={defaults?.promoPrice ?? ""} />
        </Field>
        <Field label={fr["admin.fieldStock"]}>
          <TextInput name="stock" defaultValue={defaults?.stock ?? 0} />
        </Field>
        <Field label={fr["admin.fieldActive"]}>
          <div className="pt-2">
            <Checkbox name="isActive" label="—" defaultChecked={defaults?.isActive ?? true} />
          </div>
        </Field>
      </div>

      <Field label={fr["admin.fieldImage"]}>
        <TextInput name="imageUrl" defaultValue={defaults?.imageUrl} required />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={fr["admin.fieldDescriptionFr"]}>
          <TextArea name="descriptionFr" defaultValue={defaults?.descriptionFr} />
        </Field>
        <Field label={fr["admin.fieldDescriptionAr"]}>
          <TextArea name="descriptionAr" defaultValue={defaults?.descriptionAr} dir="rtl" />
        </Field>
      </div>

      <Field label={fr["admin.fieldSpecs"]}>
        <TextArea
          name="specs"
          defaultValue={defaults ? stringifySpecs(readSpecs(defaults.specsJson)) : ""}
          rows={6}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={fr["admin.fieldRating"]}>
          <TextInput name="rating" defaultValue={defaults?.rating ?? 0} />
        </Field>
        <Field label={fr["admin.fieldReviews"]}>
          <TextInput name="reviewCount" defaultValue={defaults?.reviewCount ?? 0} />
        </Field>
      </div>

      <SubmitButton className="bg-encre text-white hover:bg-rouge" pendingLabel="…">
        {defaults ? fr["admin.save"] : fr["admin.new"]}
      </SubmitButton>
    </form>
  );
}