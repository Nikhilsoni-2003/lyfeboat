import { handleError } from "@/helpers/funtions/handleError";
import { client } from "../api/gen/client.gen";

let getVisitorId: (() => string | undefined) | undefined;

export const setGetVisitorId = (fn: () => string | undefined) => {
  getVisitorId = fn;
};

export const setupClient = () => {
  client.setConfig({
    baseUrl: "https://localhost:8001",
    // baseUrl: "https://uat.lyfeboat.in",
    // baseUrl: "https://api.lyfeboat.in",
    credentials: "include",
  });

  client.interceptors.request.use((request) => {
    let visitorId: string | undefined;

    if (typeof document !== "undefined") {
      visitorId = document.cookie.match(/visitorId=([^;]+)/)?.[1];
    } else if (getVisitorId) {
      visitorId = getVisitorId();
    }

    if (visitorId) {
      request.headers.set("x-visitor-id", visitorId);
    }

    return request;
  });

  client.interceptors.response.use(function (response, request, option) {
    handleError(response);
    return response;
  });
};
