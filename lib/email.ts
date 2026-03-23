/**
 * Email utility — wraps Resend SDK.
 * Falls back to console.log when RESEND_API_KEY is not set so that
 * the full email flow can be verified during development.
 *
 * From address: set EMAIL_FROM env var, or verify foodrescue.com.tr in Resend
 * dashboard and update FROM below. Until domain is verified, Resend's sandbox
 * address (onboarding@resend.dev) will be used automatically.
 *
 * Never a "use server" file — imported directly from server actions and API routes.
 */

import { maskPickupCode } from "@/lib/utils";

// Lazy singleton so the module can be imported without crashing when the key is absent
let _resend: import("resend").Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    const { Resend } = require("resend") as typeof import("resend");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM =
  process.env.EMAIL_FROM ?? "FoodRescue <noreply@foodrescue.com.tr>";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Internal dispatch ─────────────────────────────────────────────────────────

async function dispatch(opts: { to: string; subject: string; html: string }) {
  const client = getResend();

  if (!client) {
    const text = opts.html.replace(/<[^>]*>/g, "").replace(/\s{2,}/g, " ").trim();
    console.log(
      `\n📧 [EMAIL — console only, RESEND_API_KEY not set]\n` +
      `   To:      ${opts.to}\n` +
      `   Subject: ${opts.subject}\n` +
      `   Body:    ${text.slice(0, 400)}${text.length > 400 ? "…" : ""}\n`
    );
    return;
  }

  try {
    await client.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch (err) {
    // Email failures must never break the business flow — log and continue
    console.error("[email] send failed:", err);
  }
}

// ─── Shared layout helpers ─────────────────────────────────────────────────────

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", SUSHI: "Suşi", GROCERY: "Market", DELI: "Şarküteri",
  CAFE: "Kafe", PREPARED_MEAL: "Hazır Yemek", PRODUCE: "Manav", MIXED: "Karışık",
};

/** Wraps content in the branded FoodRescue email shell. */
function template(content: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FoodRescue</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#059669;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">🌿 FoodRescue</p>
              <p style="margin:6px 0 0;color:#a7f3d0;font-size:13px;font-weight:500;">Gıda İsrafına Son — İndirimli Kutularla Tasarruf Et</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-radius:0 0 16px 16px;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} FoodRescue. Tüm hakları saklıdır.
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">
                <a href="${APP_URL}" style="color:#059669;text-decoration:none;">foodrescue.com.tr</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/consumer" style="color:#059669;text-decoration:none;">Kutuları Keşfet</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">
                Bu e-postayı almak istemiyorsanız hesabınızı silebilirsiniz.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Reusable "big CTA button" row. */
function ctaButton(href: string, label: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0;">
    <tr>
      <td align="center">
        <a href="${href}"
           style="background-color:#059669;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;display:inline-block;letter-spacing:0.2px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

/** Two-column detail row inside an info card. */
function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:7px 0;color:#6b7280;font-size:14px;vertical-align:top;width:40%;">${label}</td>
    <td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;vertical-align:top;">${value}</td>
  </tr>`;
}

// ─── 1. Email verification ──────────────────────────────────────────────────────

export async function sendEmailVerification(p: {
  to: string;
  name: string;
  token: string;
}) {
  const verifyUrl = `${APP_URL}/email-dogrula?token=${p.token}`;

  await dispatch({
    to: p.to,
    subject: "FoodRescue — E-posta adresinizi doğrulayın",
    html: template(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Merhaba, ${p.name}! 👋</h1>
      <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
        FoodRescue'ya hoş geldin! Hesabını aktifleştirmek için e-posta adresini doğrulaman gerekiyor.
      </p>

      ${ctaButton(verifyUrl, "E-postamı Doğrula →")}

      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
        Düğme çalışmıyorsa aşağıdaki linki tarayıcına kopyala:
      </p>
      <p style="margin:0;background-color:#f3f4f6;border-radius:8px;padding:12px 16px;font-size:12px;color:#059669;word-break:break-all;">
        ${verifyUrl}
      </p>

      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
        Bu link 24 saat geçerlidir. İsteği sen yapmadıysan bu e-postayı görmezden gelebilirsin.
      </p>
    `),
  });
}

