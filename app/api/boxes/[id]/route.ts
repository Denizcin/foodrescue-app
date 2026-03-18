import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitResponse, LIMITS } from "@/lib/ratelimit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitResponse(_request, LIMITS.API);
  if (limited) return limited;

  try {
    const { id } = await params;

    const box = await prisma.surpriseBox.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!box) {
      return NextResponse.json(
        { success: false, error: "Bu kutu bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: box });
  } catch (error) {
    console.error("GET /api/boxes/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Kutu yüklenemedi" },
      { status: 500 }
    );
  }
}
