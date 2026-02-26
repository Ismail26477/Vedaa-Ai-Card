import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

const integrations = [
  { id: "salesforce", name: "Salesforce", desc: "Sync contacts and leads with Salesforce CRM", category: "CRM", icon: "🔵" },
  { id: "hubspot", name: "HubSpot", desc: "Connect your HubSpot CRM for seamless contact sync", category: "CRM", icon: "🟠" },
  { id: "zoho", name: "Zoho CRM", desc: "Integrate with Zoho CRM for lead management", category: "CRM", icon: "🔴" },
  { id: "gmail", name: "Gmail", desc: "Sync email signatures and contacts with Gmail", category: "Email", icon: "📧" },
  { id: "outlook", name: "Outlook", desc: "Connect with Microsoft Outlook for email integration", category: "Email", icon: "📬" },
  { id: "teams", name: "Microsoft Teams", desc: "Share cards directly in Teams conversations", category: "Collaboration", icon: "💬" },
  { id: "slack", name: "Slack", desc: "Share cards and get notifications in Slack", category: "Collaboration", icon: "💜" },
  { id: "zapier", name: "Zapier", desc: "Automate workflows with 5000+ apps", category: "Automation", icon: "⚡" },
  { id: "google_calendar", name: "Google Calendar", desc: "Sync meetings and events", category: "Calendar", icon: "📅" },
  { id: "webhooks", name: "Webhooks", desc: "Send real-time data to your custom endpoints", category: "Developer", icon: "🔗" },
];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ gmail: true, google_calendar: true });
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(integrations.map(i => i.category))];
  const filtered = filter === "All" ? integrations : integrations.filter(i => i.category === filter);

  const toggle = (id: string) => {
    const next = !connected[id];
    setConnected({ ...connected, [id]: next });
    toast.success(next ? `${integrations.find(i => i.id === id)?.name} connected!` : `${integrations.find(i => i.id === id)?.name} disconnected`);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect your favourite tools to supercharge your workflow</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>{Object.values(connected).filter(Boolean).length} Connected</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${filter === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(integ => (
          <div key={integ.id} className="bg-card rounded-xl border p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integ.icon}</span>
                <div>
                  <p className="font-medium text-sm">{integ.name}</p>
                  <p className="text-xs text-muted-foreground">{integ.category}</p>
                </div>
              </div>
              {connected[integ.id] ? (
                <span className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /> Active</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><XCircle className="h-3 w-3" /> Inactive</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex-1">{integ.desc}</p>
            <div className="flex items-center justify-between pt-2 border-t">
              <Switch checked={!!connected[integ.id]} onCheckedChange={() => toggle(integ.id)} />
              <Button size="sm" variant="ghost" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" /> Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
