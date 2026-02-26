import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Key, Copy, Plus, Trash2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface License {
  id: number;
  key: string;
  assignedTo: string;
  status: string;
  activatedOn: string;
  expiresOn: string;
}

const initialLicenses: License[] = [
  { id: 1, key: "VDA-PRO-2026-XXXX-A1B2", assignedTo: "Rahul Sharma", status: "Active", activatedOn: "2026-01-01", expiresOn: "2027-01-01" },
  { id: 2, key: "VDA-PRO-2026-XXXX-C3D4", assignedTo: "Priya Patel", status: "Active", activatedOn: "2026-01-15", expiresOn: "2027-01-15" },
  { id: 3, key: "VDA-STD-2026-XXXX-E5F6", assignedTo: "Unassigned", status: "Available", activatedOn: "-", expiresOn: "2027-03-01" },
];

export default function LicensesPage() {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState("");

  const totalLicenses = 5;
  const usedLicenses = licenses.filter(l => l.status === "Active").length;

  const addLicense = () => {
    if (!newKey) return toast.error("Enter a license key");
    setLicenses([...licenses, { id: Date.now(), key: newKey, assignedTo: "Unassigned", status: "Available", activatedOn: "-", expiresOn: "2027-12-31" }]);
    setNewKey("");
    setShowAdd(false);
    toast.success("License added!");
  };

  const revoke = (id: number) => {
    setLicenses(licenses.map(l => l.id === id ? { ...l, status: "Revoked", assignedTo: "Unassigned" } : l));
    toast.success("License revoked");
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("License key copied");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Licenses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization's license keys</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-2" /> Add License
        </Button>
      </div>

      {/* Usage overview */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total Licenses</p>
          <p className="text-2xl font-bold font-display mt-1">{totalLicenses}</p>
        </div>
        <div className="bg-card rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Used</p>
          <p className="text-2xl font-bold font-display mt-1 text-primary">{usedLicenses}</p>
        </div>
        <div className="bg-card rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold font-display mt-1 text-success">{totalLicenses - usedLicenses}</p>
          <Progress value={(usedLicenses / totalLicenses) * 100} className="mt-2 h-2" />
        </div>
      </div>

      {showAdd && (
        <div className="bg-card rounded-xl border p-5 mb-6 space-y-3">
          <h3 className="font-medium text-sm">Add License Key</h3>
          <Input placeholder="Enter license key (e.g. VDA-PRO-2026-XXXX-XXXX)" value={newKey} onChange={e => setNewKey(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={addLicense}>Add</Button>
            <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {licenses.map(lic => (
          <div key={lic.id} className="bg-card rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${lic.status === "Active" ? "bg-primary/10 text-primary" : lic.status === "Available" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                <Key className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-medium">{lic.key}</p>
                  <button onClick={() => copyKey(lic.key)} className="p-1 hover:bg-secondary rounded"><Copy className="h-3 w-3 text-muted-foreground" /></button>
                </div>
                <p className="text-xs text-muted-foreground">Assigned to: {lic.assignedTo} · Expires: {lic.expiresOn}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${lic.status === "Active" ? "bg-success/10 text-success" : lic.status === "Available" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {lic.status === "Active" && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                {lic.status === "Revoked" && <XCircle className="h-3 w-3 inline mr-1" />}
                {lic.status}
              </span>
              {lic.status === "Active" && (
                <Button size="sm" variant="outline" onClick={() => revoke(lic.id)}>
                  <RefreshCw className="h-3 w-3 mr-1" /> Revoke
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
