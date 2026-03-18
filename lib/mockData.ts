import type { Business, SurpriseBox, Order, User, BusinessNomination } from "@/lib/types";

// ---------------------------------------------------------------------------
// Businesses — 4 Istanbul locations
// ---------------------------------------------------------------------------
export const mockBusinesses: Business[] = [
  {
    id: "biz-1",
    name: "Altın Başak Fırını",
    category: "BAKERY",
    description: "1985'ten beri taze ekmek ve unlu mamüller",
    address: "Bağdat Caddesi No:42, Kadıköy, İstanbul",
    locationLat: 40.9862,
    locationLng: 29.0231,
    operatingHours: "Pzt-Cmt 06:00-20:00",
    isActive: true,
  },
  {
    id: "biz-2",
    name: "Sakura Sushi & Ramen",
    category: "RESTAURANT",
    description: "İstanbul'un kalbinde otantik Japon mutfağı",
    address: "İstiklal Caddesi No:78, Beyoğlu, İstanbul",
    locationLat: 41.0335,
    locationLng: 28.977,
    operatingHours: "Sal-Paz 11:00-22:00",
    isActive: true,
  },
  {
    id: "biz-3",
    name: "Doğal Manav",
    category: "GREENGROCER",
    description: "Çiftçiden doğrudan taze meyve ve sebze",
    address: "Moda Caddesi No:15, Kadıköy, İstanbul",
    locationLat: 40.9827,
    locationLng: 29.0253,
    operatingHours: "Her gün 07:00-21:00",
    isActive: true,
  },
  {
    id: "biz-4",
    name: "Kahve Durağı",
    category: "CAFE",
    description: "Özel kavurma kahveler ve el yapımı tatlılar",
    address: "Abdi İpekçi Caddesi No:5, Nişantaşı, İstanbul",
    locationLat: 41.0485,
    locationLng: 28.9939,
    operatingHours: "Her gün 08:00-23:00",
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Surprise Boxes — 6 boxes across the 4 businesses
// Pickup windows use today's date for realistic countdown display
// ---------------------------------------------------------------------------
const today = new Date();
const fmt = (h: number, m = 0) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const mockBoxes: SurpriseBox[] = [
  {
    // Active — plenty of stock
    id: "box-1",
    businessId: "biz-1",
    business: mockBusinesses[0],
    category: "BAKERY",
    description: "Günün kalan unlu mamülleri — ekmek, kruasan, poğaça karışımı",
    originalPrice: 120,
    discountedPrice: 55,
    stockQuantity: 8,
    pickupTimeStart: fmt(17, 0),
    pickupTimeEnd: fmt(19, 0),
    isActive: true,
  },
  {
    // Active — low stock (≤3 triggers urgency)
    id: "box-2",
    businessId: "biz-2",
    business: mockBusinesses[1],
    category: "SUSHI",
    description: "Günün kalan suşi ve maki tabaklarından oluşan sürpriz kutu",
    originalPrice: 200,
    discountedPrice: 90,
    stockQuantity: 2,
    pickupTimeStart: fmt(21, 0),
    pickupTimeEnd: fmt(22, 30),
    isActive: true,
  },
  {
    // Active — produce box
    id: "box-3",
    businessId: "biz-3",
    business: mockBusinesses[2],
    category: "PRODUCE",
    description: "Görünüşü farklı ama lezzetli meyve ve sebze karışımı",
    originalPrice: 80,
    discountedPrice: 35,
    stockQuantity: 5,
    pickupTimeStart: fmt(18, 30),
    pickupTimeEnd: fmt(20, 0),
    isActive: true,
  },
  {
    // Active — café box
    id: "box-4",
    businessId: "biz-4",
    business: mockBusinesses[3],
    category: "CAFE",
    description: "Kalan sandviç, kek ve soğuk içeceklerden oluşan kutu",
    originalPrice: 150,
    discountedPrice: 65,
    stockQuantity: 4,
    pickupTimeStart: fmt(20, 30),
    pickupTimeEnd: fmt(22, 0),
    isActive: true,
  },
  {
    // Sold out
    id: "box-5",
    businessId: "biz-1",
    business: mockBusinesses[0],
    category: "BAKERY",
    description: "Sabah poğaçaları ve taze ekmek kutusu",
    originalPrice: 100,
    discountedPrice: 45,
    stockQuantity: 0,
    pickupTimeStart: fmt(10, 0),
    pickupTimeEnd: fmt(11, 30),
    isActive: false,
  },
  {
    // Expired pickup window (yesterday)
    id: "box-6",
    businessId: "biz-2",
    business: mockBusinesses[1],
    category: "PREPARED_MEAL",
    description: "Günün hazır yemek kutusu",
    originalPrice: 180,
    discountedPrice: 80,
    stockQuantity: 3,
    pickupTimeStart: (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      d.setHours(14, 0, 0, 0);
      return d.toISOString();
    })(),
    pickupTimeEnd: (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      d.setHours(16, 0, 0, 0);
      return d.toISOString();
    })(),
    isActive: false,
  },
];

