import { v1LoginIsLoggedInRetrieve } from "@/services/api/gen";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const checkLoggedIn = createServerFn().handler(async () => {
  const cookie = getCookie("sessionid");
  console.log("cookie", cookie);
  const { data, error } = await v1LoginIsLoggedInRetrieve({
    headers: {
      Cookie: cookie ? `sessionid=${cookie}` : "",
    },
  });
  return data?.data;
});
