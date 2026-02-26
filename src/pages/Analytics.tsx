import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const engagementData = [
  { name: "Mon", views: 12, shares: 5 },
  { name: "Tue", views: 19, shares: 8 },
  { name: "Wed", views: 15, shares: 6 },
  { name: "Thu", views: 25, shares: 12 },
  { name: "Fri", views: 22, shares: 10 },
  { name: "Sat", views: 8, shares: 3 },
  { name: "Sun", views: 5, shares: 2 },
];

const sourceData = [
  { name: "QR Code", value: 40, color: "hsl(221, 83%, 53%)" },
  { name: "Direct Link", value: 30, color: "hsl(142, 71%, 45%)" },
  { name: "Email", value: 20, color: "hsl(45, 93%, 47%)" },
  { name: "WhatsApp", value: 10, color: "hsl(250, 83%, 60%)" },
];

const leadsData = [
  { name: "Week 1", leads: 5 },
  { name: "Week 2", leads: 12 },
  { name: "Week 3", leads: 8 },
  { name: "Week 4", leads: 18 },
];

const tabs = ["Engagement", "Sources", "Leads"];

export default function Analytics() {
  const [tab, setTab] = useState("Engagement");

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-bold font-display mb-6">Analytics</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Engagement" && (
        <div className="bg-card rounded-xl border p-6">
          <h2 className="section-title mb-4">Card Views & Shares</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "Sources" && (
        <div className="bg-card rounded-xl border p-6">
          <h2 className="section-title mb-4">Traffic Sources</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                  <span className="text-sm">{s.name}: {s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Leads" && (
        <div className="bg-card rounded-xl border p-6">
          <h2 className="section-title mb-4">Leads Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
