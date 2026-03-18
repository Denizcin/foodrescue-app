import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://foodrescue.com.tr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/consumer`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/consumer/nominate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/kvkk`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/kullanim-sartlari`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cerez-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/mesafeli-satis-sozlesmesi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes: active surprise boxes
  let boxRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeBoxes = await prisma.surpriseBox.findMany({
      where: {
        isActive: true,
        pickupTimeEnd: { gt: now },
        business: { isApproved: true, isActive: true },
      },
      select: { id: true, updatedAt: true },
    });

    boxRoutes = activeBoxes.map((box) => ({
      url: `${BASE_URL}/consumer/box/${box.id}`,
      lastModified: box.updatedAt,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    }));
  } catch {
    // Non-fatal: sitemap still works without dynamic routes
  }

  return [...staticRoutes, ...boxRoutes];
}
