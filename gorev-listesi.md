# FoodRescue — Görev Listesi

Son güncelleme: 2026-03-22 (Denetim sonrası güncellendi)

## ✅ Tamamlanan Görevler

### Bölüm 1 — Kullanıcı Hesabı
- [x] **1.1** Tüketici kayıt akışı (ad, e-posta, şifre)
- [x] **1.2** İşletme kayıt akışı (işletme bilgileri + owner)
- [x] **1.3** Giriş yapma (e-posta + şifre, rol bazlı yönlendirme)
- [x] **1.4** Şifre sıfırlama (token + e-posta)
- [x] **1.5** Profil düzenleme sayfası — `/consumer/profile` (ad, telefon, etki özeti, hızlı erişim) + `/consumer/settings` (bildirim ayarları) + `/merchant/settings` (işletme bilgileri, fotoğraf)
- [x] **1.7** E-posta doğrulama — kayıt sonrası doğrulama maili (`sendEmailVerification`), `/email-dogrula` sayfası, `verifyEmail` ve `resendVerificationEmail` actions

### Bölüm 2 — Keşif & Kutu Detayı
- [x] **2.1** Yakın kutuları listele (DiscoveryFeed)
- [x] **2.2** Konum filtresi (LocationContext + harita)
- [x] **2.3** Kutu detay sayfası (`/consumer/box/[id]`)
- [x] **2.4** Favorilere ekleme (`/consumer/favorites`)

### Bölüm 3 — Sipariş & Ödeme
- [x] **3.1** Sipariş oluşturma (createOrder server action)
- [x] **3.2** iyzico ödeme entegrasyonu (checkout form init + callback)
- [x] **3.3** Sipariş iptal + iade (cancelOrder → refundPayment)
- [x] **3.4** Teslim alma kodu (pickupCode, WalletActiveOrder)
- [x] **3.5** Sipariş listesi (`/consumer/orders`)
- [x] **3.6** Dijital fiş — `/consumer/orders/[id]` (sipariş detayı + teslim kodu + etki özeti)
- [x] **3.7** Ödeme geçmişi — `/consumer/payments` (tüketici) + `/merchant/payments` (işletme)

### Bölüm 4 — İşletme Portalı
- [x] **4.1** Kutu yayınla (QuickListBox + publishBox)
- [x] **4.2** Siparişleri gör (`/merchant/orders`)
- [x] **4.3** Teslim doğrulama (OrderHandover + verifyPickupCode + completeOrder)

### Bölüm 5 — Bildirimler & Hatırlatmalar
- [x] **5.1** Sipariş onay e-postası (sendOrderConfirmation)
- [x] **5.2** Sipariş iptal e-postası (sendOrderCancellation)
- [x] **5.3** İşletme: yeni sipariş bildirimi (sendMerchantNewOrder)
- [x] **5.4** İşletme: iptal bildirimi (sendMerchantOrderCancelled)
- [x] **5.5** Teslim alma hatırlatıcısı — consumer layout'ta `PickupReminderBanner` (30 dk kala amber banner, kapatılabilir)

### Bölüm 6 — Admin Paneli
- [x] **6.1** Admin dashboard (`/admin`)
- [x] **6.2** İşletme onaylama/reddetme (`/admin/businesses`)
- [x] **6.3** Kullanıcı listesi (`/admin/users`)
- [x] **6.4** Sipariş listesi (`/admin/orders`)
- [x] **6.5** Öneri listesi (`/admin/nominations`)

### Bölüm 7 — Hukuki & Güvenlik
- [x] **7.1** KVKK, Kullanım Şartları, Çerez Politikası, MSS sayfaları
- [x] **7.2** Güvenlik başlıkları (X-Frame-Options, CSP vb.)
- [x] **7.3** Rate limiting (ratelimit.ts)

### Bölüm 8 — İşletme Öneri Formu
- [x] **8.1** NominateBusinessForm + nominateBusiness action

### Bölüm 9 — Altyapı
- [x] **9.1** PWA desteği — `public/manifest.json` + `public/sw.js` (service worker, cache-first static + network-first pages), `<link rel="manifest">` ve SW kaydı app/layout.tsx'e eklendi
- [x] **9.2** Prisma + PostgreSQL (Neon)
- [x] **9.3** NextAuth v5 JWT stratejisi
- [x] **9.4** Middleware (auth bypass for server actions via Next-Action header)
- [x] **9.5** iyzipay → native fetch IYZWSv2 implementasyonu (Vercel uyumlu)
- [x] **9.6** `export const dynamic = "force-dynamic"` tüm layout'larda (Vercel server action fix)
- [x] **9.7** E-posta altyapısı (Resend SDK + dev console fallback)

