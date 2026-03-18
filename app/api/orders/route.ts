import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitResponse, LIMITS } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  const limited = rateLimitResponse(request, LIMITS.API);
  if (limited) return limited;

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { box: { include: { business: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      { success: false, error: "Siparişler yüklenemedi" },
      { status: 500 }
    );
  }
}