// ─── 2. Password reset ──────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(p: {
  to: string;
  name: string;
  token: string;
}) {
  const resetUrl = `${APP_URL}/sifre-sifirla/yeni?token=${p.token}`;

  await dispatch({
    to: p.to,
    subject: "FoodRescue — Şifre sıfırlama talebi",
    html: template(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Şifre Sıfırlama</h1>
      <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
        Merhaba ${p.name}, FoodRescue hesabın için şifre sıfırlama talebi aldık.
        Aşağıdaki düğmeye tıklayarak yeni şifreni belirleyebilirsin.
      </p>

      ${ctaButton(resetUrl, "Şifremi Sıfırla →")}

      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
        Düğme çalışmıyorsa aşağıdaki linki tarayıcına kopyala:
      </p>
      <p style="margin:0;background-color:#f3f4f6;border-radius:8px;padding:12px 16px;font-size:12px;color:#059669;word-break:break-all;">
        ${resetUrl}
      </p>

      <table style="width:100%;border-collapse:collapse;margin-top:24px;background-color:#fef3c7;border-radius:10px;padding:14px 16px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:14px 16px;font-size:13px;color:#92400e;">
            ⚠️ Bu link <strong>1 saat</strong> geçerlidir. Bu talebi sen yapmadıysan şifreni değiştirmeni öneririz.
          </td>
        </tr>
      </table>
    `),
  });
}

// ─── 3. Consumer: order confirmed ──────────────────────────────────────────────

export async function sendOrderConfirmation(p: {
  to: string;
  customerName: string;
  pickupCode: string;
  businessName: string;
  businessAddress: string;
  pickupStart: string;
  pickupEnd: string;
  quantity: number;
  totalPrice: number;
}) {
  await dispatch({
    to: p.to,
    subject: `✅ Siparişin Onaylandı — Teslim Kodu: ${p.pickupCode}`,
    html: template(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Siparişin onaylandı! 🎉</h1>
      <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
        Merhaba ${p.customerName}! Sürpriz kutunu almak için aşağıdaki kodu işletmeye göster.
      </p>

      <!-- Pickup code card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;margin:0 0 28px;">
        <tr>
          <td style="padding:24px;text-align:center;">
            <p style="margin:0 0 10px;color:#065f46;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
              Teslim Alma Kodun
            </p>
            <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:42px;font-weight:800;letter-spacing:0.35em;color:#111827;line-height:1;">
              ${p.pickupCode}
            </p>
            <p style="margin:10px 0 0;font-size:12px;color:#6b7280;">Bu kodu kasada göster · Mağazada tekrar ödeme yapma</p>
          </td>
        </tr>
      </table>

      <!-- Order details -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">
        <tr>
          <td style="background-color:#f9fafb;padding:10px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">Sipariş Detayları</p>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 16px 12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${detailRow("İşletme", p.businessName)}
              ${detailRow("Adres", p.businessAddress)}
              ${detailRow("Teslim Alma", `🕐 ${fmtTime(p.pickupStart)} – ${fmtTime(p.pickupEnd)}`)}
              ${detailRow("Adet", `${p.quantity} kutu`)}
              ${detailRow("Ödenen Tutar", `<span style="color:#059669;">₺${p.totalPrice.toFixed(2)}</span>`)}
            </table>
          </td>
        </tr>
      </table>

      ${ctaButton(`${APP_URL}/consumer/orders`, "Siparişlerimi Gör →")}

      <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
        Gıda israfını önlediğin için teşekkürler! 🌍
      </p>
    `),
  });
}

// ─── 4. Consumer: order cancelled ──────────────────────────────────────────────

