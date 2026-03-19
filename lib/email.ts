/**
 * Email utility — wraps Resend SDK.
 * Falls back to console.log when RESEND_API_KEY is not set so that
 * the full email flow can be verified during development.
 *
 * Never a "use server" file — imported directly from server actions and API routes.
 */

import { maskPickupCode } from "@/lib/utils";

// Lazy singleton so the module can be imported without crashing when the key is absent
let _resend: import("resend").Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    // Dynamic require so the module loads fine even without the package installed
    const { Resend } = require("resend") as typeof import("resend");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM =
  process.env.EMAIL_FROM ?? "FoodRescue <noreply@foodrescue.com>";

async function dispatch(opts: { to: string; subject: string; html: string }) {
  const client = getResend();

  if (!client) {
    // Dev / CI mode — print the full email to stdout so logic can be verified
    const text = opts.html.replace(/<[^>]*>/g, "").replace(/\s{2,}/g, " ").trim();
    console.log(
      `\n📧 [EMAIL — console only, RESEND_API_KEY not set]\n` +
      `   To:      ${opts.to}\n` +
      `   Subject: ${opts.subject}\n` +
      `   Body:    ${text.slice(0, 300)}${text.length > 300 ? "…" : ""}\n`
    );
    return;
  }

  try {
    await client.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
  } catch (err) {
    // Email failures must never break the business flow — log and continue
    console.error("[email] send failed:", err);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", SUSHI: "Suşi", GROCERY: "Market", DELI: "Şarküteri",
  CAFE: "Kafe", PREPARED_MEAL: "Hazır Yemek", PRODUCE: "Manav", MIXED: "Karışık",
};

// ─── Email verification ────────────────────────────────────────────────────────

export async function sendEmailVerification(p: { to: string; name: string; token: string }) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/email-dogrula?token=${p.token}`;
  await dispatch({
    to: p.to,
    subject: "FoodRescue — E-posta adresinizi doğrulayın",
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c1917;">
  <h2 style="color:#059669;">Merhaba, ${p.name}! 👋</h2>
  <p>Hesabınızı aktifleştirmek için aşağıdaki düğmeye tıklayın. Bu link 24 saat geçerlidir.</p>
  <div style="text-align:center;margin:28px 0;">
    <a href="${verifyUrl}" style="background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">
      E-postamı Doğrula →
    </a>
  </div>
  <p style="font-size:12px;color:#9ca3af;">Düğme çalışmıyorsa bu linki kopyalayın:<br>${verifyUrl}</p>
  <p style="font-size:12px;color:#9ca3af;">Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
</div>`,
  });
}

// ─── Consumer: order confirmed ─────────────────────────────────────────────────

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
    subject: `Siparişin Onaylandı! Teslim Kodu: ${p.pickupCode}`,
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c1917;">
  <h2 style="color:#059669;">✅ Siparişin onaylandı, ${p.customerName}!</h2>
  <p>Sürpriz kutunu almak için aşağıdaki kodu işletmeye göster.</p>

  <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
    <p style="color:#065f46;font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;margin:0 0 8px;">Teslim Alma Kodun</p>
    <p style="font-family:monospace;font-size:38px;font-weight:800;letter-spacing:.3em;color:#111827;margin:0;">${p.pickupCode}</p>
    <p style="font-size:11px;color:#6b7280;margin:8px 0 0;">Bu kodu işletmeye göster</p>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:5px 0;color:#6b7280;">İşletme</td><td style="padding:5px 0;font-weight:600;">${p.businessName}</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Adres</td><td style="padding:5px 0;">${p.businessAddress}</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Teslim Penceresi</td><td style="padding:5px 0;">🕐 ${fmtTime(p.pickupStart)} – ${fmtTime(p.pickupEnd)}</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Adet</td><td style="padding:5px 0;">${p.quantity} kutu</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Toplam</td><td style="padding:5px 0;font-weight:700;color:#059669;">₺${p.totalPrice.toFixed(2)}</td></tr>
  </table>

  <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
    Gıda israfını önlediğin için teşekkürler! 🌍<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/consumer/orders" style="color:#059669;">Siparişlerini görüntüle →</a>
  </p>
</div>`,
  });
}

// ─── Consumer: order cancelled ─────────────────────────────────────────────────

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
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c1917;">
  <h2 style="color:#dc2626;">Siparişin iptal edildi, ${p.customerName}.</h2>
  <p><strong>${p.businessName}</strong> için verdiğin sipariş (Kod: <strong>${p.pickupCode}</strong>) iptal edildi.</p>
  ${p.refunded
    ? `<p style="color:#059669;">💳 <strong>₺${p.totalPrice.toFixed(2)}</strong> tutarındaki ödemen iade sürecine alındı. Kart ekstrenize 3–5 iş günü içinde yansır.</p>`
    : `<p style="color:#6b7280;">Bu sipariş için ödeme alınmamıştı, ücret yansımayacak.</p>`}
  <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
    Başka sürpriz kutular seni bekliyor! 🎁<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/consumer" style="color:#059669;">Keşfetmeye devam et →</a>
  </p>
</div>`,
  });
}

// ─── Merchant: new order placed ────────────────────────────────────────────────

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
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c1917;">
  <h2 style="color:#059669;">📦 Yeni sipariş geldi!</h2>
  <p><strong>${p.businessName}</strong> için yeni bir sipariş var.</p>

  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
    <tr><td style="padding:5px 0;color:#6b7280;">Müşteri</td><td style="padding:5px 0;">${p.customerName}</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Ürün</td><td style="padding:5px 0;">${p.quantity}× ${categoryLabel} Kutusu</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Teslim Kodu (kısmi)</td><td style="padding:5px 0;font-family:monospace;font-weight:700;">${maskPickupCode(p.pickupCode)}</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Teslim Penceresi</td><td style="padding:5px 0;">🕐 ${fmtTime(p.pickupStart)} – ${fmtTime(p.pickupEnd)}</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Sana Düşen (komisyon sonrası)</td><td style="padding:5px 0;font-weight:700;color:#059669;">₺${p.merchantAmount.toFixed(2)}</td></tr>
  </table>

  <p style="margin-top:24px;font-size:12px;color:#9ca3af;">Tam kodu doğrulamak için uygulamayı kullan.</p>
</div>`,
  });
}

// ─── Merchant: order cancelled ─────────────────────────────────────────────────

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
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c1917;">
  <h2 style="color:#d97706;">Bir sipariş iptal edildi.</h2>
  <p><strong>${p.businessName}</strong> için bir sipariş müşteri tarafından iptal edildi.</p>

  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
    <tr><td style="padding:5px 0;color:#6b7280;">Ürün</td><td style="padding:5px 0;">${p.quantity}× ${categoryLabel} Kutusu</td></tr>
    <tr><td style="padding:5px 0;color:#6b7280;">Sipariş Kodu</td><td style="padding:5px 0;font-family:monospace;">${p.pickupCode}</td></tr>
  </table>

  <p style="margin-top:12px;">Stok otomatik olarak güncellendi, kutu tekrar görünür oldu.</p>
  <p style="font-size:12px;color:#9ca3af;margin-top:16px;">Herhangi bir sorun için bize ulaşın.</p>
</div>`,
  });
}
