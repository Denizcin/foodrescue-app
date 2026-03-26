export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export type OrderStatus = "PENDING" | "PICKED_UP" | "CANCELLED";

export type BoxCategory =
  | "BAKERY"
  | "PATISSERIE"
  | "CAFE";

export type BusinessCategory =
  | "BAKERY"
  | "RESTAURANT"
  | "CAFE"
  | "GROCERY"
  | "GREENGROCER"
  | "MARKET"
  | "PATISSERIE"
  | "DELI"
  | "FLORIST"
  | "OTHER";

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description?: string;
  address: string;
  locationLat: number;
  locationLng: number;
  operatingHours: string;
  imageUrl?: string;
  phone?: string;
  isActive: boolean;
}

export interface SurpriseBox {
  id: string;
  businessId: string;
  business?: Business;
  category: BoxCategory;
  description?: string;
  originalPrice: number;
  discountedPrice: number;
  stockQuantity: number;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  boxId: string;
  box?: SurpriseBox;
  status: OrderStatus;
  pickupCode: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  locationLat?: number;
  locationLng?: number;
  impactSavedMoney: number;
  impactCo2: number;
  impactFood: number;
  notificationPreferences?: {
    orderEmails: boolean;
    newBoxAlerts: boolean;
    promotionalEmails: boolean;
  } | null;
}

export interface Favorite {
  id: string;
  userId: string;
  businessId: string;
  createdAt: string;
  business?: Business & {
    activeBoxes?: SurpriseBox[];
  };
}

export interface BusinessNomination {
  id: string;
  userId?: string;
  nominatorName: string;
  nominatorPhone?: string;
  nominatorEmail?: string;
  nominatedBusinessName: string;
  nominatedAddress: string;
  reason?: string;
}
