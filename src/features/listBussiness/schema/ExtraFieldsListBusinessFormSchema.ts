import { z } from "zod";

export const KeyValueItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string().min(1, "ID is required"),
    key: z.string().min(1, "Key is required"),
    value: z.string().optional(),
    children: z.array(z.lazy(() => KeyValueItemSchema)),
  })
);

export const DynamicFieldsSchema = z.array(KeyValueItemSchema);
