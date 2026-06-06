"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <div>
                  <p className="font-medium text-indigo-900">Free Trial</p>
                  <p className="text-sm text-indigo-700">14 days remaining</p>
                </div>
                <Button size="sm">Upgrade</Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Starter</span>
                  <span className="text-gray-900">$49/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Growth</span>
                  <span className="text-gray-900">$99/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pro</span>
                  <span className="text-gray-900">$199/month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Configure which LLM provider powers your marketing insights.
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300">
                  <input type="radio" name="provider" value="openai" defaultChecked className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">OpenAI (GPT-4o)</p>
                    <p className="text-xs text-gray-500">Fast, reliable, great for structured output</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300">
                  <input type="radio" name="provider" value="anthropic" className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Anthropic (Claude)</p>
                    <p className="text-xs text-gray-500">Nuanced, great for compliance-aware content</p>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Budget 80% spent alert</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Platform connection expiry</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Engagement drop alerts</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Weekly performance digest</span>
                <input type="checkbox" className="rounded text-indigo-600" />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="danger" size="sm">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
