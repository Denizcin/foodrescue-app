import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitResponse, LIMITS } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  const limited = rateLimitResponse(request, LIMITS.API);
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      pickupTimeEnd: { gt: new Date() },
      stockQuantity: { gt: 0 },
    };

    if (category && category !== "ALL") {
      where.category = category;
    }

    const boxes = await prisma.surpriseBox.findMany({
      where,
      include: { business: true },
      orderBy: { pickupTimeStart: "asc" },
    });

    return NextResponse.json({ success: true, data: boxes });
  } catch (error) {
    console.error("GET /api/boxes failed:", error);
    return NextResponse.json(
      { success: false, error: "Kutular yüklenemedi" },
      { status: 500 }
    );
  }
}
