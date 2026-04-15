// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ProductsPage from "@/pages/ProductsPage";

export const Route = createFileRoute("/products-db")({
  component: products_dbRoute,
});

function products_dbRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><ProductsPage /></AppLayout>;
}
