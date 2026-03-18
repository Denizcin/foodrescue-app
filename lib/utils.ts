/**
 * Haversine formula — returns straight-line distance in kilometres between
 * two lat/lng points. Accurate enough for city-scale proximity sorting.
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatCurrency(amount: number): string {
  return `₺${amount.toFixed(2)}`;
}

export function generatePickupCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function maskPickupCode(code: string): string {
  if (code.length < 4) return code;
  return code.slice(0, 2) + "••" + code.slice(-2);
}

export function isPickupWindowExpired(pickupTimeEnd: string): boolean {
  return new Date() > new Date(pickupTimeEnd);
}

export function isPickupWindowActive(pickupTimeStart: string, pickupTimeEnd: string): boolean {
  const now = new Date();
  return now >= new Date(pickupTimeStart) && now <= new Date(pickupTimeEnd);
}

const COMMISSION_RATE = 0.15;

export function calcCommission(totalPrice: number) {
  const commissionAmount = Math.round(totalPrice * COMMISSION_RATE * 100) / 100;
  const merchantAmount = Math.round((totalPrice - commissionAmount) * 100) / 100;
  return { commissionRate: COMMISSION_RATE, commissionAmount, merchantAmount };
}
