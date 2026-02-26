import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  Share2,
  QrCode,
  Palette,
  UserPlus,
  Sparkles,
  BarChart3,
  TrendingUp,
  Edit,
  Mail,
  Phone,
  Building2,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  { label: "Total Contacts", value: "0", sub: "+12% this week", icon: Users },
  { label: "Cards Created", value: "1", sub: "1 active", icon: CreditCard },
  { label: "Total Shares", value: "0", sub: "+5 today", icon: Share2 },
  { label: "QR Scans", value: "0", sub: "This month", icon: QrCode },
];

const quickActions = [
  { label: "Create Template", icon: Palette, path: "/my-card", color: "text-destructive" },
  { label: "Invite Users", icon: UserPlus, path: "/my-team", color: "text-primary" },
  { label: "Update Card", icon: Sparkles, path: "/my-card", color: "text-warning" },
  { label: "View Analytics", icon: BarChart3, path: "/analytics", color: "text-success" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [engagementTab, setEngagementTab] = useState<"shares" | "scans">("shares");
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setLeads(data);
      });
  }, []);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Profile Strength */}
      <div className="bg-card rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
            VA
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profile Strength</p>
            <div className="flex items-center gap-3 mt-1">
              <Progress value={65} className="w-40 h-2" />
              <span className="text-sm font-semibold text-primary">65%</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/settings/app-preferences")}
          className="text-sm text-primary font-medium hover:underline"
        >
          Complete Profile →
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1 font-display">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
            <s.icon className="h-5 w-5 text-primary/60" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="quick-action-card">
              <a.icon className={`h-6 w-6 ${a.color}`} />
              <span className="text-sm font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card Preview + Engagement */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-xl border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">My Card</h2>
            <div className="flex gap-2">
              <button onClick={() => navigate("/my-card")} className="p-2 rounded-lg hover:bg-secondary">
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => navigate("/my-card")} className="p-2 rounded-lg hover:bg-secondary">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-primary-foreground min-h-[200px] flex flex-col justify-between">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wider">VEDAA AI</p>
              <p className="text-xl font-bold mt-2 font-display">Your Name</p>
              <p className="text-sm opacity-80">Your Designation</p>
            </div>
            <div className="space-y-1 text-sm opacity-80">
              <p>+91 XXXXXXXXXX</p>
              <p>your@email.com</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <h2 className="section-title mb-4">Engagement Overview</h2>
          <div className="flex gap-8 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold font-display">0</p>
              <p className="text-sm text-muted-foreground">Total Shares</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-display">0</p>
              <p className="text-sm text-muted-foreground">QR Scans</p>
            </div>
          </div>
          <div className="bg-success/10 text-success rounded-lg p-3 flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            Your profile views are up this week
          </div>

          <h3 className="text-sm font-semibold mt-6 mb-3">Contacts By</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Tags", "Location", "Industry", "Favourites"].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate("/contacts")}
                className="bg-secondary rounded-lg p-3 text-center text-sm font-medium hover:bg-secondary/80 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Received Leads */}
      <div className="bg-card rounded-xl border p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Received Leads</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {leads.length} total
          </span>
        </div>
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No leads yet. Share your card to start collecting contacts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead: any, i: number) => (
              <div key={lead.id || i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {`${lead.first_name?.[0] || ""}${lead.last_name?.[0] || ""}`.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                    )}
                    {lead.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {lead.company}
                      </span>
                    )}
                  </div>
                  {lead.message && <p className="text-xs text-muted-foreground mt-1 truncate">"{lead.message}"</p>}
                </div>
                {lead.created_at && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
            {leads.length > 5 && (
              <button
                onClick={() => navigate("/contacts")}
                className="w-full text-center text-sm text-primary font-medium hover:underline py-2"
              >
                View all {leads.length} leads →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
