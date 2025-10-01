import { v1PlansPlansDetailsRetrieve } from "@/services/api/gen";
import { createServerFn } from "@tanstack/react-start";

export const getPlanDetails = createServerFn().handler(async () => {
  const { data, error } = await v1PlansPlansDetailsRetrieve();
  return data;
});
