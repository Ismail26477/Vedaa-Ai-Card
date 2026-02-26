import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, CreditCard, UsersRound, BarChart3, Zap, Settings,
  Calendar, Link2, UserCog, Receipt, Key, CreditCard as CardIcon, SlidersHorizontal,
  ChevronLeft, Plus, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "My Card", icon: CreditCard, path: "/my-card" },
  { label: "My Team", icon: UsersRound, path: "/my-team" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Actions", icon: Zap, path: "/actions" },
];

const settingsNav = [
  { label: "Calendar", icon: Calendar, path: "/settings/calendar" },
  { label: "Integrations", icon: Link2, path: "/settings/integrations" },
  { label: "Manage Users", icon: UserCog, path: "/settings/manage-users" },
  { label: "Billing", icon: Receipt, path: "/billing" },
  { label: "Licenses", icon: Key, path: "/settings/licenses" },
  { label: "Card Settings", icon: CardIcon, path: "/settings/card-settings" },
  { label: "App Preferences", icon: SlidersHorizontal, path: "/settings/app-preferences" },
];

export default function AppSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const NavItem = ({ item }: { item: typeof mainNav[0] }) => (
    <button
      onClick={() => navigate(item.path)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        isActive(item.path)
          ? "bg-sidebar-active text-sidebar-active-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-hover"
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </button>
  );

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-foreground/30 z-30 lg:hidden" onClick={() => setCollapsed(true)} />
      )}
      <aside
        className={cn(
          "sidebar-gradient fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 shrink-0",
          collapsed ? "w-0 lg:w-16 overflow-hidden lg:overflow-visible" : "w-60"
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-sidebar-active flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-sidebar-active-foreground" />
              </div>
              <span className="text-sidebar-brand font-display font-bold text-lg">Vedaa AI</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-full bg-sidebar-active text-sidebar-active-foreground hover:opacity-90 transition"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {mainNav.map(item => <NavItem key={item.path} item={item} />)}

          {/* Settings section */}
          {!collapsed && (
            <p className="text-[11px] font-semibold text-sidebar-section uppercase tracking-wider mt-6 mb-2 px-3">
              Settings
            </p>
          )}
          {collapsed && <div className="my-4 border-t border-sidebar-border" />}
          {settingsNav.map(item => <NavItem key={item.path} item={item} />)}
        </nav>

        {/* Quick Create */}
        <div className="p-3">
          <button
            onClick={() => navigate("/my-card")}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-lg bg-sidebar-active text-sidebar-active-foreground py-2.5 font-medium text-sm hover:opacity-90 transition",
            )}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && "Quick Create"}
          </button>
        </div>
      </aside>
    </>
  );
}
