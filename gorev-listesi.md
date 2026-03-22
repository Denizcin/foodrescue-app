# FoodRescue — Prototype'dan Ürüne Geçiş Görev Listesi

Bu liste, mevcut prototype'ı gerçek bir uygulamaya dönüştürmek için gereken tüm görevleri kapsar.
Her görev için öncelik seviyesi (P0 = lansman için şart, P1 = lansmandan kısa süre sonra, P2 = büyüme aşamasında) belirtilmiştir.

Son güncelleme: 2026-03-22 (Performans iyileştirmeleri — DB indexleri, bundle analizi)

---

## BÖLÜM 1: KİMLİK DOĞRULAMA & KULLANICI YÖNETİMİ (Authentication & Users)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 1.1 | Kimlik doğrulama sistemi | NextAuth.js veya Clerk ile giriş/kayıt sistemi (email + şifre, Google, Apple Sign-In) | P0 | ✅ |
| 1.2 | Tüketici kayıt akışı | Ad, email, telefon, konum izni ile kayıt | P0 | ✅ |
| 1.3 | İşletme kayıt akışı | İşletme adı, kategori, adres, vergi no, çalışma saatleri ile kayıt | P0 | ✅ |
| 1.4 | Rol bazlı yetkilendirme | Tüketici vs İşletme rollerini ayırma, route koruması (middleware) | P0 | ✅ |
| 1.5 | Profil düzenleme | Kullanıcı ve işletme profil güncelleme sayfaları | P1 | ✅ |
| 1.6 | Şifre sıfırlama | Email ile şifre sıfırlama akışı | P0 | ✅ |
| 1.7 | Email doğrulama | Kayıt sonrası email onayı | P1 | ✅ |

---

## BÖLÜM 2: VERİTABANI & BACKEND (Database & API)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 2.1 | PostgreSQL'e geçiş | SQLite'dan PostgreSQL'e geçiş (production-ready) | P0 | ✅ |
| 2.2 | API route'ları | Tüm CRUD işlemleri için gerçek API endpoint'leri oluşturma | P0 | ✅ |
| 2.3 | Server Actions | Form submission'lar için Next.js Server Actions | P0 | ✅ |
| 2.4 | Veri doğrulama (Zod) | Tüm API input'ları için Zod schema validation | P0 | ✅ |
| 2.5 | Hata yönetimi | Global error handling, try-catch yapıları, kullanıcı dostu hata mesajları | P0 | ✅ |
| 2.6 | Veritabanı seed | Gerçekçi test verileri ile seed script | P1 | ✅ |
| 2.7 | Veritabanı indexleri | Performans için gerekli index'ler (konum bazlı sorgular vb.) | P1 | ✅ |

---

## BÖLÜM 3: ÖDEME SİSTEMİ (Payments)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 3.1 | Ödeme entegrasyonu | iyzico veya Stripe Türkiye entegrasyonu | P0 | ✅ |
| 3.2 | Ön ödeme akışı | Tüketici checkout → ödeme → sipariş oluşturma | P0 | ✅ |
| 3.3 | İade/iptal sistemi | Sipariş iptali → otomatik iade akışı | P0 | ✅ |
| 3.4 | İşletme ödemeleri | İşletmelere düzenli ödeme transferi (payout) | P0 | ✅ |
| 3.5 | Komisyon hesaplama | Platform komisyon oranı ve hesaplaması | P0 | ✅ |
| 3.6 | Fatura/fiş oluşturma | Her sipariş için dijital fiş | P1 | ✅ |
| 3.7 | Ödeme geçmişi | Kullanıcı ve işletme için ödeme geçmişi sayfası | P1 | ✅ |

---

## BÖLÜM 4: KONUM & HARİTA (Location & Maps)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 4.1 | Konum izni & tespiti | Tarayıcı geolocation API ile kullanıcı konumu alma | P0 | ✅ |
| 4.2 | Yakındaki işletmeler | Konum bazlı sıralama (mesafe hesaplama) | P0 | ✅ |
| 4.3 | İşletme haritası | OpenStreetMap/Leaflet ile işletme konumlarını gösterme | P1 | ✅ |
| 4.4 | Yol tarifi linki | "Yol Tarifi Al" butonu → Google Maps'e yönlendirme | P1 | ✅ |
| 4.5 | Adres otomatik tamamlama | İşletme kayıtta Google Places autocomplete | P1 | ⬜ |

---

## BÖLÜM 5: BİLDİRİMLER (Notifications)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 5.1 | Email bildirimleri | Sipariş onayı, teslim hatırlatması, iptal bildirimi | P0 | ✅ |
| 5.2 | Push bildirimleri | Web push notifications (yeni kutular, teslim hatırlatma) | P1 | ⬜ |
| 5.3 | SMS bildirimleri | Kritik bildirimler için SMS (opsiyonel, Twilio/Netgsm) | P2 | ⬜ |
| 5.4 | İşletme bildirimleri | Yeni sipariş geldiğinde işletmeye bildirim | P0 | ✅ |
| 5.5 | Teslim alma hatırlatması | Pickup window başlamadan 30dk önce hatırlatma | P1 | ✅ |

