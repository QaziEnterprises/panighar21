// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ProfitCalculatorPage from "@/pages/ProfitCalculatorPage";

export const Route = createFileRoute("/profit")({
  component: profitRoute,
});

function profitRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><ProfitCalculatorPage /></AppLayout>;
}
