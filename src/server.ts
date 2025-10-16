import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { setGetVisitorId, setupClient } from "./services/axios/client";

const customHandler = async (ctx: {
  request: Request;
  router: any;
  responseHeaders: Headers;
}) => {
  const cookieHeader = ctx.request.headers.get("cookie");
  const visitorId = cookieHeader?.match(/visitorId=([^;]+)/)?.[1];

  setGetVisitorId(() => visitorId);
  setupClient();

  return defaultStreamHandler(ctx);
};

const fetch = createStartHandler(customHandler);

export default {
  fetch,
};
