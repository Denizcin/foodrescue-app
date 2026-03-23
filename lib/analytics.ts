/**
 * Analytics utilities for FoodRescue.
 * Sends events to Google Analytics via window.gtag when GA is loaded.
 * Falls back to console.log in development.
 */

export type EventName =
  | "box_viewed"
  | "box_purchased"
  | "order_created"
  | "order_cancelled"
  | "nomination_submitted"
  | "pickup_code_copied"
  | "business_registered"
  | "box_published"
  | "business_nominated";

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(name: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return;

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, params);
  }
}

// Typed event helpers
export const analytics = {
  orderCreated: (boxId: string, businessName: string, total: number) =>
    trackEvent("order_created", { box_id: boxId, business_name: businessName, value: total, currency: "TRY" }),

  orderCancelled: (orderId: string) =>
    trackEvent("order_cancelled", { order_id: orderId }),

  boxPublished: (category: string, quantity: number) =>
    trackEvent("box_published", { category, quantity }),

  businessNominated: (businessName: string) =>
    trackEvent("business_nominated", { business_name: businessName }),
};
