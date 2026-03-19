# FoodRescue — Görev Listesi

Son güncelleme: 2026-03-20

## ✅ Tamamlanan Görevler

### Bölüm 1 — Kullanıcı Hesabı
- [x] **1.1** Tüketici kayıt akışı (ad, e-posta, şifre)
- [x] **1.2** İşletme kayıt akışı (işletme bilgileri + owner)
- [x] **1.3** Giriş yapma (e-posta + şifre, rol bazlı yönlendirme)
- [x] **1.4** Şifre sıfırlama (token + e-posta)
- [x] **1.5** Profil düzenleme — `/consumer/settings` (ad, telefon) + `/merchant/settings` (işletme bilgileri, fotoğraf)
- [x] **1.7** E-posta doğrulama — kayıt sonrası doğrulama maili, `/email-dogrula` sayfası

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
- [x] **5.5** Teslim alma hatırlatıcısı — consumer layout'ta PickupReminderBanner (30 dk kala uyarı)

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
- [x] **9.1** Prisma + PostgreSQL (Neon)
- [x] **9.2** NextAuth v5 JWT stratejisi
- [x] **9.3** Middleware (auth bypass for server actions via Next-Action header)
- [x] **9.4** iyzipay → native fetch IYZWSv2 implementasyonu (Vercel uyumlu)
- [x] **9.5** `export const dynamic = "force-dynamic"` tüm layout'larda (Vercel server action fix)
- [x] **9.6** E-posta altyapısı (Resend SDK + dev console fallback)

### Bölüm 10 — Gelişmiş Özellikler
- [x] **10.1** İmpact metrikleri (CO₂, tasarruf, kurtarılan yemek) — kullanıcı profili + sipariş detayı
- [x] **10.2** Haftalık sipariş grafiği — merchant dashboard'da CSS bar chart (WeeklyChart)
- [x] **10.3** Kutu şablonları — `/merchant/templates` (BoxTemplateManager, BoxTemplate modeli)
- [x] **10.4** Merchant payout altyapısı (MerchantPayout modeli + payout-actions.ts)
- [x] **10.5** İşletme fotoğrafı yükleme — base64 data URL, merchant settings'te BusinessEditForm

---

## 🔄 Devam Eden / Planlanan Görevler

### Küçük İyileştirmeler
- [ ] **1.6** Şifre değiştirme formu (settings sayfasına ekle)
- [ ] **5.6** Push notification / web push (PWA)
- [ ] **10.6** Şablondan hızlı kutu yayınlama (publish formuna "Şablondan Doldur" butonu)

### Orta Vadeli
- [ ] **11.1** Çevrimiçi ödeme testi (iyzico sandbox → production)
- [ ] **11.2** Vercel cron: expired box cleanup (cleanup.ts)
- [ ] **11.3** Admin: payout transfer işaretleme
- [ ] **11.4** SEO optimizasyonu (sitemap, metadata)

---

## Teknik Notlar

| Alan | Durum |
|------|-------|
| DB migration | `add_box_template` uygulandı (2026-03-19) |
| Build | ✅ Başarılı (`npm run build`) |
| Deployment | Vercel (main branch auto-deploy) |
| Last push | `bf9639d` — 2026-03-20 |
