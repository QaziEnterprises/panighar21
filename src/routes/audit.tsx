// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import AuditPage from "@/pages/AuditPage";

export const Route = createFileRoute("/audit")({
  component: auditRoute,
});

function auditRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;
  return <AppLayout><AuditPage /></AppLayout>;
}
