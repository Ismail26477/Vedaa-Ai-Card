import { useState } from "react";
import { UserPlus, MoreVertical, Trash2, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "pending";
}

export default function MyTeam() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "You (Admin)", email: "admin@vedaaai.com", role: "Admin", department: "Management", status: "active" },
  ]);
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Team Member", department: "" });

  const invite = () => {
    if (!form.email) { toast.error("Email required"); return; }
    setMembers([...members, { id: Date.now().toString(), name: form.name || form.email, email: form.email, role: form.role, department: form.department, status: "pending" }]);
    setForm({ name: "", email: "", role: "Team Member", department: "" });
    setShowInvite(false);
    toast.success("Invitation sent!");
  };

  const remove = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success("Member removed");
  };

  const changeRole = (id: string, role: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
    toast.success("Role updated");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-display">My Team</h1>
        <Button onClick={() => setShowInvite(true)} className="gap-2">
          <UserPlus className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="bg-card rounded-xl border divide-y">
        {members.map(m => (
          <div key={m.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${m.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {m.status}
              </span>
              <Select value={m.role} onValueChange={v => changeRole(m.id, v)}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {m.id !== "1" && (
                <button onClick={() => remove(m.id)} className="p-1.5 hover:bg-secondary rounded text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Team Member">Team Member</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={invite} className="w-full">Send Invitation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
