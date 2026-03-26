"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/types";
import { uploadBusinessImage } from "@/lib/cloudinary";

// ─── Profile update (consumer & merchant owner info) ─────────────────────────

const updateProfileSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  phone: z.string().optional(),
});

export async function updateProfile(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Giriş yapmanız gerekiyor." };

    const { name, phone } = updateProfileSchema.parse(input);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim(), phone: phone?.trim() || null },
    });

    revalidatePath("/consumer/settings");
    revalidatePath("/merchant/settings");
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message };
    return { success: false, error: "Profil güncellenemedi." };
  }
}

// ─── Business info update (merchant) ─────────────────────────────────────────

const updateBusinessSchema = z.object({
  name: z.string().min(2, "İşletme adı en az 2 karakter olmalıdır"),
  description: z.string().optional(),
  address: z.string().min(5, "Adres en az 5 karakter olmalıdır"),
  phone: z.string().optional(),
  operatingHours: z.string().min(1, "Çalışma saatleri zorunludur"),
});

export async function updateBusiness(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Giriş yapmanız gerekiyor." };

    const data = updateBusinessSchema.parse(input);

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
    });
    if (!business) return { success: false, error: "Aktif işletme bulunamadı." };

    await prisma.business.update({
      where: { id: business.id },
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        address: data.address.trim(),
        phone: data.phone?.trim() || null,
        operatingHours: data.operatingHours.trim(),
      },
    });

    revalidatePath("/merchant/settings");
    revalidatePath("/merchant");
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message };
    return { success: false, error: "İşletme bilgileri güncellenemedi." };
  }
}

// ─── Business image upload (Cloudinary) ──────────────────────────────────────

export async function updateBusinessImage(imageDataUrl: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Giriş yapmanız gerekiyor." };

    if (!imageDataUrl.startsWith("data:image/")) {
      return { success: false, error: "Geçersiz dosya formatı. JPEG veya PNG yükleyin." };
    }

    // ~5 MB base64 ≈ 3.75 MB raw
    if (imageDataUrl.length > 5_000_000) {
      return { success: false, error: "Dosya boyutu çok büyük. Maksimum 3.5 MB." };
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
    });
    if (!business) return { success: false, error: "Aktif işletme bulunamadı." };

    const imageUrl = await uploadBusinessImage(imageDataUrl, `business-${business.id}`);

    await prisma.business.update({
      where: { id: business.id },
      data: { imageUrl },
    });

    revalidatePath("/merchant/settings");
    revalidatePath("/consumer");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Fotoğraf yüklenemedi." };
  }
}

// ─── Box Templates ────────────────────────────────────────────────────────────

const boxTemplateSchema = z.object({
  label: z.string().min(1, "Şablon adı zorunludur"),
  category: z.enum([
    "BAKERY", "PATISSERIE", "CAFE",
  ]),
  description: z.string().optional(),
  originalPrice: z.number().min(0.01, "Orijinal fiyat zorunludur"),
  discountedPrice: z.number().min(0.01, "İndirimli fiyat zorunludur"),
});

export async function createBoxTemplate(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Giriş yapmanız gerekiyor." };

    const data = boxTemplateSchema.parse(input);

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
    });
    if (!business) return { success: false, error: "Aktif işletme bulunamadı." };

    if (data.discountedPrice >= data.originalPrice) {
      return { success: false, error: "İndirimli fiyat orijinal fiyattan düşük olmalıdır." };
    }

    const template = await prisma.boxTemplate.create({
      data: {
        businessId: business.id,
        label: data.label.trim(),
        category: data.category,
        description: data.description?.trim() || null,
        originalPrice: data.originalPrice,
        discountedPrice: data.discountedPrice,
      },
    });

    revalidatePath("/merchant/templates");
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message };
    return { success: false, error: "Şablon oluşturulamadı." };
  }
}

export async function deleteBoxTemplate(templateId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Giriş yapmanız gerekiyor." };

    const template = await prisma.boxTemplate.findUnique({
      where: { id: templateId },
      include: { business: { select: { ownerId: true } } },
    });

    if (!template || template.business.ownerId !== session.user.id) {
      return { success: false, error: "Şablon bulunamadı." };
    }

    await prisma.boxTemplate.delete({ where: { id: templateId } });

    revalidatePath("/merchant/templates");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Şablon silinemedi." };
  }
}
