import { z } from "zod";

export const LocationListBusinessFormSchema = z.object({
  address_line_1: z
    .string()
    .min(1, "Address Line 1 is required")
    .max(255, "Address Line 1 must be at most 255 characters"),

  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),

  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be at most 100 characters"),

  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be at most 100 characters"),

  postal_code: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code must be at most 20 characters"),
});
