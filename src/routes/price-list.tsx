// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PriceListPage from "@/pages/PriceListPage";

export const Route = createFileRoute("/price-list")({
  component: price_listRoute,
});

function price_listRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><PriceListPage /></AppLayout>;
}
