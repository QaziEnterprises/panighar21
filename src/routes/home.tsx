// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";

export const Route = createFileRoute("/home")({
  component: homeRoute,
});

function homeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout><HomePage /></AppLayout>;
}
