import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Diamond, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New contact added via QR scan", read: false, time: "2m ago" },
    { id: 2, text: "Team member accepted invite", read: false, time: "1h ago" },
    { id: 3, text: "Card shared 5 times today", read: true, time: "3h ago" },
  ]);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-card border-b flex items-center justify-between px-4 lg:px-6 h-14">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-secondary">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by Name, Company, Location..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/billing")}
          className="hidden sm:flex items-center gap-1.5 border border-primary text-primary rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-primary/5 transition"
        >
          <Diamond className="h-4 w-4" />
          UPGRADE
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-secondary transition"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-card border rounded-xl shadow-lg z-50 animate-fade-in">
              <div className="p-3 border-b flex justify-between items-center">
                <span className="font-semibold text-sm">Notifications</span>
                <button
                  onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`px-3 py-2.5 border-b last:border-0 text-sm ${!n.read ? "bg-primary/5" : ""}`}>
                  <p className="text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-1 p-1 rounded-lg hover:bg-secondary transition"
          >
            <div className="h-8 w-8 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold">
              VA
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-card border rounded-xl shadow-lg z-50 animate-fade-in">
              <button onClick={() => { navigate("/settings/app-preferences"); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary rounded-t-xl">
                <User className="h-4 w-4" /> Profile
              </button>
              <button onClick={() => { navigate("/settings/app-preferences"); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary">
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button onClick={() => { navigate("/billing"); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary">
                <Diamond className="h-4 w-4" /> Billing
              </button>
              <div className="border-t" />
              <button onClick={() => { signOut(); setShowProfile(false); navigate("/auth"); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-secondary rounded-b-xl">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
