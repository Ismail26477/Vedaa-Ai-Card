import { Share2, QrCode, UserPlus, Download, Mail, Smartphone, Globe, Zap } from "lucide-react";
import { toast } from "sonner";

const actions = [
  { label: "Share Card", icon: Share2, desc: "Share your digital card", color: "text-primary" },
  { label: "Generate QR", icon: QrCode, desc: "Create a scannable QR code", color: "text-success" },
  { label: "Invite Contacts", icon: UserPlus, desc: "Grow your network", color: "text-warning" },
  { label: "Export Contacts", icon: Download, desc: "Download contacts as CSV", color: "text-destructive" },
  { label: "Email Signature", icon: Mail, desc: "Add card to email signature", color: "text-primary" },
  { label: "NFC Setup", icon: Smartphone, desc: "Configure NFC tap sharing", color: "text-success" },
  { label: "Custom Domain", icon: Globe, desc: "Set your custom card URL", color: "text-warning" },
  { label: "Quick Scan", icon: Zap, desc: "Scan a paper business card", color: "text-destructive" },
];

export default function Actions() {
  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-bold font-display mb-6">Quick Actions</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map(a => (
          <button
            key={a.label}
            onClick={() => toast.success(`${a.label} — Coming soon!`)}
            className="quick-action-card"
          >
            <a.icon className={`h-7 w-7 ${a.color}`} />
            <span className="font-medium text-sm">{a.label}</span>
            <span className="text-xs text-muted-foreground text-center">{a.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
