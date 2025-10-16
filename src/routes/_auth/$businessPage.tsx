import BusinessPage from "@/components/pages/BusinessPage";
import { Spinner } from "@/components/ui/spinner";
import { v1BusinessDetailsRetrieve } from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/$businessPage")({
  component: RouteComponent,
});

function RouteComponent() {
  const { businessPage: business_id } = Route.useParams();
  const {
    data: businessData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["business-details", business_id],
    queryFn: () =>
      v1BusinessDetailsRetrieve({
        path: { business_id: business_id },
      }),

    select: (res) => res.data?.data,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-lg font-semibold flex items-center justify-center gap-2">
          <Spinner />
          Loading...
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading business details</div>;

  return businessData && <BusinessPage data={businessData} />;
}
