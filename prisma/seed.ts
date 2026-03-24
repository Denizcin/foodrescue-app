import dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });
dotenv.config();

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

// ── Time helpers ──────────────────────────────────────────────────────────────
function hoursFromNow(h: number) {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("❌ Seed must not run in production. Aborting.");
  }
  console.log("🌱 Seeding beta database...");

  // ── Wipe existing data ─────────────────────────────────────────────────────
  await prisma.order.deleteMany();
  await prisma.businessNomination.deleteMany();
  await prisma.surpriseBox.deleteMany();
  await prisma.business.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────────
  const [adminPw, m1Pw, m2Pw, m3Pw, consumerPw] = await Promise.all([
    bcrypt.hash("admin123",    12),
    bcrypt.hash("merchant123", 12),
    bcrypt.hash("kafe456",     12),
    bcrypt.hash("market789",   12),
    bcrypt.hash("consumer123", 12),
  ]);

  await prisma.user.create({
    data: {
      name: "FoodRescue Admin",
      email: "admin@foodrescue.com",
      passwordHash: adminPw,
      role: "ADMIN",
    },
  });

  // Merchant 1 — owns Bakery + Deli
  const m1 = await prisma.user.create({
    data: {
      name: "Kadir Yılmaz",
      email: "isletme@foodrescue.com",
      passwordHash: m1Pw,
      role: "MERCHANT",
      phone: "+90 532 111 22 33",
    },
  });

  // Merchant 2 — owns Cafe
  const m2 = await prisma.user.create({
    data: {
      name: "Fatma Şahin",
      email: "kafe@foodrescue.com",
      passwordHash: m2Pw,
      role: "MERCHANT",
      phone: "+90 533 444 55 66",
    },
  });

  // Merchant 3 — owns Greengrocer + Grocery
  const m3 = await prisma.user.create({
    data: {
      name: "Ömer Demir",
      email: "market@foodrescue.com",
      passwordHash: m3Pw,
      role: "MERCHANT",
      phone: "+90 535 777 88 99",
    },
  });

  // Test consumer
  const consumer = await prisma.user.create({
    data: {
      name: "Ayşe Kaya",
      email: "tuketici@foodrescue.com",
      passwordHash: consumerPw,
      role: "CONSUMER",
      phone: "+90 533 222 44 55",
      impactSavedMoney: 127.5,
      impactCo2: 7.5,
      impactFood: 3.0,
    },
  });

  console.log("✅ Users created");

  // ── Businesses ─────────────────────────────────────────────────────────────
  // All pre-approved so they appear in the consumer feed immediately.
  // Coordinates are real Istanbul neighbourhoods (verified on OSM).

  const bakery = await prisma.business.create({
    data: {
      ownerId: m1.id,
      name: "Pazar Fırını",
      category: "BAKERY",
      description: "1978'den beri Kadıköy'de taze ekmek, simit ve unlu mamüller. Günlük yapım, katkısız.",
      address: "Bahariye Caddesi No:12, Kadıköy, İstanbul",
      locationLat: 40.9905,
      locationLng: 29.0303,
      operatingHours: "Pzt-Cmt 06:00-20:00, Paz 07:00-18:00",
      phone: "+90 216 418 11 22",
      isActive: true,
      isApproved: true,
    },
  });

  const deli = await prisma.business.create({
    data: {
      ownerId: m1.id,
      name: "Beşiktaş Börekcisi",
      category: "DELI",
      description: "El açması börekler, çeşit çeşit peynirler ve şarküteri ürünleri.",
      address: "Barbaros Bulvarı No:34, Beşiktaş, İstanbul",
      locationLat: 41.0430,
      locationLng: 29.0077,
      operatingHours: "Her gün 07:30-21:00",
      phone: "+90 212 260 33 44",
      isActive: true,
      isApproved: true,
    },
  });

  const cafe = await prisma.business.create({
    data: {
      ownerId: m2.id,
      name: "Galata Kafe",
      category: "CAFE",
      description: "Galata Kulesi'nin gölgesinde özel kavurma kahveler, ev yapımı kekler ve sandviçler.",
      address: "Galata Kulesi Sokak No:7, Beyoğlu, İstanbul",
      locationLat: 41.0256,
      locationLng: 28.9742,
      operatingHours: "Her gün 08:00-23:00",
      phone: "+90 212 293 55 66",
      isActive: true,
      isApproved: true,
    },
  });

  const greengrocer = await prisma.business.create({
    data: {
      ownerId: m3.id,
      name: "Şişli Taze Manav",
      category: "GREENGROCER",
      description: "Çiftlikten direkt taze meyve ve sebzeler. Mevsiminde, pestisitsiz.",
      address: "Halaskargazi Caddesi No:22, Şişli, İstanbul",
      locationLat: 41.0618,
      locationLng: 28.9871,
      operatingHours: "Pzt-Cmt 07:00-21:00, Paz 08:00-19:00",
      phone: "+90 212 247 77 88",
      isActive: true,
      isApproved: true,
    },
  });

  const grocery = await prisma.business.create({
    data: {
      ownerId: m3.id,
      name: "Üsküdar Mahalle Market",
      category: "GROCERY",
      description: "Organik ürünler, yerel lezzetler ve günlük ihtiyaçlar.",
      address: "Mimar Sinan Caddesi No:8, Üsküdar, İstanbul",
      locationLat: 41.0232,
      locationLng: 29.0152,
      operatingHours: "Her gün 08:00-22:00",
      phone: "+90 216 333 99 00",
      isActive: true,
      isApproved: true,
    },
  });

  console.log("✅ Businesses created");

  // ── Surprise Boxes ─────────────────────────────────────────────────────────
  // Three pickup windows:
  //   Slot A — today, ~2-4 hours from now (current day, early slot)
  //   Slot B — today, ~5-7 hours from now (current day, later slot)
  //   Slot C — tomorrow, ~20-22 hours from now
  const [aStart, aEnd] = [hoursFromNow(2),  hoursFromNow(4)];
  const [bStart, bEnd] = [hoursFromNow(5),  hoursFromNow(7)];
  const [cStart, cEnd] = [hoursFromNow(20), hoursFromNow(22)];

  // Pazar Fırını — 3 boxes
  const bakeryBox1 = await prisma.surpriseBox.create({
    data: {
      businessId: bakery.id,
      category: "BAKERY",
      description: "Günlük ekmek, poğaça ve çörek karışımı. Ne çıkacağı sürpriz!",
      originalPrice: 120,
      discountedPrice: 50,
      stockQuantity: 6,
      pickupTimeStart: aStart,
      pickupTimeEnd: aEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: bakery.id,
      category: "MIXED",
      description: "Fırından karışık sürpriz kutu: tatlı-tuzlu unlu mamüller.",
      originalPrice: 90,
      discountedPrice: 38,
      stockQuantity: 4,
      pickupTimeStart: bStart,
      pickupTimeEnd: bEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: bakery.id,
      category: "BAKERY",
      description: "Yarınki sepetin tazesi — sabah pişirilen yeni ekmekler.",
      originalPrice: 80,
      discountedPrice: 35,
      stockQuantity: 8,
      pickupTimeStart: cStart,
      pickupTimeEnd: cEnd,
      isActive: true,
    },
  });

  // Beşiktaş Börekcisi — 2 boxes
  const deliBox1 = await prisma.surpriseBox.create({
    data: {
      businessId: deli.id,
      category: "DELI",
      description: "Günün kalan el açması börekleri: peynirli, ıspanaklı, patatesli.",
      originalPrice: 100,
      discountedPrice: 42,
      stockQuantity: 5,
      pickupTimeStart: aStart,
      pickupTimeEnd: aEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: deli.id,
      category: "DELI",
      description: "Şarküteri ve peynir sürpriz kutusu — karışık seçki.",
      originalPrice: 140,
      discountedPrice: 60,
      stockQuantity: 3,
      pickupTimeStart: cStart,
      pickupTimeEnd: cEnd,
      isActive: true,
    },
  });

  // Galata Kafe — 2 boxes
  await prisma.surpriseBox.create({
    data: {
      businessId: cafe.id,
      category: "CAFE",
      description: "Günün sandviçleri, tatlılar ve bir içecek. Akşam kapanış öncesi.",
      originalPrice: 85,
      discountedPrice: 36,
      stockQuantity: 4,
      pickupTimeStart: bStart,
      pickupTimeEnd: bEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: cafe.id,
      category: "CAFE",
      description: "Kahve dükkanı sürpriz kutusu: kek, kurabiye ve soğuk içecek.",
      originalPrice: 70,
      discountedPrice: 30,
      stockQuantity: 6,
      pickupTimeStart: cStart,
      pickupTimeEnd: cEnd,
      isActive: true,
    },
  });

  // Şişli Taze Manav — 2 boxes
  await prisma.surpriseBox.create({
    data: {
      businessId: greengrocer.id,
      category: "PRODUCE",
      description: "Görünümü bozuk ama lezzetli mevsim meyveleri — 3 kg karışık.",
      originalPrice: 75,
      discountedPrice: 30,
      stockQuantity: 10,
      pickupTimeStart: aStart,
      pickupTimeEnd: aEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: greengrocer.id,
      category: "PRODUCE",
      description: "Taze sebze sepeti: domates, biber, kabak, patlıcan karışımı.",
      originalPrice: 65,
      discountedPrice: 28,
      stockQuantity: 7,
      pickupTimeStart: cStart,
      pickupTimeEnd: cEnd,
      isActive: true,
    },
  });

  // Üsküdar Mahalle Market — 3 boxes
  const groceryBox1 = await prisma.surpriseBox.create({
    data: {
      businessId: grocery.id,
      category: "GROCERY",
      description: "Son kullanma tarihi yaklaşan market ürünleri — çok çeşitli sürpriz.",
      originalPrice: 110,
      discountedPrice: 45,
      stockQuantity: 5,
      pickupTimeStart: aStart,
      pickupTimeEnd: aEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: grocery.id,
      category: "GROCERY",
      description: "Kahvaltılık sürpriz kutu: peynir, zeytin, reçel ve ekmek.",
      originalPrice: 90,
      discountedPrice: 38,
      stockQuantity: 4,
      pickupTimeStart: bStart,
      pickupTimeEnd: bEnd,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: grocery.id,
      category: "GROCERY",
      description: "Kuru gıda kutusu: bakliyat, makarna ve konserveler.",
      originalPrice: 70,
      discountedPrice: 29,
      stockQuantity: 8,
      pickupTimeStart: cStart,
      pickupTimeEnd: cEnd,
      isActive: true,
    },
  });

  console.log("✅ Surprise boxes created (12 boxes across 5 businesses)");

  // ── Sample orders for consumer account ────────────────────────────────────
  const order1 = await prisma.order.create({
    data: {
      userId: consumer.id,
      boxId: bakeryBox1.id,
      status: "PENDING",
      pickupCode: "AX3K9F",
      quantity: 1,
      totalPrice: bakeryBox1.discountedPrice,
    },
  });

  await prisma.order.create({
    data: {
      userId: consumer.id,
      boxId: deliBox1.id,
      status: "PICKED_UP",
      pickupCode: "BM7T2R",
      quantity: 1,
      totalPrice: deliBox1.discountedPrice,
    },
  });

  await prisma.order.create({
    data: {
      userId: consumer.id,
      boxId: groceryBox1.id,
      status: "CANCELLED",
      pickupCode: "CP4W8N",
      quantity: 1,
      totalPrice: groceryBox1.discountedPrice,
    },
  });

  // Deduct stock for the pending order
  await prisma.surpriseBox.update({
    where: { id: bakeryBox1.id },
    data: { stockQuantity: { decrement: order1.quantity } },
  });

  console.log("✅ Sample orders created");

  // ── Nominations ────────────────────────────────────────────────────────────
  await prisma.businessNomination.create({
    data: {
      userId: consumer.id,
      nominatorName: "Fatma Çelik",
      nominatorEmail: "fatma@example.com",
      nominatedBusinessName: "Çiçek Pastanesi",
      nominatedAddress: "Bağlarbaşı Caddesi No:8, Üsküdar, İstanbul",
      reason: "Her akşam harika pasta ve kek kalıyor, çok yazık atılıyor",
    },
  });

  await prisma.businessNomination.create({
    data: {
      nominatorName: "Ali Öztürk",
      nominatedBusinessName: "Caddebostan Balık Evi",
      nominatedAddress: "Caddebostan Sahili No:22, Kadıköy, İstanbul",
      reason: "Günün balıkları her akşam atılıyor, platformda olsa çok satılır",
    },
  });

  console.log("✅ Nominations created");

  console.log("\n🎉 Beta seed tamamlandı!");
  console.log("\nTest hesapları:");
  console.log("  Admin:       admin@foodrescue.com     / admin123");
  console.log("  İşletme 1:   isletme@foodrescue.com   / merchant123  (Pazar Fırını + Beşiktaş Börekcisi)");
  console.log("  İşletme 2:   kafe@foodrescue.com      / kafe456       (Galata Kafe)");
  console.log("  İşletme 3:   market@foodrescue.com    / market789     (Manav + Market)");
  console.log("  Tüketici:    tuketici@foodrescue.com  / consumer123");
  console.log("\nBeta sayfası: /beta");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
