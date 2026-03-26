import { z } from "zod";

export const createBoxSchema = z
  .object({
    category: z.enum(["BAKERY", "PATISSERIE", "CAFE"]),
    description: z.string().max(500).optional(),
    originalPrice: z.number().positive("Fiyat sıfırdan büyük olmalıdır"),
    discountedPrice: z
      .number()
      .positive("İndirimli fiyat sıfırdan büyük olmalıdır"),
    stockQuantity: z
      .number()
      .int()
      .min(1, "En az 1 kutu olmalıdır")
      .max(50, "En fazla 50 kutu olabilir"),
    pickupTimeStart: z.string().datetime(),
    pickupTimeEnd: z.string().datetime(),
  })
  .refine((data) => data.discountedPrice < data.originalPrice, {
    message: "İndirimli fiyat normal fiyattan düşük olmalıdır",
    path: ["discountedPrice"],
  })
  .refine(
    (data) => {
      const start = new Date(data.pickupTimeStart);
      const end = new Date(data.pickupTimeEnd);
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return diffMinutes >= 30;
    },
    {
      message: "Teslim alma süresi en az 30 dakika olmalıdır",
      path: ["pickupTimeEnd"],
    }
  )
  .refine((data) => new Date(data.pickupTimeEnd) > new Date(), {
    message: "Teslim alma bitiş saati gelecekte olmalıdır",
    path: ["pickupTimeEnd"],
  });

export const createOrderSchema = z.object({
  boxId: z.string().min(1),
  quantity: z.number().int().min(1).max(3),
});

export const verifyPickupSchema = z.object({
  pickupCode: z.string().length(6, "Pickup kodu 6 karakter olmalıdır"),
});

export const createNominationSchema = z.object({
  nominatorName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  nominatorPhone: z.string().optional(),
  nominatorEmail: z
    .string()
    .email("Geçerli bir email adresi giriniz")
    .optional()
    .or(z.literal("")),
  nominatedBusinessName: z
    .string()
    .min(2, "İşletme adı en az 2 karakter olmalıdır"),
  nominatedAddress: z.string().min(5, "Adres en az 5 karakter olmalıdır"),
  reason: z.string().max(500).optional(),
});

export const registerConsumerSchema = z
  .object({
    name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    phone: z.string().optional(),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const registerBusinessSchema = z.object({
  ownerName: z.string().min(2),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  businessName: z.string().min(2, "İşletme adı en az 2 karakter olmalıdır"),
  category: z.enum([
    "BAKERY",
    "RESTAURANT",
    "CAFE",
    "GROCERY",
    "GREENGROCER",
    "MARKET",
    "PATISSERIE",
    "DELI",
    "FLORIST",
    "OTHER",
  ]),
  address: z.string().min(5),
  phone: z.string().optional(),
  operatingHours: z.string().min(3),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir"),
});
