import AdminDashboard from "@/features/adminDashboard";
import { useBusinesses } from "@/hooks/useBusinesses";
import {
  createFileRoute,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data: businesses, isLoading } = useBusinesses();
  const context = useRouteContext({ from: "__root__" });
  const { useUserStore } = context;
  const { isAdmin } = useUserStore();

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    if (
      !isLoading &&
      Array.isArray(businesses) &&
      businesses.length > 0 &&
      businesses[0]?.id
    ) {
      navigate({
        to: "/dashboard/$businessid",
        params: { businessid: businesses[0].id },
      });
    }
  }, [isLoading, businesses, navigate]);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <div>loading...</div>;
  // return <UserDashboard />;
}
