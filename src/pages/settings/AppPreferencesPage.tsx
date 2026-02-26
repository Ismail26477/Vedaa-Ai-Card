import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Globe, Moon, Bell, Shield, Download, Trash2 } from "lucide-react";

export default function AppPreferencesPage() {
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("IST (UTC+5:30)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [emailDigest, setEmailDigest] = useState("weekly");
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const save = () => toast.success("Preferences saved!");

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-bold font-display mb-6">App Preferences</h1>

      <div className="max-w-2xl space-y-6">
        {/* Language & Region */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="section-title">Language & Region</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Timezone</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IST (UTC+5:30)">IST (UTC+5:30)</SelectItem>
                  <SelectItem value="PST (UTC-8)">PST (UTC-8)</SelectItem>
                  <SelectItem value="EST (UTC-5)">EST (UTC-5)</SelectItem>
                  <SelectItem value="GMT (UTC+0)">GMT (UTC+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date Format</label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <h2 className="section-title">Appearance</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={v => { setDarkMode(v); toast.info(v ? "Dark mode enabled" : "Light mode enabled"); }} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Compact Mode</p>
                <p className="text-xs text-muted-foreground">Reduce spacing for denser layouts</p>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Auto-save</p>
                <p className="text-xs text-muted-foreground">Automatically save changes</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="section-title">Email Digest</h2>
          </div>
          <Select value={emailDigest} onValueChange={setEmailDigest}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="section-title">Security</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add extra security to your account</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={v => { setTwoFactor(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Session Timeout (minutes)</label>
            <Input value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="w-32" type="number" />
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <h2 className="section-title">Data Management</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast.success("Data export started! You'll receive a download link via email.")}>
              <Download className="h-4 w-4 mr-2" /> Export All Data
            </Button>
            <Button variant="destructive" onClick={() => toast.error("Please contact support to delete your account.")}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
            </Button>
          </div>
        </div>

        <Button onClick={save}>Save Preferences</Button>
      </div>
    </div>
  );
}
