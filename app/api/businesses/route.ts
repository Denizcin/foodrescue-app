import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitResponse, LIMITS } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  const limited = rateLimitResponse(request, LIMITS.API);
  if (limited) return limited;

  try {
    const businesses = await prisma.business.findMany({
      where: { isActive: true, isApproved: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: businesses });
  } catch (error) {
    console.error("GET /api/businesses failed:", error);
    return NextResponse.json(
      { success: false, error: "İşletmeler yüklenemedi" },
      { status: 500 }
    );
  }
}
