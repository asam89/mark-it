"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  status: "LEAD" | "CONVERTED" | "LOST";
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "John Smith", email: "john@example.com", source: "META", status: "LEAD", createdAt: "2024-01-15" },
    { id: "2", name: "Sarah Connor", email: "sarah@example.com", source: "GOOGLE", status: "CONVERTED", createdAt: "2024-01-12" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", source: "INSTAGRAM", status: "LOST", createdAt: "2024-01-10" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", source: "META" });

  const statusColors = {
    LEAD: "bg-blue-100 text-blue-700",
    CONVERTED: "bg-green-100 text-green-700",
    LOST: "bg-red-100 text-red-700",
  };

  const addLead = () => {
    if (!newLead.name) return;
    setLeads([
      ...leads,
      {
        id: String(leads.length + 1),
        name: newLead.name,
        email: newLead.email,
        source: newLead.source,
        status: "LEAD",
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewLead({ name: "", email: "", source: "META" });
    setShowForm(false);
  };

  const conversionRate = leads.length > 0
    ? ((leads.filter((l) => l.status === "CONVERTED").length / leads.length) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Tracking</h1>
          <p className="text-gray-500">Manage and track your marketing leads</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Lead"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Converted</p>
          <p className="text-2xl font-bold text-green-600">
            {leads.filter((l) => l.status === "CONVERTED").length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-indigo-600">{conversionRate}%</p>
        </Card>
      </div>

      {/* Add Lead Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Lead name"
              />
              <Input
                label="Email"
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="lead@example.com"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="META">Meta</option>
                  <option value="GOOGLE">Google</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="YOUTUBE">YouTube</option>
                </select>
              </div>
            </div>
            <Button className="mt-4" onClick={addLead}>Save Lead</Button>
          </CardContent>
        </Card>
      )}

      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Source</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{lead.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{lead.source}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{lead.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
