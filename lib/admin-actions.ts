"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Yetkisiz erişim");
  }
}

export async function approveBusiness(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.business.update({
      where: { id },
      data: { isApproved: true, isActive: true },
    });
    revalidatePath("/admin/businesses");
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bir hata oluştu" };
  }
}

export async function rejectBusiness(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.business.update({
      where: { id },
      data: { isApproved: false, isActive: false },
    });
    revalidatePath("/admin/businesses");
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bir hata oluştu" };
  }
}
