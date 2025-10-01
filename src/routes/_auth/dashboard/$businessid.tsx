import DashboardBusinessPage from "@/features/dashboard/components/user/DashboardBusinessPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard/$businessid")({
  component: DashboardBusinessPage,
});
