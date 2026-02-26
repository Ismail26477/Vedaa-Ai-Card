import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Trash2, Shield, Search, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  joined: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Rahul Sharma", email: "rahul@vedaa.ai", role: "Admin", status: "Active", department: "Management", joined: "2025-01-15" },
  { id: 2, name: "Priya Patel", email: "priya@vedaa.ai", role: "Member", status: "Active", department: "Sales", joined: "2025-03-20" },
  { id: 3, name: "Amit Kumar", email: "amit@vedaa.ai", role: "Member", status: "Active", department: "Marketing", joined: "2025-06-10" },
  { id: 4, name: "Sneha Reddy", email: "sneha@vedaa.ai", role: "Viewer", status: "Invited", department: "Design", joined: "2026-01-05" },
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", role: "Member", department: "" });
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = users.filter(u =>
    (roleFilter === "All" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const addUser = () => {
    if (!invite.name || !invite.email) return toast.error("Name and email required");
    setUsers([...users, { ...invite, id: Date.now(), status: "Invited", joined: new Date().toISOString().split("T")[0] }]);
    setInvite({ name: "", email: "", role: "Member", department: "" });
    setShowInvite(false);
    toast.success("User invited successfully!");
  };

  const removeUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success("User removed");
  };

  const changeRole = (id: number, role: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    toast.success("Role updated");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Manage Users</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} users in your organization</p>
        </div>
        <Button onClick={() => setShowInvite(!showInvite)}>
          <UserPlus className="h-4 w-4 mr-2" /> Invite User
        </Button>
      </div>

      {showInvite && (
        <div className="bg-card rounded-xl border p-5 mb-6 space-y-3">
          <h3 className="font-medium text-sm">Invite New User</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Full name" value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} />
            <Input placeholder="Email address" value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} />
            <Input placeholder="Department" value={invite.department} onChange={e => setInvite({ ...invite, department: e.target.value })} />
            <Select value={invite.role} onValueChange={v => setInvite({ ...invite, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addUser}>Send Invite</Button>
            <Button size="sm" variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {["All", "Admin", "Member", "Viewer"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${roleFilter === r ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">User</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Role</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Department</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Joined</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-secondary/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "Admin" ? "bg-primary/10 text-primary" : u.role === "Member" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">{u.department}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{u.joined}</td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-secondary rounded"><MoreVertical className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeRole(u.id, "Admin")}><Shield className="h-4 w-4 mr-2" /> Make Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeRole(u.id, "Member")}>Make Member</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeRole(u.id, "Viewer")}>Make Viewer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeUser(u.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
