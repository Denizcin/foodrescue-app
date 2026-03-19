"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "@auth/core/errors";
import crypto from "crypto";
import { sendEmailVerification } from "@/lib/email";

// ─── Consumer kayıt ──────────────────────────────────────────────────────────

export async function registerConsumer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const password = formData.get("password") as string;

  if (!name?.trim() || !email?.trim() || !password) {
    return { error: "Ad, e-posta ve şifre zorunludur." };
  }
  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalıdır." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Bu e-posta adresi zaten kullanımda." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      passwordHash,
      role: "CONSUMER",
    },
  });

  // Send email verification
  void (async () => {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await prisma.verificationToken.create({
        data: { identifier: user.email, token, expires },
      });
      await sendEmailVerification({ to: user.email, name: user.name, token });
    } catch (e) {
      console.error("[email] verification send failed:", e);
    }
  })();

  // Kayıt sonrası otomatik giriş
  await signIn("credentials", {
    email: email.trim().toLowerCase(),
    password,
    redirectTo: "/consumer",
  });
}

// ─── İşletme kayıt ───────────────────────────────────────────────────────────

export async function registerMerchant(formData: FormData) {
  const ownerName = formData.get("ownerName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const password = formData.get("password") as string;
  const businessName = formData.get("businessName") as string;
  const businessCategory = formData.get("businessCategory") as string;
  const address = formData.get("address") as string;
  const operatingHours = formData.get("operatingHours") as string;

  if (!ownerName?.trim() || !email?.trim() || !password || !businessName?.trim() || !address?.trim()) {
    return { error: "Zorunlu alanlar eksik." };
  }
  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalıdır." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Bu e-posta adresi zaten kullanımda." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: ownerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      passwordHash,
      role: "MERCHANT",
    },
  });

  await prisma.business.create({
    data: {
      ownerId: user.id,
      name: businessName.trim(),
      category: businessCategory as any,
      address: address.trim(),
      operatingHours: operatingHours?.trim() || "Pzt-Cmt 09:00-18:00",
      locationLat: 41.015,
      locationLng: 28.979,
      isApproved: false,
    },
  });

  // Send email verification for merchant owner
  void (async () => {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await prisma.verificationToken.create({
        data: { identifier: user.email, token, expires },
      });
      await sendEmailVerification({ to: user.email, name: user.name, token });
    } catch (e) {
      console.error("[email] merchant verification send failed:", e);
    }
  })();

  await signIn("credentials", {
    email: email.trim().toLowerCase(),
    password,
    redirectTo: "/merchant",
  });
}

// ─── Giriş ───────────────────────────────────────────────────────────────────

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Look up role before signing in so we can redirect to the correct portal
  const user = await prisma.user.findUnique({
    where: { email: email?.trim().toLowerCase() },
    select: { role: true },
  });

  const redirectTo =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "MERCHANT"
      ? "/merchant"
      : "/consumer";

  try {
    await signIn("credentials", {
      email: email?.trim().toLowerCase(),
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-posta veya şifre hatalı." };
    }
    throw error;
  }
}

// ─── Şifre sıfırlama talebi ─────────────────────────────────────────────────

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "E-posta adresi zorunludur." };

  const user = await prisma.user.findUnique({ where: { email } });

  // Güvenlik için kullanıcı bulunamasa da başarılı mesaj göster
  if (!user) {
    return { success: true };
  }

  // Eski token'ları sil
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  // TODO: Resend ile email gönder
  // await sendPasswordResetEmail(email, token);
  // Geliştirme ortamında konsola yaz:
  console.log(`[DEV] Şifre sıfırlama linki: /sifre-sifirla/yeni?token=${token}`);

  return { success: true };
}

// ─── Yeni şifre kaydetme ─────────────────────────────────────────────────────

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) return { error: "Geçersiz veya süresi dolmuş link." };
  if (!password || password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalıdır." };
  }
  if (password !== confirmPassword) {
    return { error: "Şifreler eşleşmiyor." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return { error: "Bu link geçersiz veya süresi dolmuş. Lütfen tekrar talep edin." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { success: true };
}

// ─── E-posta doğrulama ────────────────────────────────────────────────────────

export async function verifyEmail(token: string) {
  if (!token) return { error: "Geçersiz doğrulama linki." };

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { error: "Bu link geçersiz veya süresi dolmuş. Yeni bir doğrulama e-postası isteyin." };
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return { success: true };
}

export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: true }; // don't reveal existence

  if (user.emailVerified) return { error: "E-posta zaten doğrulanmış." };

  // Delete old tokens
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } });
  await sendEmailVerification({ to: email, name: user.name, token });

  return { success: true };
}
