// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ContactsPage from "@/pages/ContactsPage";

export const Route = createFileRoute("/contacts")({
  component: contactsRoute,
});

function contactsRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><ContactsPage /></AppLayout>;
}
