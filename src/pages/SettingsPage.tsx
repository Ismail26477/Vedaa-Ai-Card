import { useState } from "react";
import { User, Shield, Bell, HelpCircle, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const tabs = [
  { label: "Account", icon: User },
  { label: "Privacy", icon: Shield },
  { label: "Notifications", icon: Bell },
  { label: "Help", icon: HelpCircle },
  { label: "Feedback", icon: MessageSquare },
];

const faqs = [
  { q: "How do I share my card?", a: "Go to My Card and click the Share button to share via WhatsApp, Email, SMS, or copy the link." },
  { q: "Can I create multiple cards?", a: "Yes! Click 'New Card' on the My Card page. You can set one as primary." },
  { q: "How does QR scanning work?", a: "Each card generates a unique QR code. Anyone who scans it will see your digital card." },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("Account");
  const [profile, setProfile] = useState({ name: "Your Name", email: "your@email.com", company: "Vedaa AI", phone: "" });
  const [privacy, setPrivacy] = useState({ publicProfile: true, showEmail: true, showPhone: false, locationTracking: false });
  const [notifs, setNotifs] = useState({ emailNotifs: true, scanAlerts: true, teamUpdates: true, marketing: false });
  const [feedback, setFeedback] = useState("");

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-bold font-display mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:w-48 shrink-0">
          {tabs.map(t => (
            <button
              key={t.label}
              onClick={() => setTab(t.label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                tab === t.label ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-card rounded-xl border p-6">
          {tab === "Account" && (
            <div className="space-y-4 max-w-md">
              <h2 className="section-title">Account Information</h2>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
              <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="Email" />
              <Input value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })} placeholder="Company" />
              <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
              <Button onClick={() => toast.success("Profile saved!")}>Save Changes</Button>
            </div>
          )}

          {tab === "Privacy" && (
            <div className="space-y-5 max-w-md">
              <h2 className="section-title">Privacy Settings</h2>
              {Object.entries(privacy).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <Switch checked={val} onCheckedChange={v => setPrivacy({ ...privacy, [key]: v })} />
                </div>
              ))}
              <Button onClick={() => toast.success("Privacy settings saved!")}>Save</Button>
            </div>
          )}

          {tab === "Notifications" && (
            <div className="space-y-5 max-w-md">
              <h2 className="section-title">Notification Preferences</h2>
              {Object.entries(notifs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <Switch checked={val} onCheckedChange={v => setNotifs({ ...notifs, [key]: v })} />
                </div>
              ))}
              <Button onClick={() => toast.success("Notification preferences saved!")}>Save</Button>
            </div>
          )}

          {tab === "Help" && (
            <div className="space-y-4">
              <h2 className="section-title">Frequently Asked Questions</h2>
              {faqs.map((f, i) => (
                <details key={i} className="border rounded-lg p-4">
                  <summary className="font-medium text-sm cursor-pointer">{f.q}</summary>
                  <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
                </details>
              ))}
            </div>
          )}

          {tab === "Feedback" && (
            <div className="space-y-4 max-w-md">
              <h2 className="section-title">Send Feedback</h2>
              <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Tell us what you think..." rows={5} />
              <Button onClick={() => { toast.success("Feedback sent! Thank you."); setFeedback(""); }}>Submit Feedback</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
