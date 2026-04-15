// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ExpensesPage from "@/pages/ExpensesPage";

export const Route = createFileRoute("/expenses")({
  component: expensesRoute,
});

function expensesRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><ExpensesPage /></AppLayout>;
}
