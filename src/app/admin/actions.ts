"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseSpecs, slugify } from "@/lib/slug";
import {
  checkAdminPassword,
  clearAdminSession,
  requireAdmin,
  setAdminSession,
} from "@/lib/session";

/**
 * The admin is French-only by design, so errors are read straight from the
 * French dictionary instead of resolving a locale.
 */
import { fr } from "@/i18n/fr";

export type ActionState = { error?: string } | null;

/** Turns the session guard into form state instead of a 500. */
async function guard(): Promise<ActionState> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return { error: fr["admin.errorSession"] };
  }
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function intOrNull(formData: FormData, key: string): number | null {
  const raw = text(formData, key);
  if (raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value);
}

function idOf(formData: FormData): number | null {
  const raw = text(formData, "id");
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

// ---------------------------------------------------------------- session ---

export async function login(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await checkAdminPassword(text(formData, "password")))) {
    return { error: fr["admin.wrongPassword"] };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- products ---

export async function saveProduct(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const id = idOf(formData);
  const sku = text(formData, "sku");
  const nameFr = text(formData, "nameFr");
  const nameAr = text(formData, "nameAr");
  const imageUrl = text(formData, "imageUrl");
  const slug = slugify(text(formData, "slug") || nameFr);
  const brandId = Number(text(formData, "brandId"));
  const categoryId = Number(text(formData, "categoryId"));
  const price = intOrNull(formData, "price");
  const promoPrice = intOrNull(formData, "promoPrice");
  const stock = intOrNull(formData, "stock");
  const rating = Number(text(formData, "rating") || 0);
  const reviewCount = intOrNull(formData, "reviewCount");

  if (!sku || !nameFr || !nameAr || !imageUrl || !slug) {
    return { error: fr["admin.errorRequired"] };
  }
  if (
    !Number.isInteger(brandId) ||
    brandId <= 0 ||
    !Number.isInteger(categoryId) ||
    categoryId <= 0 ||
    price === null ||
    stock === null ||
    reviewCount === null ||
    !Number.isFinite(promoPrice === null ? 0 : promoPrice) ||
    !Number.isFinite(rating)
  ) {
    return { error: fr["admin.errorNumber"] };
  }
  if (price <= 0 || (promoPrice !== null && promoPrice <= 0) || stock < 0) {
    return { error: fr["admin.errorNumber"] };
  }

  // Check uniqueness up front so the admin gets a readable message instead of
  // a raw constraint error. Single-writer admin, so a race is not a concern.
  const skuOwner = await prisma.product.findUnique({
    where: { sku },
    select: { id: true },
  });
  if (skuOwner && skuOwner.id !== id) return { error: fr["admin.errorSkuTaken"] };

  const slugOwner = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (slugOwner && slugOwner.id !== id) return { error: fr["admin.errorSlugTaken"] };

  const specs = parseSpecs(text(formData, "specs"));

  const data = {
    sku,
    slug,
    nameFr,
    nameAr,
    brandId,
    categoryId,
    price,
    // A blank promo field, or one that is not actually a discount, means no promo.
    promoPrice: promoPrice !== null && promoPrice < price ? promoPrice : null,
    stock,
    imageUrl,
    descriptionFr: text(formData, "descriptionFr") || null,
    descriptionAr: text(formData, "descriptionAr") || null,
    specsJson: specs.length > 0 ? JSON.stringify(specs) : null,
    rating: Math.min(5, Math.max(0, rating)),
    reviewCount,
    isActive: checkbox(formData, "isActive"),
  };

  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      await prisma.product.create({ data });
    }
  } catch {
    return { error: fr["admin.errorGeneric"] };
  }

  revalidatePath("/");
  revalidatePath("/admin/produits");
  revalidatePath("/c/[slug]", "page");
  redirect("/admin/produits?ok=1");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const denied = await guard();
  if (denied) return;

  const id = idOf(formData);
  if (!id) return;

  await prisma.product.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/produits");
  revalidatePath("/c/[slug]", "page");
  redirect("/admin/produits?ok=1");
}

