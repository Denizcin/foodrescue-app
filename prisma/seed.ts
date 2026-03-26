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
  await prisma.boxTemplate.deleteMany();
  await prisma.surpriseBox.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.business.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────────
  const [adminPw, m1Pw, m2Pw, consumerPw] = await Promise.all([
    bcrypt.hash("admin123",    12),
    bcrypt.hash("merchant123", 12),
    bcrypt.hash("pastane456",  12),
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

  // Merchant 1 — owns both bakeries
  const m1 = await prisma.user.create({
    data: {
      name: "Kadir Yılmaz",
      email: "isletme@foodrescue.com",
      passwordHash: m1Pw,
      role: "MERCHANT",
      phone: "+90 532 111 22 33",
    },
  });

  // Merchant 2 — owns pastane + kafe
  const m2 = await prisma.user.create({
    data: {
      name: "Fatma Şahin",
      email: "pastane@foodrescue.com",
      passwordHash: m2Pw,
      role: "MERCHANT",
      phone: "+90 533 444 55 66",
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
  // Coordinates are real Istanbul neighbourhoods.

  const bakery1 = await prisma.business.create({
    data: {
      ownerId: m1.id,
      name: "Kadıköy Ekmek Fırını",
      category: "BAKERY",
      description: "1975'ten beri Kadıköy'de günlük taze ekmek, simit ve poğaça. Sabah 6'da açılır, taze ürünler biter bitmez kapanır.",
      address: "Moda Caddesi No:47, Kadıköy, İstanbul",
      locationLat: 40.9874,
      locationLng: 29.0278,
      operatingHours: "Pzt-Cmt 06:00-19:00, Paz 07:00-17:00",
      phone: "+90 216 418 11 22",
      isActive: true,
      isApproved: true,
    },
  });

  const bakery2 = await prisma.business.create({
    data: {
      ownerId: m1.id,
      name: "Beşiktaş Fırını",
      category: "BAKERY",
      description: "Çarşı'nın kalbinde, el yapımı börekler ve fırın ekmeği. Günde 3 kez pişirim.",
      address: "Sinanpaşa Mah. Beşiktaş Caddesi No:12, Beşiktaş, İstanbul",
      locationLat: 41.0438,
      locationLng: 29.0042,
      operatingHours: "Her gün 06:30-20:00",
      phone: "+90 212 260 33 44",
      isActive: true,
      isApproved: true,
    },
  });

  const pastane = await prisma.business.create({
    data: {
      ownerId: m2.id,
      name: "İnci Pastanesi",
      category: "PATISSERIE",
      description: "Şişli'nin köklü pastanesi. Profiterol, pasta dilimleri ve ev yapımı kurabiyeler.",
      address: "Halaskargazi Caddesi No:35, Şişli, İstanbul",
      locationLat: 41.0618,
      locationLng: 28.9871,
      operatingHours: "Her gün 08:00-22:00",
      phone: "+90 212 247 77 88",
      isActive: true,
      isApproved: true,
    },
  });

  const kafe = await prisma.business.create({
    data: {
      ownerId: m2.id,
      name: "Galata Kafe",
      category: "CAFE",
      description: "Galata Kulesi'nin gölgesinde özel kavurma kahveler, ev yapımı kekler ve sandviçler. Kapanışta her gün fazla ürün kalıyor.",
      address: "Galata Kulesi Sokak No:7, Beyoğlu, İstanbul",
      locationLat: 41.0256,
      locationLng: 28.9742,
      operatingHours: "Her gün 08:00-23:00",
      phone: "+90 212 293 55 66",
      isActive: true,
      isApproved: true,
    },
  });

  console.log("✅ Businesses created (2 fırın, 1 pastane, 1 kafe)");

  // ── Surprise Boxes ─────────────────────────────────────────────────────────
  // Three pickup windows today + one tomorrow:
  //   Slot A — 2-4 h from now   (current day, afternoon)
  //   Slot B — 5-7 h from now   (current day, evening)
  //   Slot C — 20-22 h from now  (next morning)
  const [aS, aE] = [hoursFromNow(2),  hoursFromNow(4)];
  const [bS, bE] = [hoursFromNow(5),  hoursFromNow(7)];
  const [cS, cE] = [hoursFromNow(20), hoursFromNow(22)];

  // ── Kadıköy Ekmek Fırını — 3 boxes ────────────────────────────────────────
  const bakery1BoxA = await prisma.surpriseBox.create({
    data: {
      businessId: bakery1.id,
      category: "BAKERY",
      description: "Günlük ekmek, poğaça ve simit karışımı. Sabah pişirimi, akşama kalan.",
      originalPrice: 175,
      discountedPrice: 70,
      stockQuantity: 6,
      pickupTimeStart: aS,
      pickupTimeEnd: aE,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: bakery1.id,
      category: "BAKERY",
      description: "Akşam kapanış öncesi son ekmekler: francala, somun ve çavdar ekmeği.",
      originalPrice: 150,
      discountedPrice: 60,
      stockQuantity: 4,
      pickupTimeStart: bS,
      pickupTimeEnd: bE,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: bakery1.id,
      category: "BAKERY",
      description: "Sabah erken teslim — dünden kalan taze unlu mamüller: tuzlu-tatlı karışık.",
      originalPrice: 160,
      discountedPrice: 65,
      stockQuantity: 8,
      pickupTimeStart: cS,
      pickupTimeEnd: cE,
      isActive: true,
    },
  });

  // ── Beşiktaş Fırını — 2 boxes ──────────────────────────────────────────────
  await prisma.surpriseBox.create({
    data: {
      businessId: bakery2.id,
      category: "BAKERY",
      description: "El açması börekler: peynirli, ıspanaklı, patatesli — günün kalan karışımı.",
      originalPrice: 180,
      discountedPrice: 72,
      stockQuantity: 5,
      pickupTimeStart: aS,
      pickupTimeEnd: aE,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: bakery2.id,
      category: "BAKERY",
      description: "Akşam fırından çıkan son ekmekler ve poğaçalar — sıcak sıcak teslim.",
      originalPrice: 165,
      discountedPrice: 65,
      stockQuantity: 3,
      pickupTimeStart: bS,
      pickupTimeEnd: bE,
      isActive: true,
    },
  });

  // ── İnci Pastanesi — 3 boxes ───────────────────────────────────────────────
  await prisma.surpriseBox.create({
    data: {
      businessId: pastane.id,
      category: "PATISSERIE",
      description: "Günün kalan pasta dilimleri ve kekler: çikolatalı, meyveli, sade — sürpriz.",
      originalPrice: 260,
      discountedPrice: 100,
      stockQuantity: 5,
      pickupTimeStart: aS,
      pickupTimeEnd: aE,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: pastane.id,
      category: "PATISSERIE",
      description: "Kurabiye ve tatlı börek sürpriz kutusu: en az 6 çeşit tatlı.",
      originalPrice: 220,
      discountedPrice: 88,
      stockQuantity: 4,
      pickupTimeStart: bS,
      pickupTimeEnd: bE,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: pastane.id,
      category: "PATISSERIE",
      description: "Profiterol, ekler ve çikolatalı tatlılardan oluşan akşam sürprizi.",
      originalPrice: 290,
      discountedPrice: 115,
      stockQuantity: 3,
      pickupTimeStart: cS,
      pickupTimeEnd: cE,
      isActive: true,
    },
  });

  // ── Galata Kafe — 2 boxes ──────────────────────────────────────────────────
  await prisma.surpriseBox.create({
    data: {
      businessId: kafe.id,
      category: "CAFE",
      description: "Akşam kapanış öncesi sandviçler, kekler ve soğuk içecekler.",
      originalPrice: 165,
      discountedPrice: 65,
      stockQuantity: 4,
      pickupTimeStart: bS,
      pickupTimeEnd: bE,
      isActive: true,
    },
  });

  await prisma.surpriseBox.create({
    data: {
      businessId: kafe.id,
      category: "CAFE",
      description: "Kahve dükkanı sabah sürprizi: croissant, muffin ve taze preslenmiş meyve suyu.",
      originalPrice: 145,
      discountedPrice: 58,
      stockQuantity: 6,
      pickupTimeStart: cS,
      pickupTimeEnd: cE,
      isActive: true,
    },
  });

  console.log("✅ Surprise boxes created (12 boxes across 4 businesses)");

  // ── Sample orders for consumer account ────────────────────────────────────
  const sampleOrder = await prisma.order.create({
    data: {
      userId: consumer.id,
      boxId: bakery1BoxA.id,
      status: "PENDING",
      pickupCode: "AX3K9F",
      quantity: 1,
      totalPrice: bakery1BoxA.discountedPrice,
    },
  });

  // Deduct stock for the pending order
  await prisma.surpriseBox.update({
    where: { id: bakery1BoxA.id },
    data: { stockQuantity: { decrement: sampleOrder.quantity } },
  });

  console.log("✅ Sample order created");

  // ── Nomination ─────────────────────────────────────────────────────────────
  await prisma.businessNomination.create({
    data: {
      userId: consumer.id,
      nominatorName: "Fatma Çelik",
      nominatorEmail: "fatma@example.com",
      nominatedBusinessName: "Boğaziçi Pastanesi",
      nominatedAddress: "Bebek Caddesi No:8, Beşiktaş, İstanbul",
      reason: "Her akşam harika pastalar kalıyor, çok yazık atılıyor",
    },
  });

  console.log("\n🎉 Beta seed tamamlandı!");
  console.log("\nTest hesapları:");
  console.log("  Admin:       admin@foodrescue.com     / admin123");
  console.log("  İşletme 1:   isletme@foodrescue.com   / merchant123  (Kadıköy Fırını + Beşiktaş Fırını)");
  console.log("  İşletme 2:   pastane@foodrescue.com   / pastane456   (İnci Pastanesi + Galata Kafe)");
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
