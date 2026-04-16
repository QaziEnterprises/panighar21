// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/audit")({
  component: () => <Navigate to="/dashboard" />,
});
