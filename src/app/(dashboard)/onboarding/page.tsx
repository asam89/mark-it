"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/onboarding/chat-interface";

export default function OnboardingPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      const res = await fetch("/api/business");
      if (res.ok) {
        const businesses = await res.json();
        if (businesses.length > 0) {
          setBusinessId(businesses[0].id);
        }
      }
      setLoading(false);
    }
    fetchBusiness();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No business found. Please complete signup first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Onboarding</h1>
        <p className="text-gray-500">
          Chat with our AI consultant to build your marketing profile
        </p>
      </div>

      <ChatInterface
        businessId={businessId}
        onComplete={() => router.push("/dashboard")}
      />
    </div>
  );
}
