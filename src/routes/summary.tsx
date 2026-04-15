// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import SummaryPage from "@/pages/SummaryPage";

export const Route = createFileRoute("/summary")({
  component: summaryRoute,
});

function summaryRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><SummaryPage /></AppLayout>;
}
