import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory token-bucket rate limiter.
 *
 * IMPORTANT — MVP caveat: this store lives in the Node.js process.
 * In a multi-instance or serverless environment each replica has its own store.
 * For production replace with a Redis-backed solution (e.g. @upstash/ratelimit).
 */

interface Bucket {
  tokens: number;
  lastRefill: number; // ms since epoch
}

const store = new Map<string, Bucket>();

export interface RateLimitConfig {
  limit: number;      // max requests per window
  windowSecs: number; // window length in seconds
}

/** Pre-configured limits for common route types */
export const LIMITS = {
  AUTH:    { limit: 5,  windowSecs: 60 } satisfies RateLimitConfig,
  API:     { limit: 30, windowSecs: 60 } satisfies RateLimitConfig,
  PAYMENT: { limit: 3,  windowSecs: 60 } satisfies RateLimitConfig,
};

/**
 * Check whether a request from `identifier` is within the rate limit.
 * Returns true if the request is allowed, false if it should be rejected.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): boolean {
  const now = Date.now();
  const windowMs = config.windowSecs * 1000;
  const refillRate = config.limit / windowMs; // tokens per ms

  // Prune stale entries to prevent unbounded memory growth
  if (store.size > 2000) {
    for (const [key, bucket] of store) {
      if (now - bucket.lastRefill > windowMs * 2) store.delete(key);
    }
  }

  let bucket = store.get(identifier);
  if (!bucket) {
    store.set(identifier, { tokens: config.limit - 1, lastRefill: now });
    return true;
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(config.limit, bucket.tokens + elapsed * refillRate);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1;
  return true;
}

/** Extract the best available identifier (IP + optional user suffix) */
export function getIdentifier(request: NextRequest, suffix = ""): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return suffix ? `${ip}:${suffix}` : ip;
}

/** Drop-in helper: returns a 429 response or null if the request is allowed */
export function rateLimitResponse(
  request: NextRequest,
  config: RateLimitConfig,
  suffix = ""
): NextResponse | null {
  const id = getIdentifier(request, suffix);
  if (checkRateLimit(id, config)) return null;
  return NextResponse.json(
    { success: false, error: "Çok fazla istek. Lütfen biraz bekleyin." },
    { status: 429 }
  );
}
