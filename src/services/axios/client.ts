import { handleError } from "@/helpers/funtions/handleError";
import { client } from "../api/gen/client.gen";

let getVisitorId: (() => string | undefined) | undefined;

export const setGetVisitorId = (fn: () => string | undefined) => {
  getVisitorId = fn;
};

export const setupClient = () => {
  client.setConfig({
    withCredentials: true,
  });

  client.instance.interceptors.request.use((request) => {
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

  client.instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      handleError(error);
      return Promise.reject(error);
    }
  );
};
