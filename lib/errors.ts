export const ERROR_MESSAGES: Record<string, string> = {
  BOX_NOT_FOUND: "Bu kutu bulunamadı",
  BOX_SOLD_OUT: "Bu kutu tükendi",
  BOX_EXPIRED: "Teslim alma süresi dolmuş",
  INSUFFICIENT_STOCK: "Yeterli stok yok",
  ORDER_NOT_FOUND: "Sipariş bulunamadı",
  ORDER_ALREADY_COMPLETED: "Bu sipariş zaten tamamlanmış",
  ORDER_ALREADY_CANCELLED: "Bu sipariş zaten iptal edilmiş",
  INVALID_PICKUP_CODE:
    "Eşleşen sipariş bulunamadı. Lütfen kodu kontrol edin.",
  UNAUTHORIZED: "Bu işlem için giriş yapmanız gerekiyor",
  FORBIDDEN: "Bu işlem için yetkiniz yok",
  GENERIC_ERROR: "Bir hata oluştu. Lütfen tekrar deneyin.",
};
