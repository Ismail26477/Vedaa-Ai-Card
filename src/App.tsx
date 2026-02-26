import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import MyCard from "./pages/MyCard";
import MyTeam from "./pages/MyTeam";
import Analytics from "./pages/Analytics";
import Actions from "./pages/Actions";
import SettingsPage from "./pages/SettingsPage";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/settings/CalendarPage";
import IntegrationsPage from "./pages/settings/IntegrationsPage";
import ManageUsersPage from "./pages/settings/ManageUsersPage";
import LicensesPage from "./pages/settings/LicensesPage";
import CardSettingsPage from "./pages/settings/CardSettingsPage";
import AppPreferencesPage from "./pages/settings/AppPreferencesPage";
import PublicCard from "./pages/PublicCard";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/my-card" element={<MyCard />} />
              <Route path="/my-team" element={<MyTeam />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/calendar" element={<CalendarPage />} />
              <Route path="/settings/integrations" element={<IntegrationsPage />} />
              <Route path="/settings/manage-users" element={<ManageUsersPage />} />
              <Route path="/settings/licenses" element={<LicensesPage />} />
              <Route path="/settings/card-settings" element={<CardSettingsPage />} />
              <Route path="/settings/app-preferences" element={<AppPreferencesPage />} />
            </Route>
            <Route path="/card/:id" element={<PublicCard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

