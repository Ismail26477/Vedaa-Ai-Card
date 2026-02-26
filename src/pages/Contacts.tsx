import { useState, useEffect } from "react";
import { Plus, Search, Grid3X3, List, Filter, Star, StarOff, Mail, Phone, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  source: string;
  favourite: boolean;
  tags: string[];
  message?: string;
  created_at?: string;
}

const tabs = ["All", "Company", "Favourite", "Card Leads"];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", designation: "", tags: "" });
  const [loading, setLoading] = useState(true);

  // Load leads from database
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const dbContacts: Contact[] = data.map((lead: any) => ({
          id: lead.id,
          name: `${lead.first_name} ${lead.last_name || ""}`.trim(),
          email: lead.email,
          phone: lead.phone,
          company: lead.company || "",
          designation: lead.designation || "",
          source: "Card Lead",
          favourite: false,
          tags: [],
          message: lead.message,
          created_at: lead.created_at,
        }));
        setContacts(dbContacts);
      }
      if (error) console.error("Error fetching leads:", error);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "Favourite") return matchSearch && c.favourite;
    if (activeTab === "Card Leads") return matchSearch && c.source === "Card Lead";
    if (activeTab === "Company") return matchSearch && c.company;
    return matchSearch;
  });

  const addContact = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    const newContact: Contact = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      designation: form.designation,
      source: "Manual",
      favourite: false,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
    };
    setContacts([newContact, ...contacts]);
    setForm({ name: "", email: "", phone: "", company: "", designation: "", tags: "" });
    setShowAdd(false);
    toast.success("Contact added successfully!");
  };

  const toggleFav = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, favourite: !c.favourite } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    setSelectedContact(null);
    toast.success("Contact deleted");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold font-display">My Contacts</h1>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setView("grid")} className={`p-2 rounded ${view === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 rounded ${view === "list" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            <List className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
            <Filter className="h-4 w-4" /> Filter
          </div>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent text-sm outline-none w-32" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading contacts...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-primary mb-2">Where your network comes together!</p>
          <p className="text-muted-foreground">Your added contacts and card leads will show up here</p>
        </div>
      ) : view === "list" ? (
        <div className="bg-card rounded-xl border divide-y">
          {filtered.map(c => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 cursor-pointer" onClick={() => setSelectedContact(c)}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.company}{c.designation ? ` • ${c.designation}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.source === "Card Lead" && (
                  <span className="text-[10px] text-primary/70 font-medium bg-primary/10 px-2 py-0.5 rounded-full">Card Lead</span>
                )}
                <button onClick={e => { e.stopPropagation(); toggleFav(c.id); }} className="p-1">
                  {c.favourite ? <Star className="h-4 w-4 text-warning fill-warning" /> : <StarOff className="h-4 w-4 text-muted-foreground" />}
                </button>
                <a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()} className="p-1"><Mail className="h-4 w-4 text-muted-foreground" /></a>
                <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="p-1"><Phone className="h-4 w-4 text-muted-foreground" /></a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelectedContact(c)} className="bg-card rounded-xl border p-4 hover:shadow-md cursor-pointer transition">
              <div className="flex justify-between mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <button onClick={e => { e.stopPropagation(); toggleFav(c.id); }}>
                  {c.favourite ? <Star className="h-4 w-4 text-warning fill-warning" /> : <StarOff className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.company}</p>
              {c.source === "Card Lead" && (
                <span className="text-[10px] text-primary/70 font-medium">● Card Lead</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <Input placeholder="Designation" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
            <Input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            <Button onClick={addContact} className="w-full">Add Contact</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent>
          {selectedContact && (
            <>
              <DialogHeader><DialogTitle>{selectedContact.name}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{selectedContact.designation}{selectedContact.company ? ` at ${selectedContact.company}` : ""}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {selectedContact.email}</p>
                  <p><strong>Phone:</strong> {selectedContact.phone || "—"}</p>
                  <p><strong>Source:</strong> {selectedContact.source}</p>
                  {selectedContact.message && <p><strong>Message:</strong> {selectedContact.message}</p>}
                  {selectedContact.created_at && (
                    <p><strong>Received:</strong> {new Date(selectedContact.created_at).toLocaleDateString()}</p>
                  )}
                  {selectedContact.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {selectedContact.tags.map(t => (
                        <span key={t} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteContact(selectedContact.id)} className="gap-1">
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
