import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      where: { ownerId: (session.user as { id: string }).id },
      include: {
        profile: true,
        channels: { select: { platform: true, status: true } },
        subscription: { select: { tier: true, status: true } },
      },
    });

    return NextResponse.json(businesses);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
