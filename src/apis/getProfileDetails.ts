import { v1ProfileProfileDetailRetrieve } from "@/services/api/gen";
import { createServerFn } from "@tanstack/react-start";

export const getProfileDetails = createServerFn().handler(async () => {
  const { data, error } = await v1ProfileProfileDetailRetrieve();

  return data;
});

// Non-server function version
export async function getProfileDetailsClient() {
  const { data, error } = await v1ProfileProfileDetailRetrieve();
  return data;
}
