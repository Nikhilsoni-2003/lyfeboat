import {
  v1ConfigurationChildrenRetrieve,
  type V1ConfigurationChildrenRetrieveData,
} from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";

export function useConf(
  key: V1ConfigurationChildrenRetrieveData["path"]["key"]
) {
  return useQuery({
    queryKey: ["conf", key],
    queryFn: async () => {
      const { data } = await v1ConfigurationChildrenRetrieve({
        path: { key },
      });
      return data?.data ?? [];
    },
    staleTime: Infinity,
  });
}
