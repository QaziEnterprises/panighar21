// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import InventoryPage from "@/pages/InventoryPage";

export const Route = createFileRoute("/inventory")({
  component: inventoryRoute,
});

function inventoryRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><InventoryPage /></AppLayout>;
}
