// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings, useSessionTimeout } from "@/hooks/useAppSettings";
import { initializeDefaultData } from "@/lib/store";
import { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import HomePage from "@/pages/HomePage";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const { user, role, loading } = useAuth();
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useAppSettings();

  const handleSessionTimeout = useCallback(async () => {
    if (!user) return;
    const { supabase } = await import("@/integrations/supabase/customClient");
    await supabase.auth.signOut();
    toast.warning("Session expired due to inactivity. Please log in again.");
    navigate({ to: "/login" });
  }, [user, navigate]);

  useSessionTimeout(handleSessionTimeout);

  useEffect(() => {
    initializeDefaultData()
      .then(() => setReady(true))
      .catch(() => setReady(true));
    const timer = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <HomePage />;
  }

  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
