import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";
import { setGetVisitorId, setupClient } from "./services/axios/client";

const handler = createStartHandler({
  createRouter,
})(defaultStreamHandler);

export default async (event: any) => {
  const cookieHeader = event.request.headers.get("cookie");
  const visitorId = cookieHeader?.match(/visitorId=([^;]+)/)?.[1];

  setGetVisitorId(() => visitorId);

  setupClient();

  return handler(event);
};