// -------------------------------------------------------------- categories ---

export async function saveCategory(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const id = idOf(formData);
  const nameFr = text(formData, "nameFr");
  const nameAr = text(formData, "nameAr");
  const slug = slugify(text(formData, "slug") || nameFr);

  if (!nameFr || !nameAr || !slug) return { error: fr["admin.errorRequired"] };

  const slugOwner = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (slugOwner && slugOwner.id !== id) return { error: fr["admin.errorSlugTaken"] };

  const order = intOrNull(formData, "order");
  const data = {
    nameFr,
    nameAr,
    slug,
    imageUrl: text(formData, "imageUrl") || null,
    order: order !== null && Number.isFinite(order) ? order : 0,
  };

  try {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      await prisma.category.create({ data });
    }
  } catch {
    return { error: fr["admin.errorGeneric"] };
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/c/[slug]", "page");
  redirect("/admin/categories?ok=1");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const denied = await guard();
  if (denied) return;

  const id = idOf(formData);
  if (!id) return;

  const used = await prisma.product.count({ where: { categoryId: id } });
  if (used > 0) redirect(`/admin/categories?err=${used}`);

  await prisma.category.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories?ok=1");
}

// ------------------------------------------------------------------ brands ---

export async function saveBrand(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const id = idOf(formData);
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);

  if (!name || !slug) return { error: fr["admin.errorRequired"] };

  const slugOwner = await prisma.brand.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (slugOwner && slugOwner.id !== id) return { error: fr["admin.errorSlugTaken"] };

  const data = { name, slug, logoUrl: text(formData, "logoUrl") || null };

  try {
    if (id) {
      await prisma.brand.update({ where: { id }, data });
    } else {
      await prisma.brand.create({ data });
    }
  } catch {
    return { error: fr["admin.errorGeneric"] };
  }

  revalidatePath("/admin/marques");
  revalidatePath("/");
  redirect("/admin/marques?ok=1");
}

export async function deleteBrand(formData: FormData): Promise<void> {
  const denied = await guard();
  if (denied) return;

  const id = idOf(formData);
  if (!id) return;

  const used = await prisma.product.count({ where: { brandId: id } });
  if (used > 0) redirect(`/admin/marques?err=${used}`);

  await prisma.brand.delete({ where: { id } });

  revalidatePath("/admin/marques");
  redirect("/admin/marques?ok=1");
}

// ----------------------------------------------------------------- banners ---

export async function saveBanner(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const id = idOf(formData);
  const titleFr = text(formData, "titleFr");
  const titleAr = text(formData, "titleAr");
  const imageUrl = text(formData, "imageUrl");

  if (!titleFr || !titleAr || !imageUrl) return { error: fr["admin.errorRequired"] };

  const order = intOrNull(formData, "order");
  const data = {
    titleFr,
    titleAr,
    subtitleFr: text(formData, "subtitleFr") || null,
    subtitleAr: text(formData, "subtitleAr") || null,
    imageUrl,
    ctaLabelFr: text(formData, "ctaLabelFr") || null,
    ctaLabelAr: text(formData, "ctaLabelAr") || null,
    ctaHref: text(formData, "ctaHref") || null,
    order: order !== null && Number.isFinite(order) ? order : 0,
    isActive: checkbox(formData, "isActive"),
  };

  try {
    if (id) {
      await prisma.banner.update({ where: { id }, data });
    } else {
      await prisma.banner.create({ data });
    }
  } catch {
    return { error: fr["admin.errorGeneric"] };
  }

  revalidatePath("/");
  revalidatePath("/admin/bannieres");
  redirect("/admin/bannieres?ok=1");
}

export async function deleteBanner(formData: FormData): Promise<void> {
  const denied = await guard();
  if (denied) return;

  const id = idOf(formData);
  if (!id) return;

  await prisma.banner.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/bannieres");
  redirect("/admin/bannieres?ok=1");
}