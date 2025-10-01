import { z } from "zod";

export const PocListBusinessFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),

  email: z
    .string()
    .email("Invalid email")
    .max(254, "Email must be at most 254 characters"),

  phone: z
    .string()
    .min(10, "Phone must be minimum 10 characters")
    .max(15, "Phone must be at most 15 characters"),
});
