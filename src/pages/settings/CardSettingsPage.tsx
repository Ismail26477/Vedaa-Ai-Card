import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Palette, Type, Layout, Eye } from "lucide-react";

const templates = ["Classic", "Modern", "Minimal", "Bold"];
const fontOptions = ["Inter", "Plus Jakarta Sans", "Poppins", "Roboto"];

export default function CardSettingsPage() {
  const [brandColor, setBrandColor] = useState("#3B82F6");
  const [accentColor, setAccentColor] = useState("#6366F1");
  const [template, setTemplate] = useState("Modern");
  const [font, setFont] = useState("Plus Jakarta Sans");
  const [showLogo, setShowLogo] = useState(true);
  const [showQR, setShowQR] = useState(true);
  const [showSocial, setShowSocial] = useState(true);
  const [roundedCorners, setRoundedCorners] = useState(true);
  const [companyName, setCompanyName] = useState("Vedaa AI");
  const [tagline, setTagline] = useState("Smart Digital Business Cards");

  const save = () => toast.success("Card settings saved!");

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-bold font-display mb-6">Card Settings</h1>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Settings */}
        <div className="lg:col-span-3 space-y-6">
          {/* Branding */}
          <div className="bg-card rounded-xl border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="section-title">Branding</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Company Name</label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tagline</label>
                <Input value={tagline} onChange={e => setTagline(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Brand Color</label>
                <div className="flex gap-2">
                  <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="h-10 w-10 rounded cursor-pointer border" />
                  <Input value={brandColor} onChange={e => setBrandColor(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Accent Color</label>
                <div className="flex gap-2">
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="h-10 w-10 rounded cursor-pointer border" />
                  <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="bg-card rounded-xl border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <h2 className="section-title">Layout & Template</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Template</label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {templates.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Font</label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-card rounded-xl border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="section-title">Display Options</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Show Company Logo", val: showLogo, set: setShowLogo },
                { label: "Show QR Code", val: showQR, set: setShowQR },
                { label: "Show Social Links", val: showSocial, set: setShowSocial },
                { label: "Rounded Corners", val: roundedCorners, set: setRoundedCorners },
              ].map(opt => (
                <div key={opt.label} className="flex justify-between items-center">
                  <span className="text-sm">{opt.label}</span>
                  <Switch checked={opt.val} onCheckedChange={opt.set} />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={save} className="w-full sm:w-auto">Save Card Settings</Button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="section-title mb-3">Preview</h3>
            <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }}>
              <div className={`p-6 text-white min-h-[220px] flex flex-col justify-between ${roundedCorners ? "rounded-xl" : ""}`}>
                <div>
                  <p className="text-xs opacity-80 uppercase tracking-wider">{companyName}</p>
                  <p className="text-xl font-bold mt-2" style={{ fontFamily: font }}>Your Name</p>
                  <p className="text-sm opacity-80">Your Designation</p>
                </div>
                <div className="space-y-1 text-sm opacity-80">
                  <p>+91 XXXXXXXXXX</p>
                  <p>your@email.com</p>
                  {showSocial && <p className="text-xs mt-2">LinkedIn · Twitter · Website</p>}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Template: {template} · Font: {font}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
