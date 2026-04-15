// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import BillsPage from "@/pages/BillsPage";

export const Route = createFileRoute("/bills")({
  component: billsRoute,
});

function billsRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><BillsPage /></AppLayout>;
}
