/**
 * Analytics utilities for FoodRescue.
 *
 * Currently logs to console in development.
 * To enable Google Analytics, set NEXT_PUBLIC_GA_ID in your environment
 * and uncomment the GA script in app/layout.tsx.
 *
 * GA Measurement ID format: G-XXXXXXXXXX
 */

export type EventName =
  | "box_viewed"
  | "box_purchased"
  | "order_cancelled"
  | "nomination_submitted"
  | "pickup_code_copied"
  | "business_registered"
  | "box_published";

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a custom analytics event.
 * In production with GA enabled, this calls window.gtag().
 * Otherwise logs to console (development only).
 */
export function trackEvent(name: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return;

  // Google Analytics (gtag) — active when GA script is loaded
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params);
    return;
  }

  // Development fallback
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, params);
  }
}