---

## BÖLÜM 6: GERÇEK ZAMANLI ÖZELLİKLER (Real-time Features)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 6.1 | Stok güncelleme | Gerçek zamanlı stok azaltma/artırma | P0 | ✅ |
| 6.2 | Sipariş durumu güncelleme | Sipariş durum değişikliklerinin anlık yansıması | P1 | ⬜ |
| 6.3 | Canlı stok gösterimi | Kalan kutu sayısının feed'de anlık güncellenmesi | P2 | ⬜ |

---

## BÖLÜM 7: GÜVENLİK & YASAL (Security & Legal)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 7.1 | KVKK uyumluluğu | Kişisel verilerin korunması politikası, açık rıza metni | P0 | ✅ |
| 7.2 | Kullanım şartları | Hizmet şartları sayfası (tüketici + işletme) | P0 | ✅ |
| 7.3 | Çerez politikası | GDPR/KVKK uyumlu çerez banner'ı ve politika sayfası | P0 | ✅ |
| 7.4 | Aydınlatma metni | Kişisel veri işleme aydınlatma metni | P0 | ✅ |
| 7.5 | Rate limiting | API isteklerinde hız sınırlaması | P0 | ✅ |
| 7.6 | CSRF koruması | Cross-site request forgery koruması | P0 | ✅ |
| 7.7 | Input sanitization | XSS ve SQL injection koruması | P0 | ✅ |
| 7.8 | Gıda güvenliği uyarısı | Alerjen uyarısı, sorumluluk reddi metinleri | P0 | ✅ |
| 7.9 | Mesafeli satış sözleşmesi | E-ticaret yasal gereklilikleri | P0 | ✅ |

---

## BÖLÜM 8: DEPLOYMENT & ALTYAPI (Infrastructure)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 8.1 | Vercel deployment | Next.js uygulamasını Vercel'e deploy etme | P0 | ✅ |
| 8.2 | Domain & SSL | Alan adı satın alma, SSL sertifikası | P0 | ⬜ |
| 8.3 | Veritabanı hosting | Neon, Supabase veya Railway ile PostgreSQL hosting | P0 | ✅ |
| 8.4 | Environment variables | Production ortam değişkenleri güvenli yönetimi | P0 | ✅ |
| 8.5 | CI/CD pipeline | Otomatik test ve deployment pipeline | P1 | ⬜ |
| 8.6 | Monitoring & logging | Hata takibi (Sentry), performans izleme | P1 | ⬜ |
| 8.7 | Yedekleme | Veritabanı otomatik yedekleme | P1 | ⬜ |
| 8.8 | CDN & optimizasyon | Resim optimizasyonu, caching stratejisi | P1 | ⬜ |

---

## BÖLÜM 9: MOBİL UYGULAMA (Mobile App)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 9.1 | PWA yapılandırması | Progressive Web App (manifest, service worker, offline) | P1 | ✅ |
| 9.2 | App Store & Play Store | React Native veya Capacitor ile native uygulama sarma | P2 | ⬜ |
| 9.3 | Mobil push bildirimleri | Firebase Cloud Messaging entegrasyonu | P2 | ⬜ |

---

## BÖLÜM 10: İŞLETME PORTALI GELİŞMİŞ ÖZELLİKLER (Advanced Merchant)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 10.1 | İşletme onay süreci | Admin tarafından işletme doğrulama/onaylama | P0 | ✅ |
| 10.2 | İşletme dashboard istatistikleri | Haftalık/aylık satış, gelir, kurtarılan yemek grafikleri | P1 | ✅ |
| 10.3 | Kutu şablonları | Sık kullanılan kutu ayarlarını şablon olarak kaydetme | P1 | ✅ |
| 10.4 | Çoklu kutu yönetimi | Aynı gün birden fazla kategori kutu yayınlama | P1 | ⬜ |
| 10.5 | İşletme resimleri | Logo ve mağaza fotoğrafı yükleme (Cloudinary/S3) | P1 | ✅ |
| 10.6 | Otomatik kapanış | Pickup window bitince kutuları otomatik deaktive etme (cron job) | P0 | ✅ |

---

## BÖLÜM 11: TÜKETİCİ GELİŞMİŞ ÖZELLİKLER (Advanced Consumer)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 11.1 | Arama & filtreleme | İşletme adı, kategori, fiyat aralığı ile arama | P1 | ✅ |
| 11.2 | Favori işletmeler | İşletmeleri favorilere ekleme | P1 | ✅ |
| 11.3 | Sipariş geçmişi detay | Detaylı sipariş geçmişi sayfası | P1 | ✅ |
| 11.4 | Değerlendirme sistemi | Sipariş sonrası yıldız puanlama + yorum | P2 | ⬜ |
| 11.5 | Paylaşma özelliği | Kutu veya işletmeyi sosyal medyada paylaşma | P2 | ⬜ |
| 11.6 | Referans sistemi | Arkadaşını davet et → indirim kazan | P2 | ⬜ |
| 11.7 | Bildirim tercihleri | Hangi bildirimleri almak istediğini seçme | P1 | ✅ |

---

