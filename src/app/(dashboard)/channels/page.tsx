"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PLATFORMS = [
  { id: "META", name: "Meta (Facebook + Instagram)", icon: "📘", status: "not_connected", description: "Ads, reach, impressions, leads" },
  { id: "GOOGLE", name: "Google (Ads + Business)", icon: "🔍", status: "not_connected", description: "Ads, clicks, conversions, search impressions" },
  { id: "INSTAGRAM", name: "Instagram (Organic)", icon: "📸", status: "not_connected", description: "Followers, post reach, engagement" },
  { id: "TIKTOK", name: "TikTok", icon: "🎵", status: "not_connected", description: "Video views, engagement, followers" },
  { id: "LINKEDIN", name: "LinkedIn", icon: "💼", status: "not_connected", description: "Ads, impressions, clicks, leads" },
  { id: "YOUTUBE", name: "YouTube", icon: "▶️", status: "not_connected", description: "Views, watch time, subscribers, ad spend" },
];

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Channels</h1>
        <p className="text-gray-500">Connect your platforms to sync data and track performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map((platform) => (
          <Card key={platform.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{platform.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-500">{platform.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Not Connected
              </span>
              <Button size="sm" variant="secondary">
                Connect
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-indigo-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-medium text-indigo-900">Phase 2 Platforms</h3>
            <p className="text-sm text-indigo-700 mt-1">
              TikTok, LinkedIn, and YouTube integrations are coming soon.
              Meta, Google, and Instagram are available for Phase 1 MVP.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