### Bölüm 10 — Gelişmiş Özellikler
- [x] **10.1** İmpact metrikleri (CO₂, tasarruf, kurtarılan yemek) — profil + sipariş detayı
- [x] **10.2** Haftalık sipariş grafiği — merchant dashboard'da CSS bar chart (`WeeklyChart` component)
- [x] **10.3** Kutu şablonları — `/merchant/templates` (`BoxTemplateManager`), `BoxTemplate` model, `createBoxTemplate` / `deleteBoxTemplate` actions
- [x] **10.4** Merchant payout altyapısı (MerchantPayout modeli + payout-actions.ts)
- [x] **10.5** İşletme fotoğrafı yükleme — base64 data URL (1 MB limit), `BusinessEditForm`, `updateBusinessImage` action

### Bölüm 11 — UX İyileştirmeleri (denetimde doğrulandı)
- [x] **11.1** DiscoveryFeed'de arama çubuğu + fiyat filtresi (DiscoveryFeed.tsx'de `searchQuery`, `priceMax` state'leri mevcut)
- [x] **11.2** Favorite model + `/consumer/favorites` sayfası (işletme kartları + aktif kutu önizlemesi)
- [x] **11.3** WalletActiveOrder: büyük teslim kodu, PickupCountdown, Google Maps linki, sipariş timeline'ı
- [x] **11.7** `/consumer/settings` — bildirim toggle'ları (NotificationSettings component)

### Bölüm 14 — Testler
- [x] **14.1** Test altyapısı — `tests/e2e/consumer-happy-path.spec.ts`, `tests/integration/order-actions.test.ts`, `tests/unit/utils.test.ts`, `tests/unit/validations.test.ts`, `vitest.config.ts`, `playwright.config.ts`

---

## 🔄 Planlanan / Devam Eden Görevler

### Küçük İyileştirmeler
- [ ] **1.6** Şifre değiştirme formu (consumer/merchant settings sayfasına ekle)
- [ ] **10.6** Şablondan hızlı kutu yayınlama (publish formuna "Şablondan Doldur" butonu)

### Orta Vadeli
- [ ] **11.4** SEO: Open Graph görseli (1200×630)
- [ ] **11.5** Push notification / web push (PWA — SW altyapısı hazır)
- [ ] **11.6** Admin: payout transfer işaretleme
- [ ] **11.8** iyzico ödeme testi (sandbox → production)

---

## Denetim Özeti (2026-03-22)

| Madde | Durum | Dosya |
|-------|-------|-------|
| 1.5 `/consumer/profile` | ✅ TAMAMLANDI | `app/consumer/profile/page.tsx` |
| 1.7 E-posta doğrulama | ✅ TAMAMLANDI | `app/email-dogrula/page.tsx`, `lib/auth-actions.ts` |
| 3.6 Dijital fiş | ✅ TAMAMLANDI | `app/consumer/orders/[id]/page.tsx` |
| 3.7 Ödeme geçmişi | ✅ TAMAMLANDI | `app/consumer/payments/`, `app/merchant/payments/` |
| 5.5 Hatırlatıcı banner | ✅ TAMAMLANDI | `components/consumer/PickupReminderBanner.tsx` |
| 9.1 manifest + SW | ✅ TAMAMLANDI | `public/manifest.json`, `public/sw.js` |
| 10.2 WeeklyChart | ✅ TAMAMLANDI | `components/merchant/MerchantDashboard.tsx` |
| 10.3 BoxTemplate | ✅ TAMAMLANDI | `app/merchant/templates/`, schema + migration |
| 10.5 Fotoğraf yükleme | ✅ TAMAMLANDI | `components/merchant/BusinessEditForm.tsx` |
| 11.1 Arama + fiyat | ✅ TAMAMLANDI | `components/consumer/DiscoveryFeed.tsx` |
| 11.2 Favoriler | ✅ TAMAMLANDI | `app/consumer/favorites/`, `Favorite` model |
| 11.3 Sipariş timeline | ✅ TAMAMLANDI | `components/consumer/WalletActiveOrder.tsx` |
| 11.7 Bildirim toggle | ✅ TAMAMLANDI | `app/consumer/settings/page.tsx` |
| 14.1 Test dosyaları | ✅ TAMAMLANDI | `tests/` (e2e, integration, unit) |

## Teknik Notlar

| Alan | Durum |
|------|-------|
| DB migrations | `add_box_template` uygulandı (2026-03-19) |
| Build | ✅ Başarılı (`npm run build`, 41 route) |
| Deployment | Vercel (main branch auto-deploy) |
| Last push | `75aa552` → yeni commit gelecek |
