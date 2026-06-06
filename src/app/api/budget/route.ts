import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateJSON, type ChatMessage } from "@/lib/ai";
import { budgetSchema } from "@/lib/validations";
import { STRATEGY_SYSTEM_PROMPT } from "@/config/prompts";
import type { Prisma } from "@/generated/prisma/client";

interface BudgetRecommendation {
  platformRankings: {
    platform: string;
    rank: number;
    reasoning: string;
    contentTypes: string[];
    frequency: string;
    paidOrganic: string;
  }[];
  budgetAllocation: {
    platform: string;
    percentage: number;
    estimatedReach: string;
  }[];
  overallStrategy: string;
  complianceNotes: string[];
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { businessId, totalBudget, month, overrides } = budgetSchema.parse(body);

    const business = await prisma.business.findFirst({
      where: { id: businessId, ownerId: (session.user as { id: string }).id },
      include: { profile: true, channels: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const contextMessage = `
Business: ${business.name} (${business.type})
Location: ${business.city}, ${business.province}, ${business.country}
Profile: ${JSON.stringify(business.profile)}
Connected channels: ${business.channels.map((c) => c.platform).join(", ")}
Monthly budget: $${totalBudget}
${overrides ? `User overrides: ${JSON.stringify(overrides)}` : ""}
    `.trim();

    const messages: ChatMessage[] = [{ role: "user", content: contextMessage }];

    const recommendation = await generateJSON<BudgetRecommendation>(
      messages,
      STRATEGY_SYSTEM_PROMPT
    );

    let allocations = recommendation.budgetAllocation;

    if (overrides) {
      const overriddenTotal = Object.values(overrides).reduce((sum, v) => sum + v, 0);
      const remainingPct = 100 - overriddenTotal;
      const nonOverridden = allocations.filter(
        (a) => !overrides[a.platform]
      );
      const nonOverriddenTotal = nonOverridden.reduce(
        (sum, a) => sum + a.percentage,
        0
      );

      allocations = allocations.map((a) => {
        if (overrides[a.platform] !== undefined) {
          return { ...a, percentage: overrides[a.platform] };
        }
        const proportional =
          nonOverriddenTotal > 0
            ? (a.percentage / nonOverriddenTotal) * remainingPct
            : remainingPct / nonOverridden.length;
        return { ...a, percentage: Math.round(proportional) };
      });
    }

    const saved = await prisma.budgetAllocation.upsert({
      where: {
        businessId_month: { businessId, month: new Date(month) },
      },
      create: {
        businessId,
        month: new Date(month),
        totalBudget,
        allocations: JSON.parse(JSON.stringify(allocations)) as Prisma.InputJsonValue,
        isAiGenerated: !overrides,
      },
      update: {
        totalBudget,
        allocations: JSON.parse(JSON.stringify(allocations)) as Prisma.InputJsonValue,
        isAiGenerated: !overrides,
      },
    });

    return NextResponse.json({
      id: saved.id,
      recommendation,
      allocations,
      totalBudget,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
