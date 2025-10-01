import { v1BusinessListRetrieve } from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";

export function useBusinesses() {
  return useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const { data } = await v1BusinessListRetrieve();
      return data?.data;
    },
    staleTime: 1000 * 60,
  });
}
