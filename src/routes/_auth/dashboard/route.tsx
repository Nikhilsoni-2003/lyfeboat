import DashboardFeat from "@/features/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardFeat />;
}
