// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import POSPage from "@/pages/POSPage";

export const Route = createFileRoute("/pos")({
  component: posRoute,
});

function posRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><POSPage /></AppLayout>;
}
