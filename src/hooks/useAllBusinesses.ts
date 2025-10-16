import { v1BusinessAdminListRetrieve } from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";

export function useAllBusinesses() {
  return useQuery({
    queryKey: ["all-businesses"],
    queryFn: async () => {
      const { data } = await v1BusinessAdminListRetrieve();
      return data?.data;
    },
    staleTime: 1000 * 60,
  });
}
