// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import AdminPage from "@/pages/AdminPage";

export const Route = createFileRoute("/admin")({
  component: adminRoute,
});

function adminRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;
  return <AppLayout><AdminPage /></AppLayout>;
}
