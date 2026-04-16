// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ProductAnalyticsPage from "@/pages/ProductAnalyticsPage";

export const Route = createFileRoute("/product-analytics")({
  component: ProductAnalyticsRoute,
});

function ProductAnalyticsRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><ProductAnalyticsPage /></AppLayout>;
}
