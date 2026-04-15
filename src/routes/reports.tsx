// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ReportsPage from "@/pages/ReportsPage";

export const Route = createFileRoute("/reports")({
  component: reportsRoute,
});

function reportsRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><ReportsPage /></AppLayout>;
}
