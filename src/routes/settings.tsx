// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import SettingsPage from "@/pages/SettingsPage";

export const Route = createFileRoute("/settings")({
  component: settingsRoute,
});

function settingsRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><SettingsPage /></AppLayout>;
}
