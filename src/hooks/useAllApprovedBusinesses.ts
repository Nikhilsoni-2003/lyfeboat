import { v1BusinessApprovedListRetrieve } from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";

export function useAllApprovedBusinesses() {
  return useQuery({
    queryKey: ["approved-businesses"],
    queryFn: async () => {
      const { data } = await v1BusinessApprovedListRetrieve();
      return data?.data;
    },
    staleTime: 1000 * 60,
  });
}
