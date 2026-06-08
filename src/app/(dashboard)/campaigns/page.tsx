"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CampaignGoal =
  | "BRAND_AWARENESS"
  | "LEAD_GENERATION"
  | "SALES_CONVERSIONS"
  | "FOOT_TRAFFIC"
  | "ENGAGEMENT"
  | "EVENT_REGISTRATIONS"
  | "WEBSITE_TRAFFIC"
  | "REFERRALS";

type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  goalType: CampaignGoal;
  targetValue: number;
  currentValue: number;
  budget: number;
  spentAmount: number;
  status: CampaignStatus;
  channels: string[];
  startDate: string;
  endDate: string;
}

const GOAL_LABELS: Record<CampaignGoal, string> = {
  BRAND_AWARENESS: "Brand Awareness",
  LEAD_GENERATION: "Lead Generation",
  SALES_CONVERSIONS: "Sales / Conversions",
  FOOT_TRAFFIC: "Foot Traffic",
  ENGAGEMENT: "Engagement",
  EVENT_REGISTRATIONS: "Event Registrations",
  WEBSITE_TRAFFIC: "Website Traffic",
  REFERRALS: "Referrals",
};

const GOAL_UNITS: Record<CampaignGoal, string> = {
  BRAND_AWARENESS: "impressions",
  LEAD_GENERATION: "leads",
  SALES_CONVERSIONS: "conversions",
  FOOT_TRAFFIC: "store visits",
  ENGAGEMENT: "engagements",
  EVENT_REGISTRATIONS: "registrations",
  WEBSITE_TRAFFIC: "clicks",
  REFERRALS: "referrals",
};

