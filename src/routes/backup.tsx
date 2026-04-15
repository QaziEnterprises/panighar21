// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import BackupPage from "@/pages/BackupPage";

export const Route = createFileRoute("/backup")({
  component: backupRoute,
});

function backupRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><BackupPage /></AppLayout>;
}
