// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import LedgerPage from "@/pages/LedgerPage";

export const Route = createFileRoute("/ledger")({
  component: ledgerRoute,
});

function ledgerRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><LedgerPage /></AppLayout>;
}