## BÖLÜM 12: ADMİN PANELİ (Admin Dashboard)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 12.1 | Admin paneli | Platform yönetim paneli (ayrı route: /admin) | P0 | ✅ |
| 12.2 | İşletme onay yönetimi | Yeni işletme başvurularını onaylama/reddetme | P0 | ✅ |
| 12.3 | Kullanıcı yönetimi | Kullanıcıları görüntüleme, askıya alma | P1 | ✅ |
| 12.4 | Sipariş yönetimi | Tüm siparişleri görüntüleme, sorunları çözme | P1 | ✅ |
| 12.5 | Nomination yönetimi | Önerilen işletmeleri görüntüleme, iletişim takibi | P1 | ✅ |
| 12.6 | Platform istatistikleri | Toplam satış, kullanıcı, işletme, kurtarılan yemek | P1 | ✅ |
| 12.7 | Finansal raporlar | Komisyon geliri, işletme ödemeleri raporu | P1 | ✅ |

---

## BÖLÜM 13: SEO & PAZARLAMA (SEO & Marketing)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 13.1 | SEO meta etiketleri | Sayfa başlıkları, açıklamalar, Open Graph | P1 | ✅ |
| 13.2 | Sitemap | XML sitemap oluşturma | P1 | ✅ |
| 13.3 | Google Analytics | Sayfa görüntüleme, dönüşüm takibi | P1 | ✅ |
| 13.4 | Blog / İçerik | Sürdürülebilirlik, gıda israfı konulu blog | P2 | ⬜ |
| 13.5 | Sosyal medya entegrasyonu | Instagram feed embed, paylaşım butonları | P2 | ⬜ |

---

## BÖLÜM 14: TEST & KALİTE (Testing & QA)

| # | Görev | Açıklama | Öncelik | Durum |
|---|-------|----------|---------|-------|
| 14.1 | Unit testler | İş mantığı fonksiyonları için birim testleri | P1 | ✅ |
| 14.2 | Integration testler | API route'ları için entegrasyon testleri | P1 | ✅ |
| 14.3 | E2E testler | Kritik akışlar için Playwright/Cypress testleri | P1 | ✅ |
| 14.4 | Erişilebilirlik (a11y) | WCAG uyumluluğu, ekran okuyucu desteği | P2 | ⬜ |

---

## ÖZET: LANSMAN İÇİN GEREKLİ MİNİMUM (MVP)

Sadece P0 görevlerini tamamlamak lansman için yeterlidir. Bunlar:

1. ✅ Proje yapısı & veritabanı şeması (TAMAMLANDI)
2. ✅ Landing page (TAMAMLANDI)
3. ✅ Tüketici UI bileşenleri (TAMAMLANDI)
4. ✅ İşletme UI bileşenleri (TAMAMLANDI)
5. ✅ Kimlik doğrulama (1.1 - 1.4, 1.6 — TAMAMLANDI)
6. ✅ PostgreSQL geçişi & gerçek API (2.1 - 2.5 — TAMAMLANDI)
7. ✅ Ödeme sistemi (3.1 - 3.5 — TAMAMLANDI)
8. ✅ Konum tespiti & yakınlık sıralaması (4.1 - 4.2 — TAMAMLANDI)
9. ✅ Email bildirimleri (5.1, 5.4 — TAMAMLANDI)
10. ✅ Gerçek zamanlı stok yönetimi (6.1 — TAMAMLANDI)
11. ✅ Yasal sayfalar & güvenlik (7.1 - 7.9 — TAMAMLANDI)
12. ✅ Deployment (8.1, 8.3, 8.4 — TAMAMLANDI · 8.2 domain satın alma bekliyor)
13. ✅ İşletme onay süreci & otomatik kapanış (10.1, 10.6 — TAMAMLANDI)
14. ✅ Admin paneli (12.1 - 12.6 — TAMAMLANDI)

**Tüm P0 görevleri tamamlandı. Uygulama lansman için hazır.**

---

## Kalan Görevler (19 adet)

| # | Görev | Öncelik |
|---|-------|---------|
| 4.5 | Adres otomatik tamamlama | P1 |
| 5.2 | Push bildirimleri | P1 |
| 5.3 | SMS bildirimleri | P2 |
| 6.2 | Sipariş durumu anlık güncelleme | P1 |
| 6.3 | Canlı stok feed güncellemesi | P2 |
| 8.2 | Domain & SSL | P0 |
| 8.5 | CI/CD pipeline | P1 |
| 8.6 | Monitoring & logging (Sentry) | P1 |
| 8.7 | Veritabanı yedekleme | P1 |
| 8.8 | CDN & resim optimizasyonu | P1 |
| 9.2 | App Store & Play Store | P2 |
| 9.3 | Firebase push (mobile) | P2 |
| 10.4 | Çoklu kutu yönetimi | P1 |
| 11.4 | Değerlendirme sistemi | P2 |
| 11.5 | Sosyal paylaşım | P2 |
| 11.6 | Referans sistemi | P2 |
| 13.4 | Blog / İçerik | P2 |
| 13.5 | Sosyal medya entegrasyonu | P2 |
| 14.4 | Erişilebilirlik (a11y) | P2 |