const STATUS_COLORS: Record<CampaignStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Summer Coffee Launch",
    description: "Promote our new cold brew line across social media and Google",
    goalType: "BRAND_AWARENESS",
    targetValue: 50000,
    currentValue: 32000,
    budget: 2000,
    spentAmount: 1240,
    status: "ACTIVE",
    channels: ["META", "INSTAGRAM", "GOOGLE"],
    startDate: "2026-06-01",
    endDate: "2026-06-30",
  },
  {
    id: "2",
    name: "Holiday Catering Leads",
    description: "Generate catering inquiry leads for holiday season",
    goalType: "LEAD_GENERATION",
    targetValue: 100,
    currentValue: 45,
    budget: 3000,
    spentAmount: 1800,
    status: "ACTIVE",
    channels: ["META", "GOOGLE", "LINKEDIN"],
    startDate: "2026-05-15",
    endDate: "2026-07-15",
  },
  {
    id: "3",
    name: "Grand Opening Week",
    description: "Drive foot traffic to our new downtown location",
    goalType: "FOOT_TRAFFIC",
    targetValue: 500,
    currentValue: 500,
    budget: 1500,
    spentAmount: 1450,
    status: "COMPLETED",
    channels: ["META", "INSTAGRAM", "GOOGLE"],
    startDate: "2026-04-01",
    endDate: "2026-04-07",
  },
  {
    id: "4",
    name: "Workshop Series Promo",
    description: "Fill seats for our monthly latte art workshops",
    goalType: "EVENT_REGISTRATIONS",
    targetValue: 40,
    currentValue: 12,
    budget: 500,
    spentAmount: 0,
    status: "DRAFT",
    channels: ["INSTAGRAM", "META"],
    startDate: "2026-07-01",
    endDate: "2026-07-31",
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO_CAMPAIGNS);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    goalType: "BRAND_AWARENESS" as CampaignGoal,
    targetValue: "",
    budget: "",
    startDate: "",
    endDate: "",
    channels: [] as string[],
  });

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spentAmount, 0);

  const toggleChannel = (channel: string) => {
    setNewCampaign((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.targetValue || !newCampaign.budget || !newCampaign.startDate || !newCampaign.endDate) {
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "demo",
          name: newCampaign.name,
          description: newCampaign.description || undefined,
          goalType: newCampaign.goalType,
          targetValue: parseInt(newCampaign.targetValue),
          budget: parseFloat(newCampaign.budget),
          channels: newCampaign.channels,
          startDate: newCampaign.startDate,
          endDate: newCampaign.endDate,
        }),
      });

      if (res.ok) {
        const { campaign } = await res.json();
        setCampaigns((prev) => [campaign, ...prev]);
        setNewCampaign({
          name: "",
          description: "",
          goalType: "BRAND_AWARENESS",
          targetValue: "",
          budget: "",
          startDate: "",
          endDate: "",
          channels: [],
        });
        setShowCreate(false);
      } else {
        // Fallback: add locally for demo/UAT purposes
        const localCampaign: Campaign = {
          id: crypto.randomUUID(),
          name: newCampaign.name,
          description: newCampaign.description || undefined,
          goalType: newCampaign.goalType,
          targetValue: parseInt(newCampaign.targetValue),
          currentValue: 0,
          budget: parseFloat(newCampaign.budget),
          spentAmount: 0,
          status: "DRAFT",
          channels: newCampaign.channels,
          startDate: newCampaign.startDate,
          endDate: newCampaign.endDate,
        };
        setCampaigns((prev) => [localCampaign, ...prev]);
        setNewCampaign({
          name: "",
          description: "",
          goalType: "BRAND_AWARENESS",
          targetValue: "",
          budget: "",
          startDate: "",
          endDate: "",
          channels: [],
        });
        setShowCreate(false);
      }
    } catch {
      // Fallback: add locally
      const localCampaign: Campaign = {
        id: crypto.randomUUID(),
        name: newCampaign.name,
        description: newCampaign.description || undefined,
        goalType: newCampaign.goalType,
        targetValue: parseInt(newCampaign.targetValue),
        currentValue: 0,
        budget: parseFloat(newCampaign.budget),
        spentAmount: 0,
        status: "DRAFT",
        channels: newCampaign.channels,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
      };
      setCampaigns((prev) => [localCampaign, ...prev]);
      setNewCampaign({
        name: "",
        description: "",
        goalType: "BRAND_AWARENESS",
        targetValue: "",
        budget: "",
        startDate: "",
        endDate: "",
        channels: [],
      });
      setShowCreate(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-500">Create and track goal-driven marketing campaigns</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "+ New Campaign"}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeCampaigns}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
        </Card>
      </div>

      {/* Create Campaign Form */}
      {showCreate && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Campaign Name"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              placeholder="e.g. Summer Promo 2026"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Type
              </label>
              <select
                value={newCampaign.goalType}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, goalType: e.target.value as CampaignGoal })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(GOAL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={`Target (${GOAL_UNITS[newCampaign.goalType]})`}
              type="number"
              value={newCampaign.targetValue}
              onChange={(e) => setNewCampaign({ ...newCampaign, targetValue: e.target.value })}
              placeholder="e.g. 1000"
              required
            />
            <Input
              label="Budget ($)"
              type="number"
              value={newCampaign.budget}
              onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
              placeholder="e.g. 2000"
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={newCampaign.startDate}
              onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={newCampaign.endDate}
              onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {["META", "INSTAGRAM", "GOOGLE", "TIKTOK", "LINKEDIN", "YOUTUBE"].map(
                  (channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleChannel(channel)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        newCampaign.channels.includes(channel)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {channel}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <Input
                label="Description (optional)"
                value={newCampaign.description}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, description: e.target.value })
                }
                placeholder="Brief description of the campaign goal and approach"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={handleCreateCampaign} loading={creating}>
                Create Campaign
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const progress = Math.min(
            (campaign.currentValue / campaign.targetValue) * 100,
            100
          );
          const budgetUsed = campaign.budget > 0 ? (campaign.spentAmount / campaign.budget) * 100 : 0;
          const daysLeft = Math.max(
            0,
            Math.ceil(
              (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          );

          return (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campaign.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[campaign.status]}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {campaign.status === "COMPLETED" ? (
                    <span className="text-blue-600 font-medium">Completed</span>
                  ) : daysLeft > 0 ? (
                    <span>{daysLeft} days left</span>
                  ) : (
                    <span className="text-red-600">Ended</span>
                  )}
                </div>
              </div>

              {/* Goal Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Goal: {GOAL_LABELS[campaign.goalType]}
                  </span>
                  <span className="font-medium">
                    {campaign.currentValue.toLocaleString()} / {campaign.targetValue.toLocaleString()}{" "}
                    {GOAL_UNITS[campaign.goalType]}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      progress >= 100
                        ? "bg-green-500"
                        : progress >= 60
                        ? "bg-indigo-600"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
              </div>

              {/* Budget & Channels */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Budget:</span>{" "}
                    <span className="font-medium">
                      ${campaign.spentAmount.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </span>
                    <span className="text-gray-400 ml-1">({Math.round(budgetUsed)}%)</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Period:</span>{" "}
                    <span className="font-medium">
                      {new Date(campaign.startDate).toLocaleDateString()} –{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {campaign.channels.map((ch) => (
                    <span
                      key={ch}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