export async function sendOrderCancellation(p: {
  to: string;
  customerName: string;
  businessName: string;
  pickupCode: string;
  totalPrice: number;
  refunded: boolean;
}) {
  await dispatch({
    to: p.to,
    subject: `Siparişin İptal Edildi${p.refunded ? " — İade Başlatıldı" : ""}`,
    html: template(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Sipariş İptal Edildi</h1>
      <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
        Merhaba ${p.customerName}, <strong>${p.businessName}</strong> için verdiğin sipariş
        (Kod: <span style="font-family:monospace;font-weight:700;">${p.pickupCode}</span>) iptal edildi.
      </p>

      <!-- Refund status card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="border-radius:10px;background-color:${p.refunded ? "#ecfdf5" : "#f9fafb"};border:1px solid ${p.refunded ? "#a7f3d0" : "#e5e7eb"};margin:0 0 28px;">
        <tr>
          <td style="padding:16px 20px;">
            ${p.refunded
              ? `<p style="margin:0;font-size:14px;color:#065f46;">
                   💳 <strong>₺${p.totalPrice.toFixed(2)}</strong> tutarındaki ödemen iade sürecine alındı.
                   Kart ekstrenize <strong>3–5 iş günü</strong> içinde yansır.
                 </p>`
              : `<p style="margin:0;font-size:14px;color:#4b5563;">
                   Bu sipariş için ödeme tahsil edilmemişti — ücret yansımayacak.
                 </p>`
            }
          </td>
        </tr>
      </table>

      <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6;">
        Başka sürpriz kutular seni bekliyor! 🎁 Tüm seçenekleri keşfetmek için aşağıdaki düğmeye tıkla.
      </p>

      ${ctaButton(`${APP_URL}/consumer`, "Kutuları Keşfet →")}
    `),
  });
}

// ─── 5. Merchant: new order placed ─────────────────────────────────────────────

export async function sendMerchantNewOrder(p: {
  to: string;
  businessName: string;
  customerName: string;
  quantity: number;
  boxCategory: string;
  pickupCode: string;
  pickupStart: string;
  pickupEnd: string;
  merchantAmount: number;
}) {
  const categoryLabel = BOX_LABELS[p.boxCategory] ?? p.boxCategory;

  await dispatch({
    to: p.to,
    subject: `📦 Yeni Sipariş — ${p.quantity}× ${categoryLabel} Kutusu`,
    html: template(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Yeni Sipariş Geldi! 📦</h1>
      <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
        <strong>${p.businessName}</strong> işletmesi için yeni bir sipariş var. Müşteri belirtilen saatte gelecek.
      </p>

      <!-- Order details -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;margin:0 0 28px;">
        <tr>
          <td style="background-color:#f9fafb;padding:10px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">Sipariş Detayları</p>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 16px 12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${detailRow("Müşteri", p.customerName)}
              ${detailRow("Ürün", `${p.quantity}× ${categoryLabel} Kutusu`)}
              ${detailRow("Teslim Kodu (kısmi)", `<span style="font-family:monospace;font-weight:700;">${maskPickupCode(p.pickupCode)}</span>`)}
              ${detailRow("Teslim Penceresi", `🕐 ${fmtTime(p.pickupStart)} – ${fmtTime(p.pickupEnd)}`)}
              ${detailRow("Sana Düşen", `<span style="color:#059669;font-weight:700;">₺${p.merchantAmount.toFixed(2)}</span>`)}
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="border-radius:10px;background-color:#fef3c7;border:1px solid #fde68a;margin:0 0 20px;">
        <tr>
          <td style="padding:14px 16px;font-size:13px;color:#92400e;">
            💡 Tam kodu doğrulamak için <strong>Teslim Alma Doğrulama</strong> sayfasını kullan. Müşteri kodu gösterdiğinde "Doğrula ve Tamamla"ya bas.
          </td>
        </tr>
      </table>

      ${ctaButton(`${APP_URL}/merchant/orders`, "Siparişleri Gör →")}
    `),
  });
}

// ─── 6. Merchant: order cancelled ──────────────────────────────────────────────

export async function sendMerchantOrderCancelled(p: {
  to: string;
  businessName: string;
  boxCategory: string;
  quantity: number;
  pickupCode: string;
}) {
  const categoryLabel = BOX_LABELS[p.boxCategory] ?? p.boxCategory;

  await dispatch({
    to: p.to,
    subject: `Bir Sipariş İptal Edildi — Stok Güncellendi`,
    html: template(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Sipariş İptal Edildi</h1>
      <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
        <strong>${p.businessName}</strong> işletmesi için bir sipariş müşteri tarafından iptal edildi.
        Stok otomatik olarak güncellendi ve kutu tekrar görünür oldu.
      </p>

      <!-- Details -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;margin:0 0 28px;">
        <tr>
          <td style="background-color:#f9fafb;padding:10px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">İptal Edilen Sipariş</p>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 16px 12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${detailRow("Ürün", `${p.quantity}× ${categoryLabel} Kutusu`)}
              ${detailRow("Sipariş Kodu", `<span style="font-family:monospace;">${p.pickupCode}</span>`)}
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6;">
        Herhangi bir sorunuz varsa destek ekibimizle iletişime geçebilirsiniz.
      </p>

      ${ctaButton(`${APP_URL}/merchant`, "Panele Dön →")}
    `),
  });
}
