import {
  v1ConfigurationChildrenRetrieve,
  type V1ConfigurationChildrenRetrieveData,
} from "@/services/api/gen";
import { createServerFn } from "@tanstack/react-start";

export const getConf = createServerFn()
  .validator((data: V1ConfigurationChildrenRetrieveData["path"]["key"]) => data)
  .handler(async (ctx) => {
    const { data, error } = await v1ConfigurationChildrenRetrieve({
      path: {
        key: ctx.data,
      },
    });
    // console.log("conf error", error);

    return data;
  });
