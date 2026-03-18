import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  // iyzipay uses dynamic require() with absolute paths which Turbopack cannot bundle.
  // Marking it as external so Node.js loads it natively at runtime.
  serverExternalPackages: ["iyzipay"],

  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
