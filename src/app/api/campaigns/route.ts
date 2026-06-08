import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createCampaignSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  goalType: z.enum([
    "BRAND_AWARENESS",
    "LEAD_GENERATION",
    "SALES_CONVERSIONS",
    "FOOT_TRAFFIC",
    "ENGAGEMENT",
    "EVENT_REGISTRATIONS",
    "WEBSITE_TRAFFIC",
    "REFERRALS",
  ]),
  targetValue: z.number().int().positive(),
  budget: z.number().positive(),
  channels: z.array(
    z.enum(["META", "INSTAGRAM", "GOOGLE", "TIKTOK", "LINKEDIN", "YOUTUBE"])
  ),
  startDate: z.string(),
  endDate: z.string(),
});

const updateCampaignSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]).optional(),
  currentValue: z.number().int().min(0).optional(),
  spentAmount: z.number().min(0).optional(),
});

function getUserId(session: { user?: Record<string, unknown> }): string {
  return (session.user as { id: string }).id;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json(
      { error: "businessId is required" },
      { status: 400 }
    );
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, ownerId: getUserId(session) },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createCampaignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { businessId, name, description, goalType, targetValue, budget, channels, startDate, endDate } = parsed.data;

  const business = await prisma.business.findFirst({
    where: { id: businessId, ownerId: getUserId(session) },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      businessId,
      name,
      description,
      goalType,
      targetValue,
      budget,
      channels,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateCampaignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, status, currentValue, spentAmount } = parsed.data;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    select: { businessId: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const business = await prisma.business.findFirst({
    where: { id: campaign.businessId, ownerId: getUserId(session) },
  });

  if (!business) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (currentValue !== undefined) updateData.currentValue = currentValue;
  if (spentAmount !== undefined) updateData.spentAmount = spentAmount;

  const updated = await prisma.campaign.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ campaign: updated });
}
