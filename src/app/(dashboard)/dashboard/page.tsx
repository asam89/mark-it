"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardData {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  engagementRate: number;
  budgetRemaining: number;
  allocations: {
    platform: string;
    percentage: number;
    amount: number;
    color: string;
  }[];
  totalBudget: number;
  recommendations: {
    id: string;
    title: string;
    content: string;
    type: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from API. For now, use demo data.
    setData({
      totalSpend: 2450,
      totalImpressions: 125000,
      totalClicks: 3200,
      engagementRate: 4.2,
      budgetRemaining: 1550,
      totalBudget: 4000,
      allocations: [
        { platform: "META", percentage: 35, amount: 1400, color: "#1877F2" },
        { platform: "GOOGLE", percentage: 30, amount: 1200, color: "#4285F4" },
        { platform: "INSTAGRAM", percentage: 20, amount: 800, color: "#E4405F" },
        { platform: "LINKEDIN", percentage: 15, amount: 600, color: "#0A66C2" },
      ],
      recommendations: [
        {
          id: "1",
          title: "Optimize Meta Ad Timing",
          content: "Your Instagram engagement peaks between 6-8 PM. Consider shifting your ad schedule to capture more engagement during these hours.",
          type: "PERFORMANCE",
        },
        {
          id: "2",
          title: "Google Ads Budget Alert",
          content: "Your cost-per-click has increased 15% this week. Consider reviewing your keyword targeting to improve efficiency.",
          type: "BUDGET",
        },
      ],
    });
    setLoading(false);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Your marketing performance at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Spend"
          value={`$${data.totalSpend.toLocaleString()}`}
          change="12% from last month"
          changeType="neutral"
        />
        <StatsCard
          title="Impressions"
          value={data.totalImpressions.toLocaleString()}
          change="+18%"
          changeType="positive"
        />
        <StatsCard
          title="Total Clicks"
          value={data.totalClicks.toLocaleString()}
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Engagement Rate"
          value={`${data.engagementRate}%`}
          change="-0.3%"
          changeType="negative"
        />
      </div>

      {/* Budget & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart
          allocations={data.allocations}
          totalBudget={data.totalBudget}
          onOverride={(platform, pct) => {
            console.log(`Override ${platform} to ${pct}%`);
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h4 className="text-sm font-semibold text-indigo-900">{rec.title}</h4>
                  <p className="text-sm text-indigo-700 mt-1">{rec.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Meter */}
      <Card>
        <CardHeader>
          <CardTitle>Worth-It Meter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl">👍</div>
            <div>
              <p className="text-gray-900 font-medium">
                Based on your ${data.totalSpend.toLocaleString()} spend this month, you generated
                approximately {data.totalClicks.toLocaleString()} engagements. Your cost per engagement
                is ${(data.totalSpend / data.totalClicks).toFixed(2)}, which is below the average for
                businesses in your category.
              </p>
              <p className="text-sm text-gray-500 mt-2">Updated weekly based on your latest data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
