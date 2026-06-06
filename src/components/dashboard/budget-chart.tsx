"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Allocation {
  platform: string;
  percentage: number;
  amount: number;
  color: string;
}

interface BudgetChartProps {
  allocations: Allocation[];
  totalBudget: number;
  onOverride?: (platform: string, percentage: number) => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  META: "#1877F2",
  INSTAGRAM: "#E4405F",
  GOOGLE: "#4285F4",
  TIKTOK: "#000000",
  LINKEDIN: "#0A66C2",
  YOUTUBE: "#FF0000",
};

export function BudgetChart({ allocations, totalBudget, onOverride }: BudgetChartProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleSave = (platform: string) => {
    const pct = parseFloat(editValue);
    if (!isNaN(pct) && pct >= 0 && pct <= 100 && onOverride) {
      onOverride(platform, pct);
    }
    setEditing(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Allocation</CardTitle>
        <p className="text-sm text-gray-500">
          Total: ${totalBudget.toLocaleString()}/month
        </p>
      </CardHeader>
      <CardContent>
        {/* Visual bar */}
        <div className="flex h-8 rounded-lg overflow-hidden mb-6">
          {allocations.map((alloc) => (
            <div
              key={alloc.platform}
              style={{
                width: `${alloc.percentage}%`,
                backgroundColor: PLATFORM_COLORS[alloc.platform] || "#6B7280",
              }}
              className="flex items-center justify-center text-white text-xs font-medium min-w-[30px] transition-all"
              title={`${alloc.platform}: ${alloc.percentage}%`}
            >
              {alloc.percentage >= 10 && `${alloc.percentage}%`}
            </div>
          ))}
        </div>

        {/* Breakdown list */}
        <div className="space-y-3">
          {allocations.map((alloc) => (
            <div key={alloc.platform} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PLATFORM_COLORS[alloc.platform] || "#6B7280" }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {alloc.platform}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {editing === alloc.platform ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      min={0}
                      max={100}
                    />
                    <span className="text-sm text-gray-500">%</span>
                    <Button size="sm" onClick={() => handleSave(alloc.platform)}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-900 font-medium">
                      ${alloc.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">({alloc.percentage}%)</span>
                    {onOverride && (
                      <button
                        onClick={() => {
                          setEditing(alloc.platform);
                          setEditValue(String(alloc.percentage));
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
