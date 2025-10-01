import { v1BusinessListRetrieve } from "@/services/api/gen";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getBusinesses = createServerFn().handler(async () => {
  const cookie = getCookie("sessionid");

  const { data, error } = await v1BusinessListRetrieve({
    headers: {
      Cookie: cookie ? `sessionid=${cookie}` : "",
    },
  });
  console.log(data);
  return data;
});
