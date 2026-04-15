// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PurchasesPage from "@/pages/PurchasesPage";

export const Route = createFileRoute("/purchases")({
  component: purchasesRoute,
});

function purchasesRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><PurchasesPage /></AppLayout>;
}
