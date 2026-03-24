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

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("❌ Seed must not run in production. Aborting.");
  }
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.order.deleteMany();
  await prisma.businessNomination.deleteMany();
  await prisma.surpriseBox.deleteMany();
  await prisma.business.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const adminPassword = await bcrypt.hash("admin123", 12);
  const merchantPassword = await bcrypt.hash("merchant123", 12);
  const consumerPassword = await bcrypt.hash("consumer123", 12);

  await prisma.user.create({
    data: {
      name: "FoodRescue Admin",
      email: "admin@foodrescue.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const merchantUser = await prisma.user.create({
    data: {
      name: "Mehmet Yılmaz",
      email: "isletme@foodrescue.com",
      passwordHash: merchantPassword,
      role: "MERCHANT",
      phone: "+90 532 111 22 33",
    },
  });

  const consumerUser = await prisma.user.create({
    data: {
      name: "Ayşe Kaya",
      email: "tuketici@foodrescue.com",
      passwordHash: consumerPassword,
      role: "CONSUMER",
      phone: "+90 533 444 55 66",
      impactSavedMoney: 127.5,
      impactCo2: 7.5,
      impactFood: 3.0,
    },
  });

  console.log("✅ Users created");

  // --- Businesses ---
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Coordinates are real Istanbul neighbourhoods verified on OSM.
  // Spread across Kadıköy, Beşiktaş, Beyoğlu, Şişli — all within ~8 km of each other.
  const bakery = await prisma.business.create({
    data: {
      ownerId: merchantUser.id,
      name: "Altın Başak Fırını",
      category: "BAKERY",
      description: "1985'ten beri taze ekmek ve unlu mamüller",
      address: "Bahariye Caddesi No:42, Kadıköy, İstanbul",
      locationLat: 40.9905,  // Kadıköy çarşı merkezi
      locationLng: 29.0303,
      operatingHours: "Pzt-Cmt 06:00-20:00",
      phone: "+90 216 555 11 22",
      isActive: true,
      isApproved: true,
    },
  });

  const cafe = await prisma.business.create({
    data: {
      ownerId: merchantUser.id,
      name: "Kahve Durağı",
      category: "CAFE",
      description: "Özel kavurma kahveler ve ev yapımı tatlılar",
      address: "Teşvikiye Caddesi No:5, Beşiktaş, İstanbul",
      locationLat: 41.0477,  // Beşiktaş / Teşvikiye
      locationLng: 29.0002,
      operatingHours: "Her gün 08:00-23:00",
      phone: "+90 212 555 33 44",
      isActive: true,
      isApproved: true,
    },
  });

  const restaurant = await prisma.business.create({
    data: {
      ownerId: merchantUser.id,
      name: "Sakura Sushi",
      category: "RESTAURANT",
      address: "İstiklal Caddesi No:78, Beyoğlu, İstanbul",
      locationLat: 41.0335,  // Taksim / Beyoğlu
      locationLng: 28.9778,
      operatingHours: "Sal-Paz 11:00-22:00",
      isActive: true,
      isApproved: true,
    },
  });

  const greengrocer = await prisma.business.create({
    data: {
      ownerId: merchantUser.id,
      name: "Doğal Manav",
      category: "GREENGROCER",
      description: "Taze sebze ve meyveler, çiftçiden sofranıza",
      address: "Moda Caddesi No:15, Kadıköy, İstanbul",
      locationLat: 40.9838,  // Moda, Kadıköy
      locationLng: 29.0271,
      operatingHours: "Her gün 07:00-21:00",
      isActive: true,
      isApproved: true,
    },
  });

  console.log("✅ Businesses created");

  // --- Surprise Boxes ---
  // Pickup windows: starting 2 hours from now, valid for 2 hours
  const pickupStart = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
  const pickupEnd = new Date(now.getTime() + 4 * 60 * 60 * 1000);   // +4 hours

  const box1 = await prisma.surpriseBox.create({
    data: {
      businessId: bakery.id,
      category: "BAKERY",
      description: "Günün kalan unlu mamülleri: ekmek, çörek, poğaça",
      originalPrice: 120,
      discountedPrice: 55,
      stockQuantity: 5,
      pickupTimeStart: pickupStart,
      pickupTimeEnd: pickupEnd,
      isActive: true,
    },
  });

  const box2 = await prisma.surpriseBox.create({
    data: {
      businessId: cafe.id,
      category: "CAFE",
      description: "Akşam kapanışından kalan sandviçler ve tatlılar",
      originalPrice: 90,
      discountedPrice: 40,
      stockQuantity: 3,
      pickupTimeStart: pickupStart,
      pickupTimeEnd: pickupEnd,
      isActive: true,
    },
  });

  const box3 = await prisma.surpriseBox.create({
    data: {
      businessId: restaurant.id,
      category: "SUSHI",
      description: "Günün kalan suşi tabakları ve maki",
      originalPrice: 200,
      discountedPrice: 85,
      stockQuantity: 2,
      pickupTimeStart: pickupStart,
      pickupTimeEnd: pickupEnd,
      isActive: true,
    },
  });

  const box4 = await prisma.surpriseBox.create({
    data: {
      businessId: greengrocer.id,
      category: "PRODUCE",
      description: "Görünümü farklı ama lezzetli mevsim meyve-sebzeleri",
      originalPrice: 80,
      discountedPrice: 35,
      stockQuantity: 8,
      pickupTimeStart: pickupStart,
      pickupTimeEnd: pickupEnd,
      isActive: true,
    },
  });

  // A low-stock box (1 remaining)
  await prisma.surpriseBox.create({
    data: {
      businessId: bakery.id,
      category: "MIXED",
      description: "Karışık fırın ürünleri sürpriz kutusu",
      originalPrice: 150,
      discountedPrice: 65,
      stockQuantity: 1,
      pickupTimeStart: pickupStart,
      pickupTimeEnd: pickupEnd,
      isActive: true,
    },
  });

  console.log("✅ Surprise boxes created");

  // --- Orders ---
  const order1 = await prisma.order.create({
    data: {
      userId: consumerUser.id,
      boxId: box1.id,
      status: "PENDING",
      pickupCode: "AX3K9F",
      quantity: 1,
      totalPrice: box1.discountedPrice,
    },
  });

  await prisma.order.create({
    data: {
      userId: consumerUser.id,
      boxId: box2.id,
      status: "PICKED_UP",
      pickupCode: "BM7T2R",
      quantity: 1,
      totalPrice: box2.discountedPrice,
    },
  });

  await prisma.order.create({
    data: {
      userId: consumerUser.id,
      boxId: box3.id,
      status: "CANCELLED",
      pickupCode: "CP4W8N",
      quantity: 1,
      totalPrice: box3.discountedPrice,
    },
  });

  // Update stock for the pending order
  await prisma.surpriseBox.update({
    where: { id: box1.id },
    data: { stockQuantity: box1.stockQuantity - order1.quantity },
  });

  console.log("✅ Orders created");

  // --- Nominations ---
  await prisma.businessNomination.create({
    data: {
      userId: consumerUser.id,
      nominatorName: "Fatma Şahin",
      nominatorEmail: "fatma@example.com",
      nominatedBusinessName: "Çiçek Pastanesi",
      nominatedAddress: "Bağlarbaşı Caddesi No:8, Üsküdar, İstanbul",
      reason: "Her gün akşam üzeri harika pasta ve kek kalıyor, keşke buraya katsalar",
    },
  });

  await prisma.businessNomination.create({
    data: {
      nominatorName: "Ali Öztürk",
      nominatedBusinessName: "Balık Evi Restoran",
      nominatedAddress: "Caddebostan Sahili No:22, Kadıköy, İstanbul",
      reason: "Günün balıkları her akşam atılıyor, çok yazık",
    },
  });

  console.log("✅ Nominations created");

  console.log("\n🎉 Seed complete!");
  console.log("\nTest credentials:");
  console.log("  Admin:    admin@foodrescue.com / admin123");
  console.log("  Merchant: isletme@foodrescue.com / merchant123");
  console.log("  Consumer: tuketici@foodrescue.com / consumer123");
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
