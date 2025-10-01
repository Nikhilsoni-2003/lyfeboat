import { z } from "zod";

export const KeywordsSchema = z.object({
  keywords: z
    .array(
      z.object({
        id: z.string().uuid(),
        key: z.string(),
      })
    )
    .nonempty({ message: "Domain is required" }),
});
