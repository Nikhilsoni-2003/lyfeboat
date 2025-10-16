import { Button } from "@/components/ui/button";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { toast } from "sonner";
import LocationSetter from "./pages/Home/LocationSetter";
import SearchBusinesses from "./pages/Home/SearchBusinesses";

const ListBusinessFeatLazy = lazy(() =>
  import("../features/listBussiness/index").then((m) => ({
    default: m.default,
  }))
);

export function SearchBar() {
  const {
    data: businesses,
    isLoading: businessLoading,
    refetch,
  } = useBusinesses();
  const context = useRouteContext({ from: "__root__" });
  const { useUserStore } = context;
  const { isAdmin, isLoggedIn, isProfileCompleted } = useUserStore();

  const navigate = useNavigate();

  const goToDashboard = () => {
    if (isAdmin) {
      navigate({ to: "/dashboard" });
      return;
    }

    if (!isLoggedIn) {
      toast.info("Kindly login to list business", {
        action: {
          label: "Visit",
          onClick: () => navigate({ to: "/login" }),
        },
      });
      return;
    }

    if (!isProfileCompleted && isLoggedIn) {
      toast.info("Kindly complete profile to list business", {
        action: {
          label: "Visit",
          onClick: () => navigate({ to: "/profile?update=true" }),
        },
      });
      return;
    }

    if (!businessLoading && (!businesses || businesses.length === 0)) {
      toast.info("List a business to go to dashboard");
      return;
    }

    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex justify-between flex-col md:flex-row gap-5 items-center">
      <div className="flex md:space-x-3 flex-col md:flex-row gap-5 w-full justify-center items-center md:justify-start">
        <LocationSetter />
        <SearchBusinesses />
      </div>

      <div className="flex-col flex md:flex-row gap-5">
        <Button onClick={goToDashboard}>Go to Dashboard</Button>
        <Suspense fallback={null}>
          <ListBusinessFeatLazy refetch={refetch} />
        </Suspense>
      </div>
    </div>
  );
}
