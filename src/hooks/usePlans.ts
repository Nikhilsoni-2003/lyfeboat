import { v1PlansPlansDetailsRetrieve } from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data } = await v1PlansPlansDetailsRetrieve();
      return data?.data ?? [];
    },
    staleTime: Infinity,
  });
}
