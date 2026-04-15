// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";
import LoginPage from "@/pages/LoginPage";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return <LoginPage />;
}