// ---------------------------------------------------------------------------
// Users — 2 mock users
// ---------------------------------------------------------------------------
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Ayşe Kaya",
    email: "ayse.kaya@example.com",
    phone: "+90 532 111 2233",
    locationLat: 40.984,
    locationLng: 29.025,
    impactSavedMoney: 342.5,
    impactCo2: 17.5,
    impactFood: 7.0,
  },
  {
    id: "user-2",
    name: "Mehmet Yılmaz",
    email: "mehmet.yilmaz@example.com",
    locationLat: 41.033,
    locationLng: 28.978,
    impactSavedMoney: 130.0,
    impactCo2: 7.5,
    impactFood: 3.0,
  },
];

// ---------------------------------------------------------------------------
// Orders — 4 orders in varied states
// ---------------------------------------------------------------------------
export const mockOrders: Order[] = [
  {
    // PENDING — active, visible pickup code, has countdown
    id: "order-1",
    userId: "user-1",
    boxId: "box-4",
    box: mockBoxes[3],
    status: "PENDING",
    pickupCode: "KF7X2M",
    quantity: 1,
    totalPrice: 65,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    // PICKED_UP — completed order in history
    id: "order-2",
    userId: "user-1",
    boxId: "box-1",
    box: mockBoxes[0],
    status: "PICKED_UP",
    pickupCode: "AX3P9Q",
    quantity: 2,
    totalPrice: 110,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    // CANCELLED
    id: "order-3",
    userId: "user-1",
    boxId: "box-3",
    box: mockBoxes[2],
    status: "CANCELLED",
    pickupCode: "ZQ8R4T",
    quantity: 1,
    totalPrice: 35,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    // PENDING — expired pickup window (box-6 ended yesterday)
    id: "order-4",
    userId: "user-2",
    boxId: "box-6",
    box: mockBoxes[5],
    status: "PENDING",
    pickupCode: "BN5L1W",
    quantity: 1,
    totalPrice: 80,
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Business Nominations — 2 crowdsourced leads
// ---------------------------------------------------------------------------
export const mockNominations: BusinessNomination[] = [
  {
    id: "nom-1",
    userId: "user-1",
    nominatorName: "Ayşe Kaya",
    nominatorPhone: "+90 532 111 2233",
    nominatorEmail: "ayse.kaya@example.com",
    nominatedBusinessName: "Çiçek Pastanesi",
    nominatedAddress: "Bağdat Caddesi No:120, Kadıköy, İstanbul",
    reason: "Her gün çok güzel pasta ve börek yapıyorlar, kesinlikle katılmalılar!",
  },
  {
    id: "nom-2",
    nominatorName: "Ali Demir",
    nominatorEmail: "ali.demir@example.com",
    nominatedBusinessName: "Boğaz Market",
    nominatedAddress: "Ortaköy Dereboyu Caddesi No:8, Beşiktaş, İstanbul",
    reason: "Taze ürünleri çok ama hep israf olduğunu görüyorum.",
  },
];

// ---------------------------------------------------------------------------
// Mock authenticated user (for consumer portal prototype)
// ---------------------------------------------------------------------------
export const mockCurrentUser: User = mockUsers[0];
